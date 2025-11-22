

import React from 'react';
import { TableRow } from '../../types';
import { ProcessedContent } from './ProcessedContent';

// --- List Renderer ---
export const ListRenderer: React.FC<{ items: string[], type: 'bullet' | 'numbered', idPrefix: string, columns?: number }> = ({ items, type, idPrefix, columns }) => {
    let counter = 0;

    // Determine layout class
    const layoutClass = columns && columns > 1 
        ? `grid grid-cols-1 md:grid-cols-${columns} gap-x-8 gap-y-2` 
        : "space-y-2"; 

    return (
        <div className={`my-4 ${layoutClass}`}>
            {items.map((item, idx) => {
                const isNoBullet = item.trim().startsWith('>>');
                const cleanItem = isNoBullet ? item.replace(/^>>\s*/, '') : item;
                
                let marker = null;
                if (!isNoBullet) {
                    if (type === 'numbered') {
                        counter++;
                        // Style: Numbered - Technique, baseline aligned
                        marker = (
                            <span className="flex-shrink-0 font-display text-sm font-bold text-slate-900 select-none mr-2 w-5 text-right">
                                {counter}.
                            </span>
                        );
                    } else {
                        // Style Chic: Diamond (◆)
                        marker = (
                            <span className="flex-shrink-0 text-[8px] text-slate-900 select-none transform -translate-y-[1px] mr-3 opacity-80">
                                ◆
                            </span>
                        );
                    }
                }

                return (
                    <div key={idx} className={`flex items-baseline ${isNoBullet ? 'pl-6' : ''}`}>
                        {marker}
                        <div className="flex-1 leading-relaxed text-slate-800 text-justify">
                            <ProcessedContent text={cleanItem} idPrefix={`${idPrefix}-li-${idx}`} />
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

// --- Table Renderer ---
export const TableRenderer: React.FC<{ data: TableRow[], idPrefix: string }> = ({ data, idPrefix }) => (
    <div className="my-8 mx-auto max-w-full overflow-hidden">
        <div className="overflow-x-auto">
            <table className="w-full text-sm text-slate-800 border-collapse border border-slate-300">
                <thead className="bg-slate-100 text-slate-900 font-display font-bold uppercase text-xs tracking-wider">
                    {data.filter(row => row.isHeader).map((row, rIdx) => (
                        <tr key={`h-${rIdx}`}>
                            {row.cells.map((cell, cIdx) => (
                                <th key={`th-${cIdx}`} className="px-6 py-4 border border-slate-300 text-center align-middle">
                                    <ProcessedContent text={cell} idPrefix={`${idPrefix}-th-${rIdx}-${cIdx}`} />
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody>
                    {data.filter(row => !row.isHeader).map((row, rIdx) => (
                        <tr key={`r-${rIdx}`} className="bg-white hover:bg-slate-50 transition-colors">
                            {row.cells.map((cell, cIdx) => (
                                <td key={`td-${cIdx}`} className="px-6 py-4 border border-slate-300 text-center align-middle leading-relaxed">
                                    <ProcessedContent text={cell} idPrefix={`${idPrefix}-tr-${rIdx}-td-${cIdx}`} />
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
);