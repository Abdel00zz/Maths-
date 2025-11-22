
import React, { createContext, useContext, useReducer, useEffect, useState, useMemo, useCallback } from 'react';
import { AppState, ChapterProgress, Curriculum } from '../types';
import { StorageService } from '../services/StorageService';
import { ContentService } from '../services/ContentService';
import { appReducer, initialChapterProgress, Action } from './appReducer';

// Initial State helper
const getInitialState = (): AppState => StorageService.get();

// Context
interface AppContextType {
    state: AppState;
    curriculum: Curriculum | null;
    dispatch: React.Dispatch<Action>;
    getChapterProgress: (chapterId: string) => ChapterProgress;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [state, dispatch] = useReducer(appReducer, undefined, getInitialState);
    const [curriculum, setCurriculum] = useState<Curriculum | null>(null);

    // Optimized Persistence: Debounce writing to storage
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            StorageService.set(state);
        }, 800); 

        return () => clearTimeout(timeoutId);
    }, [state]);

    // Fetch curriculum on mount
    useEffect(() => {
        let mounted = true;
        ContentService.getCurriculum().then(data => {
            if (mounted) setCurriculum(data);
        });
        return () => { mounted = false; };
    }, []);

    // Memoized getter
    const getChapterProgress = useCallback((chapterId: string) => {
        return state.progress[chapterId] || initialChapterProgress;
    }, [state.progress]);

    const contextValue = useMemo(() => ({
        state,
        curriculum,
        dispatch,
        getChapterProgress
    }), [state, curriculum, getChapterProgress]);

    return (
        <AppContext.Provider value={contextValue}>
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error("useAppContext must be used within an AppProvider");
    }
    return context;
};
