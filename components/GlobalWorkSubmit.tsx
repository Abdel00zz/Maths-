import React, { useState } from 'react';
import { Button, Icon } from './ui/Base';
import { Modal } from './ui/LayoutComponents';
import { useAppContext } from '../context/AppContext';

interface GlobalWorkSubmitProps {
    chapterId: string;
    chapterTitle: string;
    isReady: boolean;
    isSubmitted: boolean;
}

export const GlobalWorkSubmit: React.FC<GlobalWorkSubmitProps> = ({ chapterId, chapterTitle, isReady, isSubmitted }) => {
    const { state, dispatch, curriculum } = useAppContext();
    const [showConfirm, setShowConfirm] = useState(false);
    const [sending, setSending] = useState(false);

    const handleSubmit = async () => {
        setSending(true);
        
        // 1. Construct the specific JSON payload
        const progress = state.progress[chapterId];
        
        // Get version from curriculum
        const level = curriculum?.levels[state.classId];
        const chapterInfo = level?.chapters.find(c => c.id === chapterId);
        const version = chapterInfo ? `v${chapterInfo.version}.0-${Math.random().toString(16).slice(2, 8)}` : "v1.0.0-unknown";
        const fullLevelName = level ? level.title : state.classId;

        // Date Formatting
        const now = new Date();
        const formattedDate = now.toLocaleDateString('fr-FR', { 
            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', 
            hour: '2-digit', minute: '2-digit', second: '2-digit' 
        }).replace(':', 'h');

        const exerciseFeedback = progress.exercises.feedbackMap || {};
        const totalDuration = (progress.quiz.durationSeconds || 0) + (progress.exercises.durationSeconds || 0);

        const finalPayload = {
            studentName: state.studentName,
            studentLevel: fullLevelName,
            submissionDate: formattedDate,
            timestamp: now.getTime(),
            results: [
                {
                    chapter: chapterTitle,
                    version: version,
                    lesson: {
                        completed: progress.lesson.checkedSections.length,
                        total: progress.lesson.totalSections,
                        percentage: progress.lesson.percentage
                    },
                    quiz: {
                        score: Number(progress.quiz.score.toFixed(2)),
                        scoreRaw: `${progress.quiz.scoreRaw} / ${progress.quiz.totalQuestions}`,
                        durationSeconds: progress.quiz.durationSeconds,
                        hintsUsed: progress.quiz.hintsUsed || 0,
                        answers: progress.quiz.answers
                    },
                    exercisesFeedback: exerciseFeedback,
                    exercisesDurationSeconds: progress.exercises.durationSeconds || 0,
                    totalDurationSeconds: totalDuration
                }
            ]
        };

        // 2. Simulate Network Request
        await new Promise(resolve => setTimeout(resolve, 1500));
        console.log("--- PAYLOAD SENT ---", finalPayload);

        dispatch({ type: 'SUBMIT_CHAPTER', payload: { chapterId } });
        setSending(false);
        setShowConfirm(false);
    };

    if (isSubmitted) {
        return (
            <div className="w-full md:w-auto animate-fadeIn">
                <div className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-8 py-3 rounded-lg flex items-center justify-center gap-3 shadow-sm">
                   <div className="bg-emerald-100 rounded-full p-1">
                       <Icon name="verified" className="text-xl" filled />
                   </div>
                   <span className="font-bold uppercase tracking-wider text-xs">Travail validé & envoyé</span>
                </div>
            </div>
        );
    }

    return (
        <>
            <Button 
                variant={isReady ? "primary" : "secondary"} 
                className={`w-full md:w-auto px-8 py-4 ${!isReady && "bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed shadow-none"}`} 
                disabled={!isReady}
                onClick={() => isReady && setShowConfirm(true)}
            >
               <Icon name="send" /> Envoyer mon travail
            </Button>

            <Modal isOpen={showConfirm} onClose={() => !sending && setShowConfirm(false)} title="Validation Finale">
                <div className="text-center p-4">
                    <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6 text-blue-600 border-4 border-blue-100 animate-pulse">
                        <Icon name="rocket_launch" className="text-4xl" />
                    </div>
                    <h4 className="text-xl font-black text-slate-900 mb-2 font-display uppercase tracking-tight">Prêt à décoller ?</h4>
                    <p className="text-slate-500 mb-8 leading-relaxed">
                        Vous allez soumettre vos résultats pour le chapitre <strong>{chapterTitle}</strong>.<br/>
                        Assurez-vous d'avoir terminé tous les exercices.
                    </p>
                    <div className="flex gap-4 justify-center">
                        <Button variant="ghost" onClick={() => setShowConfirm(false)} disabled={sending}>Annuler</Button>
                        <Button variant="primary" onClick={handleSubmit} disabled={sending} className="bg-blue-600 hover:bg-blue-700 px-8">
                            {sending ? (
                                <span className="flex items-center gap-2">
                                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                                    Envoi...
                                </span>
                            ) : "Confirmer l'envoi"}
                        </Button>
                    </div>
                </div>
            </Modal>
        </>
    );
};