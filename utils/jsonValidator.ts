
import { LessonData } from '../types';

export interface ValidationResult {
    isValid: boolean;
    error?: string;
}

export const validateLessonData = (data: any): ValidationResult => {
    if (!data) {
        return { isValid: false, error: "Le fichier JSON est vide ou null." };
    }

    if (typeof data !== 'object') {
        return { isValid: false, error: "Le contenu n'est pas un objet JSON valide." };
    }

    // Check Header
    if (!data.header || typeof data.header !== 'object') {
        return { isValid: false, error: "L'objet 'header' est manquant." };
    }
    const requiredHeaderFields = ['title', 'classe', 'chapter'];
    for (const field of requiredHeaderFields) {
        if (!data.header[field]) {
            return { isValid: false, error: `L'en-tête (header) doit contenir le champ : '${field}'.` };
        }
    }

    // Check Sections
    if (!data.sections || !Array.isArray(data.sections)) {
        return { isValid: false, error: "La propriété 'sections' doit être un tableau (array)." };
    }

    if (data.sections.length === 0) {
        return { isValid: false, error: "La leçon ne contient aucune section." };
    }

    // Deep check logic
    for (let i = 0; i < data.sections.length; i++) {
        const section = data.sections[i];
        if (!section.title) return { isValid: false, error: `La section ${i + 1} n'a pas de titre.` };
        
        if (!section.subsections || !Array.isArray(section.subsections)) {
            return { isValid: false, error: `La section '${section.title}' doit avoir un tableau 'subsections'.` };
        }

        for (let j = 0; j < section.subsections.length; j++) {
            const sub = section.subsections[j];
            if (!sub.title) return { isValid: false, error: `Dans '${section.title}', la sous-section ${j + 1} n'a pas de titre.` };
            if (!sub.elements || !Array.isArray(sub.elements)) {
                return { isValid: false, error: `La sous-section '${sub.title}' doit avoir un tableau 'elements'.` };
            }
        }
    }
    
    return { isValid: true };
};
