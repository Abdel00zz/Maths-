
import React, { useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Icon } from '../ui/Base';
import { MathRenderer } from '../MathRenderer';
import { LessonData } from '../../types';
import { useAutoScrollToActive } from '../../hooks/useScrollSpy';

interface LessonSidebarProps {
    lessonData: LessonData;
    activeSubsection: string;
    checkedSections: string[];
    totalCheckableItems: number;
    onToggleSection: (id: string) => void;
}

export const LessonSidebar: React.FC<LessonSidebarProps> = ({
    lessonData,
    activeSubsection,
    checkedSections,
    totalCheckableItems,
    onToggleSection
}) => {
    const { chapterId } = useParams<{ chapterId: string }>();
    const [isCollapsed, setIsCollapsed] = useState(false);
    const summaryRef = useRef<HTMLDivElement>(null);

    const scrollToElement = (id: string) => {
        const el = document.getElementById(id);
        if (el) {
            const yOffset = -100; 
            const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
            window.scrollTo({ top: y, behavior: 'smooth' });
        }
    };

    useAutoScrollToActive(activeSubsection, summaryRef);

    const getSectionLetter = (index: number) => String.fromCharCode(65 + index);
    const progressPercent = totalCheckableItems > 0 ? Math.round((checkedSections.length / totalCheckableItems) * 100) : 0;
    const isComplete = totalCheckableItems > 0 && checkedSections.length === totalCheckableItems;

    return (
        <div className="hidden lg:block w-80 sticky top-8 h-fit transition-all duration-300 z-20">
            {/* Container: Chic & Cool -> Neo-Brutalist Border with Hard Shadow */}
            <div className="rounded-xl border-2 border-slate-900 bg-white overflow-hidden flex flex-col max-h-[85vh] transition-all shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[-2px] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                
                {/* Header Integrated Progress */}
                <div 
                    className="px-5 py-5 border-b-2 border-slate-100 flex items-center gap-4 cursor-pointer hover:bg-slate-50 transition-colors"
                    onClick={() => setIsCollapsed(!isCollapsed)}
                >
                    <span className="font-display font-black uppercase tracking-widest text-xs text-slate-900 shrink-0">
                        Sommaire
                    </span>
                    
                    {/* Progress Bar Situated Next to Word */}
                    <div className="flex-1 flex items-center gap-2 min-w-0">
                        <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                            <div 
                                className="h-full bg-slate-900 transition-all duration-500 ease-out" 
                                style={{ width: `${progressPercent}%` }}
                            ></div>
                        </div>
                        <span className="text-[10px] font-black text-slate-900 font-mono">
                            {progressPercent}%
                        </span>
                    </div>
                </div>
                
                {/* Content List */}
                <div 
                    ref={summaryRef}
                    className={`overflow-y-auto custom-scrollbar transition-all duration-500 ease-in-out ${isCollapsed ? 'max-h-0 opacity-0' : 'flex-1 opacity-100'}`}
                >
                    <div className="py-6 px-4 space-y-8">
                        {lessonData.sections?.map((section, idx) => {
                            const sectionId = `section-${idx}`;
                            
                            return (
                                <div key={idx}>
                                    {/* Section Header */}
                                    <button 
                                        id={`summary-item-${sectionId}`}
                                        onClick={() => scrollToElement(sectionId)}
                                        className="w-full text-left mb-3 group pl-2"
                                    >
                                        <div className="flex items-baseline gap-3">
                                            {/* Number in Black as requested */}
                                            <span className="text-base font-black text-slate-900 font-display bg-slate-100 px-1.5 rounded-md">
                                                {getSectionLetter(idx)}.
                                            </span>
                                            <span className="text-xs font-bold font-display text-slate-700 uppercase tracking-wide transition-colors group-hover:text-black">
                                                <MathRenderer expression={section.title} inline />
                                            </span>
                                        </div>
                                    </button>
                                    
                                    {/* Subsections - No vertical lines */}
                                    <div className="space-y-1 mt-1 ml-4 pl-2"> 
                                        {section.subsections?.map((sub, subIdx) => {
                                            const uniqueId = `sub-${idx}-${subIdx}`;
                                            const isChecked = checkedSections.includes(uniqueId);
                                            const isActiveSub = activeSubsection === uniqueId;
                                            
                                            return (
                                                <div 
                                                    key={subIdx} 
                                                    id={`summary-item-${uniqueId}`}
                                                    className={`group/item flex items-start justify-between py-2 pl-3 pr-2 transition-all duration-200 cursor-pointer rounded-lg mb-1
                                                        ${isActiveSub 
                                                            ? 'bg-slate-100' 
                                                            : 'bg-transparent hover:bg-slate-50'}
                                                    `}
                                                    onClick={() => scrollToElement(uniqueId)}
                                                >
                                                    {/* Title */}
                                                    <div className={`text-[11px] font-medium leading-relaxed pr-3 flex-1 transition-colors font-body
                                                        ${isActiveSub ? 'text-slate-900 font-bold' : 'text-slate-500 group-hover/item:text-slate-700'}
                                                    `}>
                                                        <span className={`mr-2 font-mono text-[9px] text-slate-900 ${isActiveSub ? 'opacity-100 font-bold' : 'opacity-40'}`}>{subIdx + 1}.</span>
                                                        <MathRenderer expression={sub.title} inline />
                                                    </div>

                                                    {/* Checkbox */}
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            onToggleSection(uniqueId);
                                                        }}
                                                        className={`
                                                            flex-shrink-0 w-4 h-4 flex items-center justify-center transition-all duration-200 rounded-[4px] border-2
                                                            ${isChecked 
                                                                ? 'bg-slate-900 border-slate-900 text-white' 
                                                                : (isActiveSub ? 'border-slate-400 bg-white' : 'border-slate-200 bg-white hover:border-slate-400')}
                                                        `}
                                                    >
                                                        {isChecked && <Icon name="check" className="text-[10px] font-bold" />}
                                                    </button>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Completion Footer */}
                {isComplete && !isCollapsed && (
                    <div className="p-4 mt-auto bg-slate-50 border-t-2 border-slate-100 text-center">
                        <Link to={`/chapter/${chapterId}/quiz`} className="block group">
                            <button className="w-full py-3 text-white bg-slate-900 text-[10px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-2 hover:bg-slate-800 rounded-lg transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                                Passer au Quiz <Icon name="arrow_forward" className="text-xs transition-transform group-hover:translate-x-1" />
                            </button>
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};
