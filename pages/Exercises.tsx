
import React, { useEffect, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Breadcrumb } from '../components/ui/DataDisplay';
import { Button } from '../components/ui/Base';
import { ExerciseFeedback } from '../types';
import { useAppContext } from '../context/AppContext';
import { useExercises, useCurriculum } from '../hooks/useContent';
import { ExerciseCard } from '../components/exercises/ExerciseCard';

const Exercises: React.FC = () => {
    const { chapterId } = useParams<{ chapterId: string }>();
    const { state, dispatch, getChapterProgress } = useAppContext();
    const { data } = useExercises(chapterId);
    const { data: curriculum } = useCurriculum();
    
    const exercises = data.exercises;
    const progress = getChapterProgress(chapterId || "");
    const startTimeRef = useRef(Date.now());

    useEffect(() => {
        startTimeRef.current = Date.now();
        return () => {
            if (chapterId) {
                const duration = Math.round((Date.now() - startTimeRef.current) / 1000);
                dispatch({ type: 'UPDATE_EXERCISE_DURATION', payload: { chapterId, durationAdd: duration } });
            }
        };
    }, [chapterId, dispatch]);

    let chapterTitle = "Exercices";
    if (curriculum && chapterId) {
        const classInfo = curriculum.levels[state.classId];
        const chapterInfo = classInfo?.chapters.find(c => c.id === chapterId);
        if (chapterInfo) chapterTitle = chapterInfo.title;
    }

    const handleRate = (exerciseId: string, feedback: ExerciseFeedback) => {
        dispatch({ type: 'RATE_EXERCISE', payload: { chapterId: chapterId || "", exerciseId, feedback } });
    };

    const completedCount = Object.keys(progress.exercises.feedbackMap).length;

    return (
        <div className="min-h-screen bg-math-pattern pb-32 animate-fadeIn">
            <div className="container mx-auto px-6 md:px-12 pt-12 max-w-5xl">
                <Breadcrumb items={[
                    { label: 'Tableau de bord', link: '/dashboard' },
                    { label: 'Chapitre', link: `/chapter/${chapterId}` },
                    { label: 'Exercices' },
                ]} />

                {/* Header Architectural */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 border-b-2 border-slate-900 pb-8">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <span className="px-3 py-1 bg-slate-900 text-white text-[10px] font-bold uppercase tracking-[0.2em]">
                                Entraînement
                            </span>
                        </div>
                        <h1 className="text-4xl font-display font-black text-slate-900 mb-2 uppercase tracking-tight">
                            {chapterTitle}
                        </h1>
                    </div>
                    <div className="flex items-center gap-4 bg-white px-6 py-4 rounded-lg border-2 border-slate-200 shadow-sm">
                         <div className="text-right">
                             <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Progression</div>
                             <div className="text-2xl font-black text-slate-900 font-display leading-none">
                                {completedCount} <span className="text-lg text-slate-300 font-normal">/ {exercises.length}</span>
                             </div>
                         </div>
                    </div>
                </div>

                <div className="space-y-12">
                    {exercises.map((exo, i) => (
                        <ExerciseCard 
                            key={exo.id} 
                            exercise={exo} 
                            index={i} 
                            currentFeedback={progress.exercises.feedbackMap[exo.id]}
                            onRate={(f) => handleRate(exo.id, f)}
                        />
                    ))}
                </div>
                
                <div className="mt-24 flex justify-center">
                     <Link to={`/chapter/${chapterId}`}>
                        <Button variant="primary" size="lg" icon="check" className="px-12 py-4 bg-slate-900 hover:bg-slate-800 shadow-xl shadow-slate-900/10 uppercase tracking-widest font-bold rounded-none">
                            Terminer la séance
                        </Button>
                     </Link>
                </div>
            </div>
        </div>
    );
};

export default Exercises;
