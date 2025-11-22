
import React from 'react';
import { Icon, Button } from '../ui/Base';
import { ProcessedContent } from '../LessonRenderer';
import { QuizQuestion as IQuizQuestion } from '../../types';

interface QuizQuestionProps {
    question: IQuizQuestion;
    currentIndex: number;
    totalQuestions: number;
    selectedOption: number | null;
    isAnswered: boolean;
    isReviewMode?: boolean;
    onOptionSelect: (index: number) => void;
    onValidate: () => void;
    onNext: () => void;
}

export const QuizQuestionCard: React.FC<QuizQuestionProps> = ({
    question,
    currentIndex,
    totalQuestions,
    selectedOption,
    isAnswered,
    isReviewMode = false,
    onOptionSelect,
    onValidate,
    onNext
}) => {
    const isLastQuestion = currentIndex === totalQuestions - 1;

    return (
        <div className="relative bg-white rounded-2xl border border-slate-200 p-8 md:p-12 shadow-xl shadow-slate-200/50">
            
            <div className="relative z-10 mt-2">
                 <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-10 leading-relaxed font-display tracking-tight">
                    <ProcessedContent text={question.question} disableInteractions />
                </h2>

                <div className="space-y-4 mb-12">
                    {question.options.map((option, idx) => {
                        let containerClass = "border-2 border-slate-100 bg-white hover:border-slate-300 cursor-pointer";
                        let markerClass = "bg-slate-100 text-slate-500";
                        let textClass = "text-slate-600";
                        let icon = null;
                        
                        // State: Selected by User
                        if (selectedOption === idx) {
                            containerClass = "border-2 border-slate-900 bg-slate-50 shadow-md";
                            markerClass = "bg-slate-900 text-white";
                            textClass = "text-slate-900 font-bold";
                        }
                        
                        // State: Answered / Review
                        if (isAnswered) {
                            containerClass += " cursor-default hover:border-slate-200 hover:bg-white"; // Disable hover effects
                            
                            if (option.is_correct) {
                                // Correct Answer (Always Green)
                                containerClass = "border-2 border-emerald-500 bg-emerald-50/30";
                                markerClass = "bg-emerald-500 text-white";
                                textClass = "text-emerald-900 font-bold";
                                icon = <Icon name="check_circle" className="text-emerald-600 text-2xl" filled />;
                            } else if (selectedOption === idx) {
                                // User Wrong Selection (Red)
                                containerClass = "border-2 border-rose-500 bg-rose-50/30";
                                markerClass = "bg-rose-500 text-white";
                                textClass = "text-rose-900 font-bold";
                                icon = <Icon name="cancel" className="text-rose-500 text-2xl" filled />;
                            } else {
                                // Irrelevant Option
                                containerClass = "border-2 border-slate-50 opacity-40";
                            }
                        }

                        return (
                            <div
                                key={idx}
                                onClick={() => !isReviewMode && onOptionSelect(idx)}
                                className={`w-full text-left p-5 rounded-xl font-medium transition-all duration-200 flex items-center gap-6 relative overflow-hidden ${containerClass}`}
                            >
                                <div className={`w-10 h-10 flex items-center justify-center text-base font-bold flex-shrink-0 transition-colors rounded-lg ${markerClass}`}>
                                    {String.fromCharCode(65 + idx)}
                                </div>
                                <div className={`flex-1 text-lg leading-snug ${textClass}`}>
                                    <ProcessedContent text={option.text} disableInteractions />
                                </div>
                                <div className="flex-shrink-0">{icon}</div>
                            </div>
                        );
                    })}
                </div>

                {isAnswered && (
                    <div className="relative overflow-hidden bg-white rounded-xl border-2 border-dashed border-amber-300 p-8 mb-10 group animate-fadeIn">
                        {/* Decorative Background Icon */}
                        <div className="absolute -right-6 -bottom-8 text-amber-50 opacity-60 transform rotate-12 group-hover:scale-110 transition-transform duration-700 pointer-events-none">
                             <Icon name="lightbulb" className="text-[10rem]" filled />
                        </div>

                        <div className="relative z-10">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center border border-amber-200 text-amber-600 shadow-sm">
                                    <Icon name="lightbulb" className="text-xl" filled />
                                </div>
                                <span className="text-xs font-black text-amber-600 uppercase tracking-[0.25em]">Éclairage</span>
                            </div>
                            <div className="text-slate-700 text-lg leading-relaxed font-body pl-2">
                                <ProcessedContent text={question.options.find(o => o.is_correct)?.explanation || ''} disableInteractions />
                            </div>
                        </div>
                    </div>
                )}

                <div className="flex justify-end">
                     {!isAnswered ? (
                         <Button variant="primary" onClick={onValidate} disabled={selectedOption === null} size="lg" className="px-12 py-4 bg-slate-900 hover:bg-slate-800 shadow-xl rounded-xl uppercase tracking-widest font-bold text-xs transition-transform active:scale-95">
                            Valider la réponse
                         </Button>
                     ) : (
                         <Button 
                            variant={isLastQuestion && !isReviewMode ? "success" : "primary"} 
                            onClick={onNext} 
                            size="lg" 
                            className={`px-12 py-4 shadow-xl rounded-xl uppercase tracking-widest font-bold text-xs transition-transform active:scale-95 ${isLastQuestion && !isReviewMode ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-slate-900 hover:bg-slate-800'}`}
                         >
                            {isLastQuestion ? (isReviewMode ? 'Quitter la révision' : 'Terminer le Quiz') : 'Question Suivante'} 
                            <Icon name={isLastQuestion ? "check" : "arrow_forward"} />
                         </Button>
                     )}
                </div>
            </div>
        </div>
    );
};
