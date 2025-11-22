
import React from 'react';
import { SubQuestion } from '../../types';
import { ProcessedContent } from '../LessonRenderer';
import { ImageRenderer } from '../lesson/ImageRenderer';

export const QuestionLine: React.FC<{ question: SubQuestion; index: number; isSub?: boolean }> = ({ question, index, isSub }) => {
    const label = question.questionNumber 
        ? `${question.questionNumber}.` 
        : (isSub ? `${String.fromCharCode(97 + index)}.` : `${index + 1}.`);

    return (
        <div className={`mb-8 last:mb-0 ${isSub ? 'ml-6 md:ml-12 mt-4' : ''}`}>
            <div className="flex flex-col md:flex-row gap-4 md:gap-6 items-start">
                
                {/* Numbering Column */}
                <div className="flex-shrink-0 pt-0.5">
                    <span className={`font-display font-bold text-slate-900 block text-right select-none ${isSub ? 'text-sm text-slate-500' : 'text-xl'}`}>
                        {label}
                    </span>
                </div>

                {/* Content Column */}
                <div className="flex-1 min-w-0">
                    <div className={`text-slate-800 leading-relaxed text-justify ${isSub ? 'text-sm' : 'text-base font-medium'}`}>
                        <ProcessedContent text={question.text} />
                    </div>

                    {/* Image Part */}
                    {question.image && (
                        <div className="mt-4 w-full max-w-md">
                            <ImageRenderer 
                                image={question.image} 
                                disableFloat={true} 
                                className="border border-slate-100 bg-white p-1 shadow-sm rounded-lg" 
                            />
                        </div>
                    )}

                    {/* Sub-Sub Questions */}
                    {question.sub_sub_questions && (
                        <div className="mt-4 space-y-3">
                            {question.sub_sub_questions.map((sub, i) => (
                                <div key={i} className="flex gap-3 items-baseline">
                                    <span className="text-xs font-bold text-slate-400 font-mono">{String.fromCharCode(97 + i)}.</span>
                                    <div className="text-slate-600 text-sm leading-relaxed"><ProcessedContent text={sub.text} /></div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
