
import React, { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button, Icon } from '../components/ui/Base';
import { Sheet } from '../components/ui/LayoutComponents';
import { Breadcrumb } from '../components/ui/DataDisplay';
import { ElementRenderer } from '../components/LessonRenderer';
import { useAppContext } from '../context/AppContext';
import { useLesson } from '../hooks/useContent';
import { MathRenderer } from '../components/MathRenderer';
import { useScrollSpy } from '../hooks/useScrollSpy';
import { LessonHeader } from '../components/lesson/LessonHeader';
import { LessonSidebar } from '../components/lesson/LessonSidebar';
import { BOX_TYPES } from '../components/lesson/BoxConfig';

const Lesson: React.FC = () => {
    const { chapterId } = useParams<{ chapterId: string }>();
    const { dispatch, getChapterProgress } = useAppContext();
    
    const { data: lessonData, isLoading, error } = useLesson(chapterId);
    const progress = getChapterProgress(chapterId || "");
    const checkedSections = progress.lesson.checkedSections || [];
    const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
    
    // Reading Progress Bar State
    const [readingProgress, setReadingProgress] = useState(0);

    // Handle Scroll Progress
    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = (scrollTop / docHeight) * 100;
            setReadingProgress(scrolled);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Calculation of IDs for ScrollSpy
    const spyIds = useMemo(() => {
        if (!lessonData || !lessonData.sections) return [];
        const ids: string[] = [];
        lessonData.sections.forEach((s, i) => {
            ids.push(`section-${i}`);
            s.subsections?.forEach((_, j) => ids.push(`sub-${i}-${j}`));
        });
        return ids;
    }, [lessonData]);

    const activeSubsection = useScrollSpy(spyIds);

    const totalCheckableItems = useMemo(() => {
        if (!lessonData || !lessonData.sections) return 0;
        return lessonData.sections.reduce((acc, section) => acc + (section.subsections?.length || 0), 0);
    }, [lessonData]);

    // --- Advanced Numbering Logic ---
    const numberingMap = useMemo(() => {
        if (!lessonData || !lessonData.sections) return {};
        const counts: Record<string, number> = {};
        const map: Record<string, number> = {};

        const EXCLUDED_TYPES = ['demo-box', 'proof-box', 'activity-box'];

        lessonData.sections.forEach((section, sIdx) => {
            section.subsections?.forEach((sub, subIdx) => {
                sub.elements?.forEach((el, elIdx) => {
                    if (BOX_TYPES[el.type] && !EXCLUDED_TYPES.includes(el.type)) {
                        const currentCount = (counts[el.type] || 0) + 1;
                        counts[el.type] = currentCount;
                        const key = `${sIdx}-${subIdx}-${elIdx}`;
                        map[key] = currentCount;
                    }
                });
            });
        });
        return map;
    }, [lessonData]);

    useEffect(() => {
        if (!chapterId || totalCheckableItems === 0) return;
        const checkedCount = checkedSections.length;
        const newPercentage = Math.round((checkedCount / totalCheckableItems) * 100);
        
        if (newPercentage !== progress.lesson.percentage || progress.lesson.totalSections !== totalCheckableItems) {
            dispatch({ 
                type: 'UPDATE_LESSON_PERCENTAGE', 
                payload: { chapterId, percentage: newPercentage, totalCount: totalCheckableItems } 
            });
        }
    }, [checkedSections.length, totalCheckableItems, chapterId, dispatch, progress.lesson.percentage, progress.lesson.totalSections]);

    const handleToggleSection = (subsectionId: string) => {
        if (!chapterId) return;
        dispatch({ type: 'TOGGLE_SECTION', payload: { chapterId, sectionId: subsectionId, totalCount: totalCheckableItems } });
    };

    const getSectionLetter = (index: number) => String.fromCharCode(65 + index);

    // --- Loading State ---
    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="animate-spin w-10 h-10 border-4 border-slate-900 border-t-transparent rounded-full"></div>
            </div>
        );
    }

    // --- Error State (Display validation errors) ---
    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
                <div className="max-w-2xl w-full bg-white border-l-4 border-rose-500 shadow-lg p-8 rounded-r-lg">
                    <div className="flex items-start gap-4">
                        <div className="p-3 bg-rose-50 rounded-full text-rose-500">
                            <Icon name="bug_report" className="text-3xl" />
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-slate-900 font-display uppercase tracking-tight mb-2">
                                Erreur de Contenu
                            </h2>
                            <p className="text-slate-600 mb-4">
                                Le fichier de leçon pour ce chapitre contient des erreurs et ne peut pas être affiché.
                            </p>
                            <div className="bg-slate-900 text-slate-200 p-4 rounded font-mono text-sm leading-relaxed overflow-x-auto border border-slate-800">
                                {error.message}
                            </div>
                            <div className="mt-6 flex gap-4">
                                <Link to="/dashboard">
                                    <Button variant="secondary" size="sm">Retour au Dashboard</Button>
                                </Link>
                                <Button variant="outline" size="sm" onClick={() => window.location.reload()}>Réessayer</Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!lessonData) return null;

    return (
        <div className="min-h-screen bg-math-pattern animate-fadeIn">
            
            {/* Reading Progress Bar (Fixed Top) */}
            <div className="fixed top-0 left-0 w-full h-1.5 bg-slate-100 z-[100]">
                <div 
                    className="h-full bg-amber-500 transition-all duration-150 ease-out shadow-[0_0_10px_rgba(245,158,11,0.5)]" 
                    style={{ width: `${readingProgress}%` }}
                ></div>
            </div>

            <div className="container mx-auto px-4 md:px-8 py-12 max-w-7xl flex gap-12 items-start relative">
                
                {/* MAIN CONTENT */}
                <div className="flex-1 min-w-0 pb-24">
                     
                     <Breadcrumb items={[
                        { label: 'Tableau de bord', link: '/dashboard' },
                        { label: 'Chapitre', link: `/chapter/${chapterId}` },
                        { label: 'Leçon' }
                     ]} />

                     <LessonHeader 
                        classe={lessonData.header.classe}
                        title={lessonData.header.title}
                        subtitle={lessonData.header.subtitle}
                     />

                     {/* Content Rendering */}
                     <div className="space-y-20">
                        {lessonData.sections?.map((section, idx) => (
                            <section key={idx} id={`section-${idx}`} className="relative scroll-mt-32">
                                {/* Section Header: Pure & Elegant */}
                                <div className="flex items-baseline gap-4 mb-8">
                                    <div className="flex-shrink-0">
                                        <span className="text-4xl font-display font-black text-slate-900 select-none">
                                            {getSectionLetter(idx)}.
                                        </span>
                                    </div>
                                    <h2 className="text-3xl font-display font-bold text-slate-900 leading-tight pt-1 tracking-tight">
                                        <MathRenderer expression={section.title} inline />
                                    </h2>
                                </div>

                                <div className="space-y-12">
                                    {section.subsections?.map((sub, subIdx) => (
                                        <div key={subIdx} id={`sub-${idx}-${subIdx}`} className="group/sub scroll-mt-32">
                                            <div className="flex items-baseline gap-3 mb-6">
                                                <div className="text-2xl font-bold text-slate-800 font-display select-none opacity-40">
                                                    {subIdx + 1}.
                                                </div>
                                                <h3 className="text-xl font-bold text-slate-900 font-display tracking-tight">
                                                    <MathRenderer expression={sub.title} inline />
                                                </h3>
                                            </div>
                                            
                                            <div className="prose-container pl-0 md:pl-2">
                                                {sub.elements?.map((el, i) => (
                                                    <div key={i}>
                                                        <ElementRenderer 
                                                            element={el} 
                                                            index={idx * 1000 + subIdx * 100 + i}
                                                            itemNumber={numberingMap[`${idx}-${subIdx}-${i}`]} 
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        ))}
                     </div>

                     {/* Bottom Action */}
                     <div className="mt-24 mb-10 flex justify-center">
                        {progress.lesson.isRead ? (
                            <Link to={`/chapter/${chapterId}/quiz`}>
                                <Button variant="primary" size="lg" icon="emoji_events" className="px-12 py-4 text-lg shadow-xl shadow-slate-900/10 hover:shadow-slate-900/20 bg-slate-900 hover:bg-slate-800 rounded-none uppercase tracking-widest font-bold">
                                    Accéder au Quiz
                                </Button>
                            </Link>
                        ) : (
                            <div className="p-6 bg-white border-2 border-dashed border-slate-300 text-slate-500 text-sm font-medium flex flex-col items-center gap-3 max-w-md text-center">
                                <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-400"><Icon name="auto_stories" /></div>
                                <span>Complétez toutes les sections du sommaire pour valider la leçon.</span>
                            </div>
                        )}
                     </div>
                </div>

                {/* SIDEBAR DESKTOP */}
                <LessonSidebar 
                    lessonData={lessonData}
                    activeSubsection={activeSubsection}
                    checkedSections={checkedSections}
                    totalCheckableItems={totalCheckableItems}
                    onToggleSection={handleToggleSection}
                />

                {/* MOBILE FAB & SHEET */}
                <div className="lg:hidden fixed bottom-6 right-6 z-50">
                     <button 
                        onClick={() => setIsMobileMenuOpen(true)}
                        className="w-14 h-14 bg-slate-900 text-white rounded-full shadow-xl flex items-center justify-center relative transition-transform active:scale-90 border-2 border-white"
                     >
                        <Icon name="menu_book" className="text-xl" />
                        <span className="absolute -top-1 -right-1 w-5 h-5 bg-amber-500 text-white rounded-full border border-white flex items-center justify-center text-[9px] font-bold">
                            {Math.round((checkedSections.length / totalCheckableItems) * 100)}%
                        </span>
                     </button>
                </div>

                <Sheet isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} title="Sommaire du cours">
                     <div className="pb-10 px-2">
                        <div className="space-y-6">
                            {lessonData.sections?.map((section, idx) => (
                                <div key={idx}>
                                    <h4 className="font-bold text-slate-900 mb-3 flex items-start gap-3 border-b border-slate-100 pb-2">
                                        <span className="text-xs font-black bg-slate-900 text-white px-1.5 py-0.5">{getSectionLetter(idx)}.</span> 
                                        <span className="font-display text-sm uppercase tracking-wide pt-0.5">
                                            <MathRenderer expression={section.title} inline />
                                        </span>
                                    </h4>
                                    <div className="pl-2 space-y-2">
                                        {section.subsections?.map((sub, subIdx) => {
                                            const id = `sub-${idx}-${subIdx}`;
                                            const isChecked = checkedSections.includes(id);
                                            return (
                                                <div key={subIdx} className="flex items-start justify-between p-2 rounded active:bg-slate-50" onClick={() => {
                                                    handleToggleSection(id);
                                                    setIsMobileMenuOpen(false);
                                                    const el = document.getElementById(id);
                                                    if(el) el.scrollIntoView();
                                                }}>
                                                    <div className="flex gap-3 pr-4">
                                                        <span className="font-bold text-slate-400 text-xs mt-0.5">{subIdx + 1}.</span>
                                                        <span className={`text-sm leading-snug ${isChecked ? 'text-slate-400' : 'text-slate-700 font-medium'}`}>
                                                            <MathRenderer expression={sub.title} inline />
                                                        </span>
                                                    </div>
                                                    
                                                    {/* Mobile Elegant Checkbox -> Modern X */}
                                                    <div className={`flex-shrink-0 w-6 h-6 border transition-all duration-200 flex items-center justify-center mt-0.5 rounded-sm ${isChecked ? 'bg-slate-900 border-slate-900' : 'bg-white border-slate-300'}`}>
                                                        {isChecked && <Icon name="close" className="text-white text-sm font-bold" />}
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                            ))}
                        </div>
                     </div>
                </Sheet>
            </div>
        </div>
    );
};

export default Lesson;
