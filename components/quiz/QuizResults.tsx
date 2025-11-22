
import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Icon } from '../ui/Base';

interface QuizResultsProps {
    scoreRaw: number;
    totalQuestions: number;
    chapterId: string | undefined;
    onReview: () => void;
    onRetry?: () => void;
}

export const QuizResults: React.FC<QuizResultsProps> = ({ scoreRaw, totalQuestions, chapterId, onReview }) => {
    const percentage = Math.round((scoreRaw / totalQuestions) * 100);
    const isSuccess = percentage >= 50;

    return (
        <div className="min-h-[calc(100vh-80px)] flex items-center justify-center bg-math-pattern p-6 animate-fadeIn">
            <div className="max-w-lg w-full p-10 text-center bg-white rounded-2xl border border-slate-200 shadow-2xl relative overflow-hidden">
                 
                 <div className="relative z-10">
                    {/* Icon Circle */}
                    <div className={`w-24 h-24 mx-auto mb-8 flex items-center justify-center rounded-full shadow-lg ${isSuccess ? 'bg-emerald-500 text-white' : 'bg-slate-900 text-white'}`}>
                        <Icon name={isSuccess ? "emoji_events" : "psychology"} className="text-5xl" filled />
                    </div>

                    <h2 className="text-3xl font-display font-black text-slate-900 mb-2 uppercase tracking-tight">
                        {isSuccess ? "Félicitations !" : "Quiz Terminé"}
                    </h2>
                    <p className="text-slate-500 mb-10 font-medium uppercase tracking-widest text-xs">
                        Score enregistré
                    </p>
                    
                    {/* Score Display */}
                    <div className="flex justify-center items-baseline gap-2 mb-10">
                        <span className="text-7xl font-black text-slate-900 font-display leading-none tracking-tight">
                            {percentage}<span className="text-4xl text-slate-300 ml-1">%</span>
                        </span>
                    </div>
                    
                    <div className="mb-10 flex justify-center">
                        <div className="inline-flex items-center gap-3 px-5 py-2 bg-slate-50 rounded-full border border-slate-100">
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Réponses correctes</span>
                            <span className="text-lg font-black text-slate-900 font-mono">{scoreRaw} / {totalQuestions}</span>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="space-y-4">
                        {/* Primary Action: Go to Exercises */}
                        <Link to={`/chapter/${chapterId}/exercises`} className="block">
                            <Button variant="primary" fullWidth size="lg" className="bg-slate-900 hover:bg-slate-800 uppercase tracking-widest font-bold rounded-xl h-14 shadow-lg hover:shadow-xl transition-all transform active:scale-95">
                                Passer aux Exercices <Icon name="fitness_center" className="ml-2" />
                            </Button>
                        </Link>

                        <div className="grid grid-cols-2 gap-4">
                            <Link to={`/chapter/${chapterId}`}>
                                <Button variant="outline" fullWidth className="uppercase tracking-widest font-bold text-xs border-slate-200 text-slate-500 hover:border-slate-900 hover:text-slate-900 h-12">
                                    Chapitre
                                </Button>
                            </Link>
                            <Button variant="ghost" fullWidth onClick={onReview} className="uppercase tracking-widest font-bold text-xs text-slate-500 hover:text-slate-900 hover:bg-slate-50 h-12">
                                <Icon name="visibility" /> Revoir
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
