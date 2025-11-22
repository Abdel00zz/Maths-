
import React from 'react';
import { LessonElement } from '../../types';
import { ProcessedContent } from './ProcessedContent';
import { ListRenderer, TableRenderer } from './Renderers';
import { ImageRenderer } from './ImageRenderer';
import { FunctionPlotRenderer } from './FunctionPlotRenderer';
import { GeoGebraRenderer } from './GeoGebraRenderer';
import { BoxConfig } from './BoxConfig';
import { MathRenderer } from '../MathRenderer';

const BoxInternalContent: React.FC<{ 
    element: LessonElement; 
    elementId: string; 
    isImageLeft: boolean;
    hasMedia: boolean;
    fontClass?: string;
    hidePreamble?: boolean;
}> = ({ element, elementId, isImageLeft, hasMedia, fontClass = "", hidePreamble = false }) => (
    <>
        {element.preamble && !hidePreamble && (
            <div className="mb-3 text-base font-bold text-slate-900 leading-tight font-display block">
                <ProcessedContent text={element.preamble} idPrefix={`${elementId}-pre`} disableInteractions />
            </div>
        )}

        <div className={`flex flex-col ${isImageLeft ? 'md:flex-row-reverse' : 'md:flex-row'} gap-6`}>
            <div className={`flex-1 min-w-0 leading-relaxed ${fontClass}`}>
                {element.tableData ? (
                    <TableRenderer data={element.tableData} idPrefix={`${elementId}-tbl`} />
                ) : element.listType && Array.isArray(element.content) ? (
                    <ListRenderer items={element.content} type={element.listType} idPrefix={`${elementId}-list`} columns={element.columns} />
                ) : (
                    <ProcessedContent text={element.content || ''} idPrefix={`${elementId}-cont`} />
                )}
            </div>

            {/* Right Column Media: Image or Graph2D (GeoGebra removed from here) */}
            {hasMedia && (
                <div className="w-full md:w-1/3 flex-shrink-0 pt-1 flex flex-col gap-4">
                    {element.image && (
                        <ImageRenderer image={element.image} disableFloat={true} className="border border-slate-200 bg-white p-1 shadow-sm" />
                    )}
                    {element.graph2d && (
                        <FunctionPlotRenderer config={element.graph2d} idPrefix={`${elementId}-plot`} className="border border-slate-200 bg-white p-1 shadow-sm rounded-lg" />
                    )}
                </div>
            )}
        </div>
    </>
);

export const BoxContainer: React.FC<{ 
    config: BoxConfig; 
    element: LessonElement; 
    elementId: string;
    itemNumber?: number;
}> = ({ config, element, elementId, itemNumber }) => {
    
    // Detect if any media is present (GeoGebra is treated separately as a header action)
    const hasMedia = !!element.image || !!element.graph2d;
    const isImageLeft = element.image?.position === 'left';
    
    const isDemonstration = config.title === 'Preuve' || config.title === 'Démonstration';
    
    // Determine Header Text Logic
    const headerText = element.title || (!isDemonstration ? element.preamble : undefined);
    
    // Hide preamble in body ONLY if it was used as the header text.
    const hidePreambleInBody = headerText === element.preamble;
    const shouldShowHeaderSeparator = !!headerText;

    return (
        <div className={`relative my-8 p-5 md:p-6 transition-all duration-200 group/box ${config.styles.containerBorder}`}>
            
            {/* GeoGebra Floating Action Button - Absolute Top Right */}
            {element.geogebra && (
                <div className="absolute top-3 right-3 md:top-4 md:right-4 z-10">
                    <GeoGebraRenderer config={element.geogebra} idPrefix={`${elementId}-ggb`} />
                </div>
            )}

            {/* Header: Badge | Separator | Title (Preamble) */}
            <div className="mb-6 flex items-center gap-4 border-b border-slate-100/0 pb-1 pr-10 md:pr-12"> {/* Added padding-right to avoid button overlap */}
                <div className={config.styles.badgeClass}>
                    {config.title}
                    {itemNumber && <span className="ml-1"> {itemNumber}</span>}
                </div>
                
                {shouldShowHeaderSeparator && (
                    <>
                        <div className="hidden md:block h-4 w-px bg-slate-300 mx-1"></div>
                        <div className="text-slate-500 font-bold font-display uppercase tracking-wide text-xs md:text-sm pt-0.5 truncate max-w-[150px] md:max-w-none">
                            <MathRenderer expression={headerText || ""} inline />
                        </div>
                    </>
                )}

                {/* Symbole Q.E.D discret pour les preuves */}
                {isDemonstration && (
                    <div className="ml-auto">
                        <span className="w-2 h-2 bg-slate-900 inline-block opacity-50" title="Q.E.D."></span>
                    </div>
                )}
            </div>

            <BoxInternalContent 
                element={element} 
                elementId={elementId} 
                hasMedia={hasMedia} 
                isImageLeft={isImageLeft} 
                fontClass={config.styles.bodyFont}
                hidePreamble={hidePreambleInBody}
            />
        </div>
    );
};
