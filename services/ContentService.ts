
import { validateLessonData } from '../utils/jsonValidator';

/**
 * ContentService
 * Stateless fetcher functions designed to be used with TanStack Query.
 * Caching is handled by the QueryClient, not here.
 */
export class ContentService {
    
    // Fetch curriculum
    static async getCurriculum() {
        // Use absolute path '/' to ensure it resolves correctly from nested routes (e.g. /chapter/:id)
        const path = '/curriculum.json'; 
        const response = await fetch(path);
        
        if (!response.ok) {
            // 404s will throw here. QueryClient should be configured not to retry these.
            throw new Error(`Failed to fetch curriculum at ${path}. Status: ${response.status}`);
        }
        
        return response.json();
    }

    // Get Lesson with specific naming: [chapterId]_lesson.json
    static async getChapterLesson(classId: string, chapterId: string) {
        const path = `content/${classId}/${chapterId}/lesson/${chapterId}_lesson.json`;
        
        let response;
        try {
            response = await fetch(path);
        } catch (e) {
            throw new Error(`Erreur réseau lors du chargement de la leçon : ${path}`);
        }
        
        if (!response.ok) {
            throw new Error(`Fichier de leçon introuvable (404) : ${path}`);
        }

        let data;
        try {
            data = await response.json();
        } catch (e) {
            // This catches syntax errors in the JSON file (commas, quotes, etc.)
            throw new Error(`Erreur de Syntaxe JSON dans le fichier : ${(e as Error).message}. Vérifiez les virgules et les guillemets.`);
        }

        // Validate Structure
        const validation = validateLessonData(data);
        if (!validation.isValid) {
            throw new Error(`Erreur de Structure JSON : ${validation.error}`);
        }

        return data;
    }

    // Get Quiz with specific naming: [chapterId]_quiz.json
    static async getChapterQuiz(classId: string, chapterId: string) {
        const path = `content/${classId}/${chapterId}/quiz/${chapterId}_quiz.json`;
        const response = await fetch(path);

        if (!response.ok) throw new Error(`Quiz not found for ${chapterId}`);
        return response.json();
    }

    // Get Exercises with specific naming: [chapterId]_exercises.json
    static async getChapterExercises(classId: string, chapterId: string) {
        const path = `content/${classId}/${chapterId}/exercises/${chapterId}_exercises.json`;
        const response = await fetch(path);

        if (!response.ok) throw new Error(`Exercises not found for ${chapterId}`);
        return response.json();
    }
}
