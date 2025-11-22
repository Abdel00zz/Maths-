
import React, { useState, useEffect, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Icon, Button } from '../components/ui/Base';
import { ProgressBar } from '../components/ui/DataDisplay';
import { useAppContext } from '../context/AppContext';
import { useQuiz } from '../hooks/useContent';
import { QuizQuestionCard } from '../components/quiz/QuizQuestion';
import { QuizResults } from '../components/quiz/QuizResults';

const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
};

const Quiz: React.FC = () => {
    const { chapterId } = useParams<{chapterId: string}>();
    const { dispatch, getChapterProgress } = useAppContext();
    
    const { data } = useQuiz(chapterId);
    const quizQuestions = data.questions;

    // Global State
    const progress = getChapterProgress(chapterId || "");
    const { isSubmitted, answers: savedAnswers, scoreRaw: savedScore, durationSeconds: savedDuration } = progress.quiz;

    // Local State
    const [currentQIndex, setCurrentQIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [isAnswered, setIsAnswered] = useState(false);
    const [userAnswers, setUserAnswers] = useState<Record<string, number>>({});
    const [scoreRaw, setScoreRaw] = useState(0);
    
    // Timer State
    const [elapsedTime, setElapsedTime] = useState(savedDuration || 0);
    
    // View State
    const [viewState, setViewState] = useState<'playing' | 'results' | 'review'>('playing');
    
    const startTimeRef = useRef<number>(Date.now());
    // Ref to track state for cleanup saving
    const stateRef = useRef({ userAnswers: {}, scoreRaw: 0 });

    // --- Initialization Effect ---
    useEffect(() => {
        if (isSubmitted) {
            // Load previous session data
            setUserAnswers(savedAnswers);
            setScoreRaw(savedScore);
            setViewState('results'); // Go directly to results
        } else {
            // Load incomplete session data
            setUserAnswers(savedAnswers);
            setScoreRaw(savedScore);
            // Find the first unanswered question
            const answeredIds = Object.keys(savedAnswers);
            const firstUnansweredIndex = quizQuestions.findIndex(q => !answeredIds.includes(q.id));
            if (firstUnansweredIndex !== -1) {
                setCurrentQIndex(firstUnansweredIndex);
            }
            
            startTimeRef.current = Date.now();
        }
    }, [isSubmitted, savedAnswers, savedScore, quizQuestions]);

    // Keep ref synced for cleanup
    useEffect(() => {
        stateRef.current = { userAnswers, scoreRaw };
    }, [userAnswers, scoreRaw]);

    // --- Timer & Auto-Save Effect ---
    useEffect(() => {
        if (isSubmitted || viewState !== 'playing') return;
        
        // Reset start time on mount/resume
        startTimeRef.current = Date.now();
        const initialDuration = savedDuration || 0;

        // Timer Interval for UI
        const timer = setInterval(() => {
            const sessionSeconds = Math.floor((Date.now() - startTimeRef.current) / 1000);
            setElapsedTime(initialDuration + sessionSeconds);
        }, 1000);

        return () => {
            clearInterval(timer);
            
            // Intelligent Auto-Save on Unmount / Pause
            if (chapterId && !isSubmitted) {
                const sessionSeconds = Math.floor((Date.now() - startTimeRef.current) / 1000);
                const totalDuration = initialDuration + sessionSeconds;
                
                dispatch({
                    type: 'UPDATE_QUIZ_SESSION',
                    payload: {
                        chapterId,
                        answers: stateRef.current.userAnswers,
                        scoreRaw: stateRef.current.scoreRaw,
                        durationSeconds: totalDuration
                    }
                });
            }
        };
    }, [isSubmitted, viewState, savedDuration, chapterId, dispatch]);

    const question = quizQuestions[currentQIndex];
    const isReviewMode = viewState === 'review' || isSubmitted;

    // --- Logic ---

    const handleOptionSelect = (index: number) => {
        if (isAnswered || isReviewMode) return;
        setSelectedOption(index);
    };

    const handleValidate = () => {
        if (selectedOption === null || isReviewMode) return;
        
        setIsAnswered(true);
        const correct = question.options[selectedOption].is_correct;
        
        setUserAnswers(prev => ({ ...prev, [question.id]: selectedOption }));
        if (correct) setScoreRaw(s => s + 1);
    };

    const submitQuiz = () => {
        const finalPercentage = Math.round((scoreRaw / quizQuestions.length) * 100);
        
        dispatch({ 
            type: 'SUBMIT_QUIZ', 
            payload: { 
                chapterId: chapterId || "", 
                scorePercent: finalPercentage,
                scoreRaw: scoreRaw,
                totalQuestions: quizQuestions.length,
                answers: userAnswers,
                durationSeconds: elapsedTime // Use current tracked time
            } 
        });
        
        setViewState('results');
    };

    const handleNext = () => {
        if (currentQIndex < quizQuestions.length - 1) {
            setCurrentQIndex(prev => prev + 1);
            // In review mode, we don't reset selection, we load it from history
            if (!isReviewMode) {
                setSelectedOption(null);
                setIsAnswered(false);
            }
        } else {
            // Last Question Action
            if (isReviewMode) {
                setViewState('results');
            } else {
                // Direct Submission without Modal
                submitQuiz();
            }
        }
    };

    const handleEnterReview = () => {
        setViewState('review');
        setCurrentQIndex(0);
    };

    const resetQuiz = () => {
        // Reset Logic (clears everything for a fresh start)
        setCurrentQIndex(0);
        setScoreRaw(0);
        setUserAnswers({});
        setViewState('playing');
        setSelectedOption(null);
        setIsAnswered(false);
        startTimeRef.current = Date.now();
        setElapsedTime(0);
    };

    // Determine state for current question in Review Mode
    useEffect(() => {
        if (isReviewMode) {
            const savedAnswer = userAnswers[question.id];
            setSelectedOption(savedAnswer !== undefined ? savedAnswer : null);
            setIsAnswered(true); // Always show explanation in review
        }
    }, [currentQIndex, isReviewMode, userAnswers, question.id]);


    // --- Render Results ---
    if (viewState === 'results') {
        return (
            <QuizResults 
                scoreRaw={scoreRaw} 
                totalQuestions={quizQuestions.length} 
                chapterId={chapterId} 
                onReview={handleEnterReview}
            />
        );
    }

    // --- Render Quiz/Review ---
    const progressPercent = ((currentQIndex + 1) / quizQuestions.length) * 100;

    return (
        <div className="min-h-screen bg-math-pattern py-12 animate-fadeIn">
            <div className="max-w-4xl mx-auto px-6">
                
                {/* Header */}
                <div className="mb-8 flex justify-between items-end">
                     <div className="flex flex-col">
                        <Link to={`/chapter/${chapterId}`} className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors mb-2">
                            <Icon name="arrow_back" /> Quitter
                        </Link>
                        <h1 className="text-xl font-black text-slate-900 font-display uppercase tracking-tight flex items-center gap-3">
                            {isReviewMode ? "Mode Révision" : "Quiz en cours"}
                            {isReviewMode && <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-[10px] rounded-full">Lecture seule</span>}
                        </h1>
                     </div>
                     
                     <div className="flex flex-col items-end gap-2">
                        {/* Real-time Timer */}
                        {!isReviewMode && (
                            <div className="flex items-center gap-2 bg-white border border-slate-200 px-3 py-1.5 rounded-lg shadow-sm">
                                <div className="w-2 h-2 bg-rose-500 rounded-full animate-pulse"></div>
                                <span className="font-mono text-sm font-bold text-slate-700 tracking-wider">
                                    {formatTime(elapsedTime)}
                                </span>
                            </div>
                        )}
                        
                        <div className="text-4xl font-black font-display text-slate-900 leading-none">
                            {String(currentQIndex + 1).padStart(2, '0')} <span className="text-2xl text-slate-300 font-medium">/ {String(quizQuestions.length).padStart(2, '0')}</span>
                        </div>
                     </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-10">
                    <ProgressBar 
                        progress={progressPercent} 
                        height="h-1.5" 
                        color={isReviewMode ? "bg-blue-500" : "bg-slate-900"} 
                        bg="bg-slate-200" 
                    />
                </div>

                {/* Question Card */}
                <QuizQuestionCard 
                    question={question}
                    currentIndex={currentQIndex}
                    totalQuestions={quizQuestions.length}
                    selectedOption={selectedOption}
                    isAnswered={isAnswered}
                    isReviewMode={isReviewMode}
                    onOptionSelect={handleOptionSelect}
                    onValidate={handleValidate}
                    onNext={handleNext}
                />
            </div>
        </div>
    );
};

export default Quiz;
