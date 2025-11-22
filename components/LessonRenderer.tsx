
import React, { useState } from 'react';
import { Icon } from './ui/Base';
import { Modal } from './ui/LayoutComponents';
import { LessonElement } from '../types';
import { ProcessedContent } from './lesson/ProcessedContent';
import { ListRenderer, TableRenderer } from './lesson/Renderers';
import { ImageRenderer } from './lesson/ImageRenderer';
import { FunctionPlotRenderer } from './lesson/FunctionPlotRenderer';
import { GeoGebraRenderer } from './lesson/GeoGebraRenderer';
import { PATTERNS, BOX_TYPES } from './lesson/BoxConfig';
import { BoxContainer } from './lesson/BoxContainer';

// Re-export for other components that might import these directly
export { ProcessedContent, PATTERNS };

export const ElementRenderer: React.FC<{ element: LessonElement, index: number, itemNumber?: number }> = React.memo(({ element, index, itemNumber }) => {
    const [showSolution, setShowSolution] = useState(false);
    const elementId = `el-${index}`;

    if (BOX_TYPES[element.type]) {
        return <BoxContainer config={BOX_TYPES[element.type]} element={element} elementId={elementId} itemNumber={itemNumber} />;
    }

    switch (element.type) {
        case 'table':
            return element.tableData ? <TableRenderer data={element.tableData} idPrefix={elementId} /> : null;
        
        case 'image':
            return element.image ? <ImageRenderer image={element.image} className="my-8" /> : null;

        case 'graph-2d':
            return element.graph2d ? <FunctionPlotRenderer config={element.graph2d} idPrefix={elementId} /> : null;

        case 'geogebra':
            return element.geogebra ? <GeoGebraRenderer config={element.geogebra} idPrefix={elementId} /> : null;

        case 'remark-box':
            // Remarque simplifiée (si utilisée hors BoxContainer standard)
            return (
                <div className="my-6 relative bg-slate-50 p-6 rounded border border-slate-300">
                    <div className="font-bold text-slate-900 text-xs uppercase tracking-widest mb-2 flex items-center gap-2">
                        <Icon name="info" className="text-base" /> Remarque
                    </div>
                    <div className="text-slate-800 leading-relaxed text-justify font-body text-[0.95rem]">
                        {element.preamble && <div className="font-bold mb-1"><ProcessedContent text={element.preamble} idPrefix={`${elementId}-pre`} /></div>}
                        <ProcessedContent text={element.content || ''} idPrefix={`${elementId}-cont`} />
                    </div>
                </div>
            );

        case 'practice-box':
            // Interaction spécifique pour "A vous de jouer"
            return (
                <>
                    <div className="my-8 bg-white rounded border-2 border-slate-900 p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] relative overflow-hidden group">
                        <div className="flex items-start justify-between mb-4 relative z-10">
                            <div className="flex items-center gap-3">
                                <span className="inline-flex items-center px-3 py-1 rounded-none bg-slate-900 text-white text-[10px] font-bold uppercase tracking-widest">
                                   Exercice d'application
                                </span>
                            </div>
                            {element.solution && (
                                <button 
                                    onClick={() => setShowSolution(true)}
                                    className="group/btn flex items-center gap-2 px-3 py-1.5 rounded border border-slate-300 bg-white hover:bg-slate-50 transition-all text-[10px] font-bold uppercase tracking-widest text-slate-700"
                                    title="Voir la solution"
                                >
                                    <Icon name="visibility" className="text-base" />
                                    <span>Correction</span>
                                </button>
                            )}
                        </div>
                        
                        <div className="relative z-10">
                            <div className="mb-4 font-bold text-slate-900 text-base leading-relaxed font-display">
                                <ProcessedContent text={element.statement || ''} idPrefix={`${elementId}-stmt`} />
                            </div>
                            {element.content && (
                                <div className="text-slate-700 pl-0">
                                    {element.listType && Array.isArray(element.content) ? (
                                        <ListRenderer items={element.content} type={element.listType} idPrefix={`${elementId}-list`} columns={element.columns} />
                                    ) : (
                                        <ProcessedContent text={element.content} idPrefix={`${elementId}-cont`} />
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {element.solution && (
                        <Modal isOpen={showSolution} onClose={() => setShowSolution(false)} title="Correction détaillée">
                             <div className="space-y-6">
                                <div className="bg-slate-50 p-6 border-2 border-slate-200 relative">
                                    <div className="relative z-10 text-slate-800 font-body leading-relaxed">
                                        {Array.isArray(element.solution) ? (
                                            <ListRenderer items={element.solution} type={element.listType || 'numbered'} idPrefix={`${elementId}-sol`} columns={element.columns} />
                                        ) : (
                                            <ProcessedContent text={element.solution} idPrefix={`${elementId}-sol`} />
                                        )}
                                    </div>
                                </div>
                                <div className="flex justify-center">
                                    <button onClick={() => setShowSolution(false)} className="px-8 py-2 bg-slate-900 text-white text-xs font-bold uppercase tracking-widest hover:bg-slate-800 transition-all">Fermer</button>
                                </div>
                             </div>
                        </Modal>
                    )}
                </>
            );

        case 'p':
        default:
            return (
                <div className="my-4 text-justify leading-relaxed text-slate-800 font-body text-[1rem]">
                    <ProcessedContent text={element.content || ''} idPrefix={`${elementId}-cont`} />
                </div>
            );
    }
});