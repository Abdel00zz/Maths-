
import React from 'react';
import { Icon } from '../ui/Base';
import { Exercise, ExerciseFeedback } from '../../types';
import { ProcessedContent } from '../LessonRenderer';
import { ImageRenderer } from '../lesson/ImageRenderer';
import { QuestionLine } from './QuestionLine';

export const ExerciseCard: React.FC<{ exercise: Exercise; index: number; currentFeedback?: ExerciseFeedback; onRate: (f: ExerciseFeedback) => void }> = ({ exercise, index, currentFeedback, onRate }) => {
    const isEvaluated = !!currentFeedback;

    return (
        <div className={`mb-12 relative p-8 md:p-10 rounded-2xl transition-all duration-500 bg-white group
            ${isEvaluated 
                ? 'border border-slate-200 shadow-xl' 
                : 'border border-slate-100 shadow-sm hover:shadow-lg hover:border-slate-300'
            }
        `}>
            
            {/* Header: Chic & Minimalist */}
            <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-10">
                 <div className="flex flex-col gap-2">
                     <div className="flex items-center gap-4">
                        {/* Large Number */}
                        <span className="text-5xl md:text-6xl font-black font-display text-slate-100 leading-none select-none">
                            {String(index + 1).padStart(2, '0')}
                        </span>
                        <div className="h-12 w-px bg-slate-100 hidden md:block"></div>
                        <h3 className="text-xl md:text-2xl font-bold text-slate-800 font-display tracking-tight leading-tight pt-1">
                            {exercise.title}
                        </h3>
                     </div>
                 </div>

                 {/* Evaluation UI - Floating Pill */}
                 <div className="flex bg-white rounded-full p-1 border border-slate-100 shadow-sm">
                    {[
                        { val: 'Facile', icon: 'sentiment_satisfied', activeClass: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200' },
                        { val: 'Moyen', icon: 'sentiment_neutral', activeClass: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200' },
                        { val: 'Difficile', icon: 'sentiment_dissatisfied', activeClass: 'bg-rose-50 text-rose-700 ring-1 ring-rose-200' }
                    ].map((opt) => (
                        <button 
                            key={opt.val}
                            onClick={() => onRate(opt.val as ExerciseFeedback)}
                            className={`px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all flex items-center gap-2
                                ${currentFeedback === opt.val 
                                    ? `${opt.activeClass} scale-105` 
                                    : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'}
                            `}
                        >
                           <Icon name={opt.icon} className="text-base" /> <span className="hidden sm:inline">{opt.val}</span>
                        </button>
                    ))}
                 </div>
            </div>

            <div className="relative z-10">
                {/* Statement - Elegant Serif Block */}
                <div className="mb-10">
                    <div className="text-lg text-slate-700 font-serif leading-relaxed">
                        <ProcessedContent text={exercise.statement} />
                    </div>
                </div>

                {/* Global Images */}
                {exercise.images && exercise.images.length > 0 && (
                    <div className="mb-12 flex flex-wrap gap-8 justify-center">
                        {exercise.images.map((img, imgIdx) => (
                            <div key={imgIdx} className="w-full md:w-auto max-w-full hover:scale-[1.01] transition-transform duration-500">
                                <ImageRenderer image={img} disableFloat={true} className="max-h-[350px] w-auto mx-auto rounded-lg shadow-md" />
                            </div>
                        ))}
                    </div>
                )}

                {/* Questions - Clean Layout */}
                <div className="space-y-6 pl-0 md:pl-2">
                    {exercise.sub_questions.map((q, i) => (
                        <QuestionLine key={i} question={q} index={i} />
                    ))}
                </div>
            </div>
        </div>
    );
};
