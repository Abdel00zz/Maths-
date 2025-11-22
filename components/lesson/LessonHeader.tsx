
import React from 'react';
import { MathRenderer } from '../MathRenderer';

interface LessonHeaderProps {
    classe: string;
    title: string;
    subtitle: string;
}

export const LessonHeader: React.FC<LessonHeaderProps> = React.memo(({ classe, title, subtitle }) => {
    return (
        <div className="mb-12 pt-2">
            <div className="flex flex-col gap-4">
                <div className="max-w-4xl">
                    <h1 className="text-5xl md:text-6xl font-display font-black text-slate-900 leading-tight mb-4 tracking-tight">
                        <MathRenderer expression={title} inline />
                    </h1>
                    <p className="text-xl md:text-2xl text-slate-500 font-serif italic leading-relaxed font-light max-w-3xl">
                        {subtitle}
                    </p>
                </div>
            </div>
        </div>
    );
});
