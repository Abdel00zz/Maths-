
import { AppState, ChapterProgress, ExerciseFeedback, AppNotification } from '../types';

export const initialChapterProgress: ChapterProgress = {
    lesson: { isRead: false, percentage: 0, checkedSections: [], totalSections: 0, highlights: [], revealedBlanks: [] },
    quiz: { isSubmitted: false, score: 0, scoreRaw: 0, totalQuestions: 0, attempts: 0, durationSeconds: 0, hintsUsed: 0, answers: {} },
    exercises: { feedbackMap: {}, durationSeconds: 0, lastActive: 0 },
    isSubmitted: false
};

export type Action =
    | { type: 'LOGIN'; payload: { name: string; classId: string } }
    | { type: 'TOGGLE_SECTION'; payload: { chapterId: string; sectionId: string; totalCount: number } }
    | { type: 'UPDATE_LESSON_PERCENTAGE'; payload: { chapterId: string; percentage: number; totalCount: number } }
    | { type: 'TOGGLE_HIGHLIGHT'; payload: { chapterId: string; tokenId: string } }
    | { type: 'REVEAL_BLANK'; payload: { chapterId: string; blankId: string } }
    | { 
        type: 'SUBMIT_QUIZ'; 
        payload: { 
            chapterId: string; 
            scorePercent: number; 
            scoreRaw: number; 
            totalQuestions: number;
            answers: Record<string, number>;
            durationSeconds: number;
        } 
    }
    | { 
        type: 'UPDATE_QUIZ_SESSION'; 
        payload: { 
            chapterId: string; 
            answers: Record<string, number>;
            scoreRaw: number;
            durationSeconds: number;
        } 
    }
    | { type: 'RATE_EXERCISE'; payload: { chapterId: string; exerciseId: string; feedback: ExerciseFeedback } }
    | { type: 'UPDATE_EXERCISE_DURATION'; payload: { chapterId: string; durationAdd: number } }
    | { type: 'SUBMIT_CHAPTER'; payload: { chapterId: string } }
    | { type: 'ADD_NOTIFICATION'; payload: AppNotification }
    | { type: 'MARK_NOTIFICATION_READ'; payload: { id: string } }
    | { type: 'MARK_ALL_NOTIFICATIONS_READ' }
    | { type: 'CLEAR_NOTIFICATIONS' }
    | { type: 'LOGOUT' };

export const appReducer = (state: AppState, action: Action): AppState => {
    switch (action.type) {
        case 'LOGIN':
            return { ...state, studentName: action.payload.name, classId: action.payload.classId };
            
        case 'TOGGLE_SECTION': {
            const { chapterId, sectionId, totalCount } = action.payload;
            const current = state.progress[chapterId] || initialChapterProgress;
            const currentChecked = current.lesson.checkedSections || [];
            
            const exists = currentChecked.includes(sectionId);
            const newChecked = exists 
                ? currentChecked.filter(id => id !== sectionId)
                : [...currentChecked, sectionId];

            return {
                ...state,
                progress: {
                    ...state.progress,
                    [chapterId]: {
                        ...current,
                        lesson: {
                            ...current.lesson,
                            checkedSections: newChecked,
                            totalSections: totalCount,
                            percentage: Math.round((newChecked.length / totalCount) * 100)
                        }
                    }
                }
            };
        }

        case 'UPDATE_LESSON_PERCENTAGE': {
            const { chapterId, percentage, totalCount } = action.payload;
            const current = state.progress[chapterId] || initialChapterProgress;
            return {
                ...state,
                progress: {
                    ...state.progress,
                    [chapterId]: {
                        ...current,
                        lesson: {
                            ...current.lesson,
                            percentage: percentage,
                            totalSections: totalCount,
                            isRead: percentage === 100
                        }
                    }
                }
            };
        }

        case 'TOGGLE_HIGHLIGHT': {
            const { chapterId, tokenId } = action.payload;
            const current = state.progress[chapterId] || initialChapterProgress;
            const currentHighlights = current.lesson.highlights || [];
            
            const exists = currentHighlights.includes(tokenId);
            const newHighlights = exists 
                ? currentHighlights.filter(id => id !== tokenId)
                : [...currentHighlights, tokenId];

            return {
                ...state,
                progress: {
                    ...state.progress,
                    [chapterId]: {
                        ...current,
                        lesson: {
                            ...current.lesson,
                            highlights: newHighlights
                        }
                    }
                }
            };
        }

        case 'REVEAL_BLANK': {
            const { chapterId, blankId } = action.payload;
            const current = state.progress[chapterId] || initialChapterProgress;
            const currentRevealed = current.lesson.revealedBlanks || [];
            
            const isAlreadyRevealed = currentRevealed.includes(blankId);
            const newRevealed = isAlreadyRevealed 
                ? currentRevealed.filter(id => id !== blankId) 
                : [...currentRevealed, blankId];

            return {
                ...state,
                progress: {
                    ...state.progress,
                    [chapterId]: {
                        ...current,
                        lesson: {
                            ...current.lesson,
                            revealedBlanks: newRevealed
                        }
                    }
                }
            };
        }

        case 'SUBMIT_QUIZ': {
            const { chapterId, scorePercent, scoreRaw, totalQuestions, answers, durationSeconds } = action.payload;
            const current = state.progress[chapterId] || initialChapterProgress;
            return {
                ...state,
                progress: {
                    ...state.progress,
                    [chapterId]: {
                        ...current,
                        quiz: {
                            ...current.quiz,
                            isSubmitted: true,
                            score: scorePercent,
                            scoreRaw,
                            totalQuestions,
                            attempts: current.quiz.attempts + 1,
                            durationSeconds,
                            hintsUsed: 0,
                            answers
                        }
                    }
                }
            };
        }

        case 'UPDATE_QUIZ_SESSION': {
            const { chapterId, answers, scoreRaw, durationSeconds } = action.payload;
            const current = state.progress[chapterId] || initialChapterProgress;
            return {
                ...state,
                progress: {
                    ...state.progress,
                    [chapterId]: {
                        ...current,
                        quiz: {
                            ...current.quiz,
                            answers,
                            scoreRaw,
                            durationSeconds
                        }
                    }
                }
            };
        }

        case 'RATE_EXERCISE': {
            const { chapterId, exerciseId, feedback } = action.payload;
            const current = state.progress[chapterId] || initialChapterProgress;
            return {
                ...state,
                progress: {
                    ...state.progress,
                    [chapterId]: {
                        ...current,
                        exercises: {
                            ...current.exercises,
                            feedbackMap: {
                                ...current.exercises.feedbackMap,
                                [exerciseId]: feedback
                            }
                        }
                    }
                }
            };
        }

        case 'UPDATE_EXERCISE_DURATION': {
            const { chapterId, durationAdd } = action.payload;
            const current = state.progress[chapterId] || initialChapterProgress;
            return {
                ...state,
                progress: {
                    ...state.progress,
                    [chapterId]: {
                        ...current,
                        exercises: {
                            ...current.exercises,
                            durationSeconds: (current.exercises.durationSeconds || 0) + durationAdd
                        }
                    }
                }
            };
        }

        case 'SUBMIT_CHAPTER': {
            const { chapterId } = action.payload;
            const current = state.progress[chapterId] || initialChapterProgress;
            
            // INTELLIGENT AUTOMATION:
            // Rich congratulatory message
            const newNotification: AppNotification = {
                id: `notif-${Date.now()}`,
                type: 'achievement',
                title: 'Chapitre Validé !',
                message: `Félicitations ! Vous avez complété le chapitre "${chapterId}" avec succès. Une étape clé vers l'excellence a été franchie.`,
                timestamp: Date.now(),
                isRead: false
            };

            return {
                ...state,
                progress: {
                    ...state.progress,
                    [chapterId]: {
                        ...current,
                        isSubmitted: true,
                        submissionDate: new Date().toISOString()
                    }
                },
                notifications: [newNotification, ...(state.notifications || [])]
            };
        }

        case 'ADD_NOTIFICATION':
            return {
                ...state,
                notifications: [action.payload, ...(state.notifications || [])]
            };

        case 'MARK_NOTIFICATION_READ':
            return {
                ...state,
                notifications: (state.notifications || []).map(n => 
                    n.id === action.payload.id ? { ...n, isRead: true } : n
                )
            };
        
        case 'MARK_ALL_NOTIFICATIONS_READ':
            return {
                ...state,
                notifications: (state.notifications || []).map(n => ({ ...n, isRead: true }))
            };

        case 'CLEAR_NOTIFICATIONS':
            return { ...state, notifications: [] };
        
        case 'LOGOUT':
            return { studentName: '', classId: '1bsm', progress: {}, notifications: [] };
            
        default:
            return state;
    }
};
