import React from 'react';
import { useParams } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';

// --- SmartBlank Component ---
export const SmartBlank: React.FC<{ id: string; answer: string }> = ({ id, answer }) => {
  const { chapterId } = useParams<{chapterId: string}>();
  const { dispatch, getChapterProgress } = useAppContext();
  
  const progress = getChapterProgress(chapterId || "");
  const isRevealed = progress.lesson.revealedBlanks?.includes(id);

  const handleReveal = (e: React.MouseEvent) => {
      e.stopPropagation(); 
      if (!chapterId) return;
      dispatch({
          type: 'REVEAL_BLANK',
          payload: { chapterId, blankId: id }
      });
  };

  return (
    <span
      onClick={handleReveal}
      className={`
        inline-flex items-center justify-center 
        px-2 mx-1 min-w-[3rem] h-6 align-middle transition-all duration-300 select-none cursor-pointer rounded text-sm
        ${isRevealed 
          ? 'font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 shadow-sm' 
          : 'text-transparent bg-slate-100 border-b-[3px] border-dotted border-slate-400/80 hover:bg-slate-200/50 hover:border-indigo-400'
        }
      `}
      title={isRevealed ? "Cliquez pour cacher" : "Cliquez pour révéler"}
    >
      {answer}
    </span>
  );
};

// --- InteractableToken Component ---
interface InteractableTokenProps {
    id: string;
    text: string;
    isHighlighted: boolean;
    isNeighborLeft?: boolean;
    isNeighborRight?: boolean;
    onToggle: () => void;
}

export const InteractableToken: React.FC<InteractableTokenProps> = ({ 
    id, text, isHighlighted, isNeighborLeft, isNeighborRight, onToggle 
}) => {
    
    const borderRadiusClass = `
        ${isNeighborLeft ? 'rounded-l-none border-l-0 pl-1' : 'rounded-l-lg pl-1.5'} 
        ${isNeighborRight ? 'rounded-r-none border-r-0 pr-1' : 'rounded-r-lg pr-1.5'}
    `;

    const marginClass = `
        ${isNeighborRight ? '-mr-[1px]' : 'mr-[3px]'}
        ${isNeighborLeft ? '-ml-[1px]' : ''}
    `;

    return (
        <span
            onDoubleClick={(e) => {
                e.preventDefault();
                onToggle();
            }}
            className={`
                relative inline-block transition-all duration-300 cursor-text py-0.5
                select-none ${marginClass}
                ${isHighlighted 
                    ? `bg-[#fef08a] text-slate-900 ${borderRadiusClass} shadow-sm` 
                    : 'hover:bg-slate-100/80 rounded-md px-0.5'}
            `}
        >
            {text}
        </span>
    );
};