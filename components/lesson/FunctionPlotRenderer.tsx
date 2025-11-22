import React, { useEffect, useRef, useState } from 'react';
import { Icon } from '../ui/Base';
import { Graph2DConfig } from '../../types';

interface FunctionPlotRendererProps {
    config?: Graph2DConfig;
    idPrefix: string;
    className?: string; // New prop for layout control
}

export const FunctionPlotRenderer: React.FC<FunctionPlotRendererProps> = ({ config, idPrefix, className = "my-6 w-full max-w-[600px] mx-auto" }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [libReady, setLibReady] = useState(false);
    const [hasError, setHasError] = useState(false);

    // 1. Check for Function Plot Library
    useEffect(() => {
        const checkLib = () => {
            // @ts-ignore
            if (typeof window.functionPlot === 'function') {
                setLibReady(true);
            } else {
                setTimeout(checkLib, 500);
            }
        };
        checkLib();
    }, []);

    // 2. Render Chart
    useEffect(() => {
        if (!libReady || !containerRef.current || !config) return;

        try {
            const { functions, xDomain = [-5, 5], yDomain = [-5, 5], grid = true } = config;

            // Prepare Data for Function Plot
            const data = functions.map(f => ({
                fn: f.fn,
                graphType: f.graphType || 'polyline',
                color: f.color || '#0056D2', // Default Primary Blue
                closed: false,
                skipTip: false
            }));

            // @ts-ignore
            window.functionPlot({
                target: containerRef.current,
                width: containerRef.current.clientWidth,
                height: 250, // Slightly more compact for side-widgets
                yAxis: { domain: yDomain },
                xAxis: { domain: xDomain },
                grid: grid,
                data: data,
                disableZoom: false,
                tip: {
                    xLine: true,    // Show a vertical line to x-axis
                    yLine: true,    // Show a horizontal line to y-axis
                }
            });

        } catch (e) {
            console.error("Function Plot Render Error:", e);
            setHasError(true);
        }

    }, [libReady, config]);

    // Handle Resize
    useEffect(() => {
        const handleResize = () => {
            if (libReady && containerRef.current && config) {
                try {
                     // @ts-ignore
                    window.functionPlot({
                        target: containerRef.current,
                        width: containerRef.current.clientWidth,
                        height: 250,
                        yAxis: { domain: config.yDomain || [-5, 5] },
                        xAxis: { domain: config.xDomain || [-5, 5] },
                        grid: config.grid ?? true,
                        data: config.functions.map(f => ({
                            fn: f.fn,
                            graphType: f.graphType || 'polyline',
                            color: f.color || '#0056D2',
                            skipTip: false
                        }))
                    });
                } catch(e) {}
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [libReady, config]);

    return (
        <figure className={className}>
            {/* Container: Clean, border light, rounded */}
            <div className="relative rounded-lg border border-slate-200 bg-white overflow-hidden shadow-sm transition-all hover:shadow-md group">
                
                {/* Graph Area */}
                <div 
                    ref={containerRef} 
                    id={`plot-${idPrefix}`}
                    className="w-full h-[250px] flex items-center justify-center cursor-crosshair"
                ></div>

                {/* Loading State */}
                {(!libReady && !hasError) && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-50 z-10">
                        <div className="animate-spin w-6 h-6 border-2 border-slate-200 border-t-slate-900 rounded-full mb-2"></div>
                    </div>
                )}

                {/* Error State */}
                {hasError && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-rose-50 text-rose-600 p-4 text-center z-20">
                        <Icon name="error" className="text-2xl mb-1" />
                        <p className="text-xs font-bold">Erreur de syntaxe.</p>
                    </div>
                )}

                {/* Subtle Interaction Hint (Only visible on hover) */}
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    <div className="bg-white/90 backdrop-blur border border-slate-200 rounded p-1 shadow-sm text-slate-400">
                        <Icon name="pan_tool" className="text-sm" />
                    </div>
                </div>
            </div>

            {/* Caption (Title) - Natural Injection */}
            {config?.title && (
                <figcaption className="mt-2 text-center text-[10px] text-slate-500 font-medium italic leading-tight">
                    Fig. {config.title}
                </figcaption>
            )}
        </figure>
    );
};