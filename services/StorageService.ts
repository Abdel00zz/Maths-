
import { AppState } from '../types';

const STORAGE_KEY = 'planet-math:app:v5.1'; // Incremented version for schema change

const DEFAULT_STATE: AppState = {
    studentName: '',
    classId: '1bsm',
    progress: {},
    notifications: []
};

export const StorageService = {
    get: (): AppState => {
        try {
            const item = localStorage.getItem(STORAGE_KEY);
            if (!item) return DEFAULT_STATE;
            
            const parsed = JSON.parse(item);
            // Merge with default to ensure new fields like 'notifications' exist if loading old state
            return { ...DEFAULT_STATE, ...parsed };
        } catch (e) {
            console.error("StorageService: Error reading or parsing storage", e);
            // Recovery mechanism: return default state if corrupted
            return DEFAULT_STATE;
        }
    },

    set: (state: AppState): void => {
        try {
            const serialized = JSON.stringify(state);
            localStorage.setItem(STORAGE_KEY, serialized);
        } catch (e) {
            // Handle QuotaExceededError
            if (e instanceof DOMException && (
                e.code === 22 || 
                e.code === 1014 || 
                e.name === 'QuotaExceededError' || 
                e.name === 'NS_ERROR_DOM_QUOTA_REACHED')
            ) {
                console.error("StorageService: Storage Limit Exceeded. Progress might not be saved.");
                // Potential strategy: Clear old cache/keys or notify user
            } else {
                console.error("StorageService: Error writing storage", e);
            }
        }
    },

    clear: (): void => {
        try {
            localStorage.removeItem(STORAGE_KEY);
        } catch (e) {
            console.error("StorageService: Error clearing storage", e);
        }
    }
};
