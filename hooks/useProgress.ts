
import { useMemo } from 'react';
import { useAppContext } from '../context/AppContext';
import { ChapterProgress } from '../types';

export interface ChapterStats {
    progress: ChapterProgress;
    // Computed metrics
    lessonPercent: number;
    quizPercent: number;
    exercisesCount: number;
    
    // Status flags
    isLessonDone: boolean;
    isQuizDone: boolean;
    isExercisesStarted: boolean;
    isChapterCompleted: boolean;
    
    // Step Locking
    canAccessQuiz: boolean;
    canAccessExercises: boolean;
    canSubmitGlobal: boolean;

    // UI Helpers
    globalPercentage: number;
    statusLabel: 'locked' | 'new' | 'in_progress' | 'completed';
}

export const useChapterProgress = (chapterId: string | undefined): ChapterStats => {
    const { getChapterProgress } = useAppContext();

    const stats = useMemo(() => {
        if (!chapterId) return getEmptyStats();

        const progress = getChapterProgress(chapterId);
        
        // 1. Lesson Logic
        const lessonPercent = progress.lesson.percentage; 
        const isLessonDone = lessonPercent === 100;

        // 2. Quiz Logic
        const quizPercent = progress.quiz.score;
        const isQuizDone = progress.quiz.isSubmitted;

        // 3. Exercises Logic
        // UPDATED: Use feedbackMap length
        const exercisesCount = progress.exercises.feedbackMap ? Object.keys(progress.exercises.feedbackMap).length : 0;
        const isExercisesStarted = exercisesCount > 0;
        const MIN_EXERCISES_FOR_VALIDATION = 2; // Adjusted threshold to 2
        
        // 4. Locking Rules (Centralized Intelligence)
        const canAccessQuiz = isLessonDone;
        const canAccessExercises = isQuizDone;
        const canSubmitGlobal = isLessonDone && isQuizDone && exercisesCount >= MIN_EXERCISES_FOR_VALIDATION;

        // 5. Global Status
        const isChapterCompleted = progress.isSubmitted;
        
        // 6. Weighted Global Percentage Calculation
        let weightedScore = 0;

        // Lesson contribution (0 to 40)
        weightedScore += (lessonPercent / 100) * 40;

        // Quiz contribution (0 to 30) - BASED ON COMPLETION, NOT SCORE
        if (isQuizDone) {
            weightedScore += 30;
        }

        // Exercises contribution (0 to 30)
        // If exercises are done (based on a reasonable count), give full points
        const exScore = Math.min(1, exercisesCount / MIN_EXERCISES_FOR_VALIDATION); 
        weightedScore += exScore * 30;

        if (isChapterCompleted) weightedScore = 100;

        const globalPercentage = Math.round(weightedScore);

        let statusLabel: ChapterStats['statusLabel'] = 'new';
        if (isChapterCompleted) statusLabel = 'completed';
        else if (globalPercentage > 0) statusLabel = 'in_progress';

        return {
            progress,
            lessonPercent,
            quizPercent,
            exercisesCount,
            isLessonDone,
            isQuizDone,
            isExercisesStarted,
            isChapterCompleted,
            canAccessQuiz,
            canAccessExercises,
            canSubmitGlobal,
            globalPercentage,
            statusLabel
        };
    }, [chapterId, getChapterProgress]);

    return stats;
};

function getEmptyStats(): ChapterStats {
    return {
        progress: { 
            lesson: { isRead: false, percentage: 0, checkedSections: [], totalSections: 0, highlights: [], revealedBlanks: [] }, 
            quiz: { isSubmitted: false, score: 0, scoreRaw: 0, totalQuestions: 0, attempts: 0, durationSeconds: 0, hintsUsed: 0, answers: {} }, 
            exercises: { feedbackMap: {}, durationSeconds: 0, lastActive: 0 }, 
            isSubmitted: false 
        },
        lessonPercent: 0, quizPercent: 0, exercisesCount: 0,
        isLessonDone: false, isQuizDone: false, isExercisesStarted: false, isChapterCompleted: false,
        canAccessQuiz: false, canAccessExercises: false, canSubmitGlobal: false,
        globalPercentage: 0, statusLabel: 'locked'
    };
}
