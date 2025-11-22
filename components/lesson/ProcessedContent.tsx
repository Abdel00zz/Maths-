import React, { useMemo, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import { parseLessonText } from '../../utils/textProcessor';

export const ProcessedContent: React.FC<{ 
    text: string | string[], 
    idPrefix?: string, 
    className?: string,
    disableInteractions?: boolean 
}> = React.memo(({ text, idPrefix = 'content', className = "", disableInteractions = false }) => {
    const { state, dispatch } = useAppContext();
    const { chapterId } = useParams<{chapterId: string}>();
    
    const highlights = chapterId ? (state.progress[chapterId]?.lesson.highlights || []) : [];
    const revealedBlanks = chapterId ? (state.progress[chapterId]?.lesson.revealedBlanks || []) : [];

    const handleToggleHighlight = (tokenId: string) => {
        if (!chapterId || disableInteractions) return;
        dispatch({
            type: 'TOGGLE_HIGHLIGHT',
            payload: { chapterId, tokenId }
        });
    };

    const handleClick = useCallback((e: React.MouseEvent) => {
        if (disableInteractions || !chapterId) return;

        let target = e.target as HTMLElement | null;
        while (target && target !== e.currentTarget) {
            if (target.id && target.id.startsWith('blank-')) {
                e.stopPropagation();
                dispatch({
                    type: 'REVEAL_BLANK',
                    payload: { chapterId, blankId: target.id }
                });
                return;
            }
            target = target.parentElement;
        }
    }, [dispatch, chapterId, disableInteractions]);

    const renderedContent = useMemo(() => {
        return parseLessonText(text, idPrefix, {
            highlights,
            revealedBlanks,
            onToggleHighlight: handleToggleHighlight,
            chapterId: chapterId || '',
            disableInteractions
        });
    }, [text, idPrefix, highlights, revealedBlanks, chapterId, disableInteractions]);

    return (
        <div 
            className={`prose prose-lg text-slate-700 max-w-none leading-relaxed selection:bg-indigo-100 ${className}`}
            onClick={handleClick}
        >
            {renderedContent}
        </div>
    );
});