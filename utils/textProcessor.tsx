
import React from 'react';
import { MathRenderer } from '../components/MathRenderer';
import { SmartBlank, InteractableToken } from '../components/ui/Interactive';

// Helper to check if a string is just whitespace
const isWhitespace = (str: string) => !str.replace(/\s/g, '').length;

export interface ProcessOptions {
    highlights?: string[];
    onToggleHighlight?: (id: string) => void;
    chapterId?: string;
    disableInteractions?: boolean;
    revealedBlanks?: string[];
}

/**
 * Math Cleaner Helper for KaTeX
 */
const cleanMathContent = (content: string, isDisplay: boolean): string => {
    let cleaned = content.trim();

    if (isDisplay) {
        // Use \dfrac for display math automatically if not already present
        cleaned = cleaned.replace(/\\frac(?![a-zA-Z])/g, '\\dfrac');
    }

    return cleaned;
};

/**
 * Advanced Parsing Pipeline:
 * 1. Split by Math ($$...$$ or $...$)
 * 2. Split by Blanks (___ans___)
 * 3. Split by Bold (**text**)
 * 4. Split by Words (for highlighting)
 */
export const parseLessonText = (
    text: string | string[], 
    idPrefix: string = 'content',
    options: ProcessOptions = {}
): React.ReactNode[] => {
    const rawText = Array.isArray(text) ? text.join('\n') : (text || '');

    // Regex to split Math (Display $$ or Inline $)
    const tokens = rawText.split(/(\$\$[\s\S]*?\$\$|\$[\s\S]*?\$)/g);

    return tokens.map((token, index) => {
        // 1. Math (Display or Inline)
        if (token.startsWith('$')) {
            const isDisplay = token.startsWith('$$');
            // Extract content but keep reference to delimiters logic
            let content = isDisplay ? token.slice(2, -2) : token.slice(1, -1);

            content = cleanMathContent(content, isDisplay);

            // Inject blanks \htmlId{id}{...} for KaTeX
            let blankIndex = 0;
            const mathWithBlanks = content.replace(/___(.*?)___/g, (match, answer) => {
                const uniqueId = `blank-${idPrefix}-m-${index}-${blankIndex++}`;
                const isRevealed = options.revealedBlanks?.includes(uniqueId);
                
                if (isRevealed) {
                    // Revealed state: Bold Blue Text using KaTeX \htmlClass
                    return `\\htmlId{${uniqueId}}{\\htmlClass{text-indigo-600 font-bold}{${answer}}}`;
                } else {
                    // Hidden state: Dots, cursor pointer
                    return `\\htmlId{${uniqueId}}{\\htmlClass{text-slate-400 font-bold cursor-pointer}{.....}}`;
                }
            });

            // Re-wrap content in delimiters so MathRenderer detects it as math
            const finalExpression = isDisplay ? `$$${mathWithBlanks}$$` : `$${mathWithBlanks}$`;

            return <MathRenderer key={`math-${index}`} expression={finalExpression} inline={!isDisplay} />;
        }

        // 2. Text Content standard
        return (
            <span key={`block-${index}`}>
               {processTextLines(token, `${idPrefix}-${index}`, options)}
            </span>
        );
    });
};

// Handle newlines and quotes
const processTextLines = (text: string, idPrefix: string, options: ProcessOptions): React.ReactNode => {
    const lines = text.split('\n');
    return lines.map((line, idx) => {
        // Handle Quotes ">>" - Compact Bold Header
        if (line.trim().startsWith('>>')) {
            const quoteContent = line.replace(/^>>\s*/, '');
            return (
                <div key={`l-${idx}`} className="font-bold text-slate-900 mt-1 mb-0.5">
                    {processBlanksAndWords(quoteContent, `${idPrefix}-q-${idx}`, options)}
                </div>
            );
        }
        
        const content = processBlanksAndWords(line, `${idPrefix}-l-${idx}`, options);
        
        if (idx === lines.length - 1) {
             return <React.Fragment key={`l-${idx}`}>{content}</React.Fragment>;
        }

        return (
            <React.Fragment key={`l-${idx}`}>
                {content}
                <br />
            </React.Fragment>
        );
    });
};

// Handle Blanks, Bold, and Words
const processBlanksAndWords = (text: string, idPrefix: string, options: ProcessOptions): React.ReactNode[] => {
    const parts = text.split(/___(.*?)___/g);
    const nodes: React.ReactNode[] = [];

    for (let i = 0; i < parts.length; i++) {
        const part = parts[i];

        if (i % 2 === 0) {
            if (part) {
                const boldParts = part.split(/\*\*(.*?)\*\*/g);
                boldParts.forEach((bPart, bIdx) => {
                    const isBold = bIdx % 2 === 1;
                    const contentNodes = (options.disableInteractions || !options.onToggleHighlight)
                        ? [<span key={`t-${i}-${bIdx}`}>{bPart}</span>]
                        : processWords(bPart, `${idPrefix}-p-${i}-${bIdx}`, options);

                    if (isBold) {
                        nodes.push(
                            <strong key={`strong-${i}-${bIdx}`} className="font-bold text-slate-900">
                                {contentNodes}
                            </strong>
                        );
                    } else {
                        nodes.push(...contentNodes);
                    }
                });
            }
        } else {
            // Blank Component (For text)
            const blankId = `${idPrefix}-b-${i}`;
            nodes.push(
                <SmartBlank 
                    key={`b-${i}`} 
                    id={blankId} 
                    answer={part} 
                />
            );
        }
    }
    return nodes;
};

// Tokenize words for highlighting
const processWords = (text: string, idPrefix: string, options: ProcessOptions): React.ReactNode[] => {
    const words = text.split(/(\s+)/); 
    
    return words.map((word, idx) => {
        const uniqueKey = `${idPrefix}-w-${idx}`;
        
        if (isWhitespace(word)) return <span key={uniqueKey}>{word}</span>;

        const tokenId = `${idPrefix}-w-${idx}`;
        const isHighlighted = options.highlights?.includes(tokenId) || false;
        
        const prevId = `${idPrefix}-w-${idx - 2}`;
        const nextId = `${idPrefix}-w-${idx + 2}`;
        
        const isNeighborLeft = options.highlights?.includes(prevId);
        const isNeighborRight = options.highlights?.includes(nextId);

        return (
            <InteractableToken
                key={uniqueKey}
                id={tokenId}
                text={word}
                isHighlighted={isHighlighted}
                isNeighborLeft={isNeighborLeft}
                isNeighborRight={isNeighborRight}
                onToggle={() => options.onToggleHighlight && options.onToggleHighlight(tokenId)}
            />
        );
    });
};
