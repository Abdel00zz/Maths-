
import React, { useMemo } from 'react';
import katex from 'katex';

interface MathRendererProps {
    expression: string;
    inline?: boolean;
    className?: string;
}

export const MathRenderer: React.FC<MathRendererProps> = React.memo(({ expression, inline = false, className = "" }) => {
    
    // Helper to render a specific LaTeX string
    const renderKaTeX = (tex: string, displayMode: boolean) => {
        try {
            return katex.renderToString(tex, {
                throwOnError: false,
                displayMode: displayMode,
                trust: true, // Critical: Allows \htmlId and \htmlClass for interactive blanks
                strict: false
            });
        } catch (e) {
            console.error("KaTeX Error:", e);
            return tex;
        }
    };

    const content = useMemo(() => {
        // Split string by delimiters: $$...$$ (Display) or $...$ (Inline)
        // The capturing group keeps the delimiters in the result array
        const regex = /(\$\$[\s\S]*?\$\$|\$[\s\S]*?\$)/g;
        const parts = expression.split(regex);

        return parts.map((part, index) => {
            if (part.startsWith('$$') && part.endsWith('$$')) {
                // Display Math
                const tex = part.slice(2, -2);
                return (
                    <span 
                        key={index} 
                        dangerouslySetInnerHTML={{ __html: renderKaTeX(tex, true) }} 
                        className="block text-center my-4"
                    />
                );
            } else if (part.startsWith('$') && part.endsWith('$')) {
                // Inline Math
                const tex = part.slice(1, -1);
                return (
                    <span 
                        key={index} 
                        dangerouslySetInnerHTML={{ __html: renderKaTeX(tex, false) }} 
                    />
                );
            } else {
                // Regular Text - Preserve spaces and structure
                if (!part) return null;
                return <span key={index} dangerouslySetInnerHTML={{ __html: part }} />;
            }
        });
    }, [expression]);

    // Wrapper: defaulting to inline-block context unless specified otherwise
    return (
        <span className={`math-renderer ${className}`}>
            {content}
        </span>
    );
});
