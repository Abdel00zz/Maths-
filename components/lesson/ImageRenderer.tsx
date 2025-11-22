import React, { useState, useEffect, useCallback } from 'react';
import { LessonImage } from '../../types';
import { Icon } from '../ui/Base';

export const ImageRenderer: React.FC<{ 
    image: LessonImage; 
    className?: string;
    disableFloat?: boolean; 
}> = ({ image, className = "", disableFloat = false }) => {
    const [isZoomed, setIsZoomed] = useState(false);
    const [hasError, setHasError] = useState(false);

    useEffect(() => {
        setHasError(false);
    }, [image.src]);

    // Close on Escape key
    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        if (e.key === 'Escape') {
            setIsZoomed(false);
        }
    }, []);

    useEffect(() => {
        if (isZoomed) {
            window.addEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'hidden'; // Prevent scrolling
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'unset';
        };
    }, [isZoomed, handleKeyDown]);

    const positionClasses = disableFloat 
        ? "w-full" 
        : {
            left: "md:float-left md:mr-6 mb-4 mx-auto",
            right: "md:float-right md:ml-6 mb-4 mx-auto",
            center: "mx-auto mb-6"
        }[image.position || 'center'];

    const isTransparent = image.transparent ?? false;
    const hasBorder = image.border ?? !isTransparent;

    const containerStyle: React.CSSProperties = {
        width: isZoomed ? 'auto' : (disableFloat ? '100%' : 'auto'),
        maxWidth: isZoomed ? 'none' : (disableFloat ? '100%' : '100%')
    };

    const wrapperClasses = `
        relative rounded-lg overflow-hidden transition-all duration-300 group
        ${hasBorder ? 'border border-slate-200 shadow-sm bg-white p-1' : ''}
        ${image.allowZoom !== false && !hasError ? 'cursor-zoom-in hover:shadow-md' : ''}
    `;

    if (isZoomed && !hasError) {
        return (
            <div 
                className="fixed inset-0 z-[9999] bg-slate-900/95 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn cursor-zoom-out"
                onClick={() => setIsZoomed(false)}
            >
                <div className="relative max-w-full max-h-full flex flex-col items-center" onClick={(e) => e.stopPropagation()}>
                    <img 
                        src={image.src} 
                        alt={image.alt} 
                        referrerPolicy="no-referrer"
                        className="max-w-[95vw] max-h-[85vh] object-contain rounded-md shadow-2xl cursor-default"
                    />
                    {image.caption && (
                        <div className="mt-4 text-white/90 font-medium text-center bg-black/50 px-6 py-3 rounded-full backdrop-blur-md shadow-lg border border-white/10">
                            {image.caption}
                        </div>
                    )}
                    <button 
                        className="absolute top-4 right-4 text-white bg-white/10 hover:bg-white/20 hover:text-white rounded-full p-3 transition-all border border-white/10"
                        onClick={() => setIsZoomed(false)}
                        title="Fermer (Échap)"
                    >
                        <Icon name="close" className="text-2xl" />
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div 
            className={`block clear-none ${positionClasses} ${className}`} 
            style={{ ...containerStyle, maxWidth: (!isZoomed && !disableFloat && image.position !== 'center') ? '400px' : undefined }}
        >
            <figure className={wrapperClasses} style={{ width: '100%' }}>
                {hasError ? (
                    <div className="w-full h-48 bg-slate-50 flex flex-col items-center justify-center text-slate-400 border border-dashed border-slate-300 rounded p-4 text-center">
                        <Icon name="broken_image" className="text-4xl mb-2 opacity-50" />
                        <span className="text-xs font-bold uppercase tracking-widest">Image non disponible</span>
                        <span className="text-[10px] font-mono mt-1 text-slate-300 break-all">{image.alt}</span>
                    </div>
                ) : (
                    <>
                        <img 
                            src={image.src} 
                            alt={image.alt} 
                            onError={() => setHasError(true)}
                            referrerPolicy="no-referrer"
                            onClick={() => image.allowZoom !== false && setIsZoomed(true)}
                            className={`w-full h-auto object-contain transition-transform duration-500 group-hover:scale-[1.02] ${isTransparent ? 'mix-blend-normal' : 'mix-blend-multiply'}`}
                            style={{ maxHeight: disableFloat ? '300px' : 'none' }} 
                        />
                        
                        {/* Zoom Indicator Overlay */}
                        {image.allowZoom !== false && (
                            <div 
                                onClick={() => image.allowZoom !== false && setIsZoomed(true)}
                                className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100"
                            >
                                <div className="bg-white/90 rounded-full p-2 shadow-sm text-slate-600 transform scale-75 group-hover:scale-100 transition-transform">
                                    <Icon name="zoom_in" />
                                </div>
                            </div>
                        )}
                    </>
                )}
            </figure>
            
            {image.caption && (
                <figcaption className="mt-2 text-center text-[10px] text-slate-400 font-medium italic leading-tight px-2">
                    {image.caption}
                </figcaption>
            )}
        </div>
    );
};