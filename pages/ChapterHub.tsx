
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Icon } from '../components/ui/Base';
import { ProgressBar, Breadcrumb } from '../components/ui/DataDisplay';
import { Card } from '../components/ui/LayoutComponents';
import { useAppContext } from '../context/AppContext';
import { GlobalWorkSubmit } from '../components/GlobalWorkSubmit';
import { useCurriculum } from '../hooks/useContent';
import { useChapterProgress } from '../hooks/useProgress';

const HubStepCard: React.FC<{ 
    step: number; 
    title: string; 
    description: string;
    status: 'locked' | 'waiting' | 'active' | 'completed';
    link?: string;
    metaText?: string;
    progress?: number;
}> = ({ step, title, description, status, link, metaText, progress }) => {
    const navigate = useNavigate();
    const isLocked = status === 'locked' || status === 'waiting';
    const isActive = status === 'active';
    const isCompleted = status === 'completed';

    return (
        <div 
            className={`
                relative h-full p-6 rounded-xl border-2 transition-all duration-300 flex flex-col group
                ${isActive 
                    ? 'bg-white border-slate-900 shadow-xl shadow-slate-200/50 z-10' 
                    : isCompleted 
                        ? 'bg-white border-emerald-100 shadow-sm' 
                        : 'bg-slate-50 border-dashed border-slate-300 opacity-70 hover:opacity-100'
                }
            `}
        >
            {/* Step Indicator - Elegant & Artistic */}
            <div className="flex justify-between items-start mb-4">
                <div className={`text-5xl font-black font-display leading-none -ml-1 ${isActive ? 'text-slate-900' : 'text-slate-200 group-hover:text-slate-300'}`}>
                    {step}.
                </div>
                
                {/* Status Icon */}
                <div className={`
                    w-8 h-8 rounded-full flex items-center justify-center border
                    ${isActive ? 'bg-slate-900 text-white border-slate-900' : 
                      isCompleted ? 'bg-emerald-500 text-white border-emerald-500' : 
                      'bg-transparent text-slate-400 border-slate-300'}
                `}>
                    <Icon name={isCompleted ? "check" : isLocked ? "lock" : "arrow_forward"} className="text-sm" />
                </div>
            </div>

            <div className="flex-1 mb-6">
                <h3 className={`text-lg font-bold mb-2 leading-tight ${isLocked ? 'text-slate-400' : 'text-slate-900'}`}>
                    {title}
                </h3>
                <p className={`text-sm leading-relaxed ${isLocked ? 'text-slate-400' : 'text-slate-500'}`}>
                    {description}
                </p>
            </div>

            <div className="mt-auto pt-4 border-t border-slate-100/50">
                {isActive && (
                    <div className="animate-fadeIn">
                       <div className="flex justify-between text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                         <span>{metaText}</span>
                         <span>{progress}%</span>
                       </div>
                       <ProgressBar progress={progress || 0} height="h-1.5" bg="bg-slate-100" color="bg-slate-900" />
                       <button 
                         onClick={() => link && navigate(link)}
                         className="mt-4 w-full py-2.5 bg-slate-900 text-white text-xs font-bold uppercase tracking-widest rounded-lg hover:bg-slate-800 transition-all hover:shadow-lg flex items-center justify-center gap-2 active:scale-[0.98]"
                       >
                         Commencer <Icon name="arrow_forward" />
                       </button>
                    </div>
                )}
                
                {status === 'waiting' && (
                     <div className="w-full py-2.5 text-center text-xs font-bold text-slate-400 uppercase tracking-widest border border-dashed border-slate-300 rounded-lg select-none cursor-not-allowed">
                        En attente
                     </div>
                )}
                
                {isCompleted && (
                     <button 
                        className="w-full py-2.5 text-emerald-700 bg-emerald-50 border border-emerald-100 text-xs font-bold uppercase tracking-widest rounded-lg hover:bg-emerald-100 transition-colors flex items-center justify-center gap-2 active:scale-[0.98]"
                        onClick={() => link && navigate(link)}
                     >
                        <Icon name="refresh" /> Revoir
                     </button>
                )}
            </div>
        </div>
    );
};

const ChapterHub: React.FC = () => {
    const { chapterId } = useParams<{ chapterId: string }>();
    const { state } = useAppContext();
    const { data: curriculum } = useCurriculum();
    
    const stats = useChapterProgress(chapterId);
    
    let chapterTitle = "Chargement...";
    if (curriculum && chapterId) {
        const classLevel = curriculum.levels[state.classId];
        const chapter = classLevel?.chapters.find(c => c.id === chapterId);
        if (chapter) chapterTitle = chapter.title;
    }

    const lessonStatus = stats.isLessonDone ? 'completed' : 'active';
    const quizStatus = stats.isLessonDone ? (stats.isQuizDone ? 'completed' : 'active') : 'waiting';
    const exerciseStatus = stats.isQuizDone ? (stats.isExercisesStarted ? 'completed' : 'active') : 'waiting';

    return (
        <div className="min-h-screen animate-fadeIn bg-slate-50 pb-32">
            
            <div className="container mx-auto px-6 md:px-12 pt-10 max-w-6xl relative z-10">
                <Breadcrumb items={[
                    { label: 'Tableau de bord', link: '/dashboard' },
                    { label: 'Chapitre' }
                ]} />

                {/* Page Header - Clean & Professional */}
                <div className="mb-12 pb-8 border-b border-slate-200">
                     <div className="flex items-center gap-3 mb-4">
                        <div className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-widest text-white ${stats.isChapterCompleted ? 'bg-emerald-500' : 'bg-slate-900'}`}>
                            Chapitre
                        </div>
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Parcours d'apprentissage</span>
                     </div>

                    <h1 className="text-3xl md:text-5xl font-display font-bold text-slate-900 leading-tight mb-4">
                        {chapterTitle}
                    </h1>
                    <p className="text-slate-500 text-lg max-w-2xl leading-relaxed">
                        Suivez les étapes ci-dessous pour valider ce chapitre et obtenir votre certification de réussite.
                    </p>
                </div>

                {/* Steps Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 items-stretch">
                    <HubStepCard 
                        step={1}
                        title="Leçon Interactive"
                        description="Lecture intégrale du cours avec exemples et démonstrations."
                        status={lessonStatus}
                        link={`/chapter/${chapterId}/lesson`}
                        metaText="Lecture"
                        progress={stats.lessonPercent}
                    />
                    
                    <HubStepCard 
                        step={2}
                        title="Quiz de Validation"
                        description="Évaluation des connaissances acquises (QCM)."
                        status={quizStatus}
                        link={`/chapter/${chapterId}/quiz`}
                        metaText="Score"
                        progress={stats.quizPercent}
                    />

                    <HubStepCard 
                        step={3}
                        title="Exercices Pratiques"
                        description="Mise en application et résolution de problèmes."
                        status={exerciseStatus}
                        link={`/chapter/${chapterId}/exercises`}
                        metaText="Avancement"
                        progress={stats.exercisesCount > 0 ? 100 : 0} 
                    />
                </div>

                {/* Validation Section */}
                <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl border border-slate-200 text-center shadow-sm">
                     <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                        <Icon name="verified_user" className="text-2xl" />
                     </div>
                     <h2 className="text-xl font-bold text-slate-900 mb-2">Validation du Chapitre</h2>
                     <p className="text-slate-500 mb-8 text-sm">
                        {!stats.canSubmitGlobal 
                            ? "Complétez toutes les étapes pour débloquer l'envoi." 
                            : "Excellent travail ! Vous pouvez maintenant soumettre votre progression."}
                     </p>
                     
                     <div className="flex justify-center">
                        <GlobalWorkSubmit 
                            chapterId={chapterId || ""} 
                            chapterTitle={chapterTitle}
                            isReady={stats.canSubmitGlobal} 
                            isSubmitted={stats.isChapterCompleted}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChapterHub;
