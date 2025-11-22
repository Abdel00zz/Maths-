
import { useQuery, useSuspenseQuery, useQueryClient } from '@tanstack/react-query';
import { ContentService } from '../services/ContentService';
import { useAppContext } from '../context/AppContext';

// Keys for React Query cache
export const CONTENT_KEYS = {
    curriculum: ['curriculum'] as const,
    lesson: (classId: string, chapterId: string) => ['lesson', classId, chapterId] as const,
    quiz: (classId: string, chapterId: string) => ['quiz', classId, chapterId] as const,
    exercises: (classId: string, chapterId: string) => ['exercises', classId, chapterId] as const,
};

/**
 * Hook to fetch the global curriculum
 */
export const useCurriculum = () => {
    return useQuery({
        queryKey: CONTENT_KEYS.curriculum,
        queryFn: ContentService.getCurriculum,
        staleTime: Infinity, // Curriculum rarely changes in a session
        gcTime: 1000 * 60 * 60 * 24, // Keep in cache for 24 hours
        retry: 2
    });
};

/**
 * Specialized Hook for Content Prefetching
 * call this onMouseEnter of cards
 */
export const usePrefetchContent = () => {
    const queryClient = useQueryClient();
    const { state } = useAppContext();
    const classId = state.classId;

    const prefetchChapter = (chapterId: string) => {
        const options = { staleTime: 1000 * 60 * 60 }; // 1 hour
        
        queryClient.prefetchQuery({
            queryKey: CONTENT_KEYS.lesson(classId, chapterId),
            queryFn: () => ContentService.getChapterLesson(classId, chapterId),
            ...options
        });
        queryClient.prefetchQuery({
            queryKey: CONTENT_KEYS.quiz(classId, chapterId),
            queryFn: () => ContentService.getChapterQuiz(classId, chapterId),
            ...options
        });
        queryClient.prefetchQuery({
            queryKey: CONTENT_KEYS.exercises(classId, chapterId),
            queryFn: () => ContentService.getChapterExercises(classId, chapterId),
            ...options
        });
    };

    return { prefetchChapter };
};

/**
 * Hook to fetch a specific lesson
 * Changed to useQuery to handle errors in the UI component
 */
export const useLesson = (chapterId: string | undefined) => {
    const { state } = useAppContext();
    const classId = state.classId;

    return useQuery({
        queryKey: CONTENT_KEYS.lesson(classId, chapterId || ''),
        queryFn: () => ContentService.getChapterLesson(classId, chapterId!),
        enabled: !!chapterId,
        staleTime: Infinity, 
        gcTime: 1000 * 60 * 60,
        retry: false // Don't retry on syntax errors
    });
};

/**
 * Hook to fetch a specific quiz
 */
export const useQuiz = (chapterId: string | undefined) => {
    const { state } = useAppContext();
    const classId = state.classId;

    return useSuspenseQuery({
        queryKey: CONTENT_KEYS.quiz(classId, chapterId || ''),
        queryFn: () => ContentService.getChapterQuiz(classId, chapterId!),
        staleTime: Infinity,
        gcTime: 1000 * 60 * 60
    });
};

/**
 * Hook to fetch exercises
 */
export const useExercises = (chapterId: string | undefined) => {
    const { state } = useAppContext();
    const classId = state.classId;

    return useSuspenseQuery({
        queryKey: CONTENT_KEYS.exercises(classId, chapterId || ''),
        queryFn: () => ContentService.getChapterExercises(classId, chapterId!),
        staleTime: Infinity,
        gcTime: 1000 * 60 * 60
    });
};
