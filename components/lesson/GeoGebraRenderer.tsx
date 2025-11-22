
import React, { useEffect, useState, useRef } from 'react';
import { GeoGebraConfig } from '../../types';
import { Icon } from '../ui/Base';
import { Modal } from '../ui/LayoutComponents';

declare global {
    interface Window {
        GGBApplet: any;
    }
}

interface GeoGebraRendererProps {
    config: GeoGebraConfig;
    idPrefix: string;
    className?: string;
}

export const GeoGebraRenderer: React.FC<GeoGebraRendererProps> = ({ config, idPrefix, className = "" }) => {
    const containerId = `ggb-${idPrefix}`;
    const [isOpen, setIsOpen] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);
    const [error, setError] = useState(false);
    const appletRef = useRef<any>(null);

    useEffect(() => {
        if (!isOpen) {
            setIsLoaded(false);
            return;
        }

        setError(false);
        // Reset load state when opening
        setIsLoaded(false);
        
        const initGGB = () => {
            setTimeout(() => {
                if (!window.GGBApplet) {
                    console.warn("GeoGebra library not loaded via CDN yet.");
                    setError(true);
                    return;
                }

                const container = document.getElementById(containerId);
                if (!container) return;

                // Clear container
                container.innerHTML = '';

                try {
                    const params = {
                        "appName": config.appName || "graphing",
                        "width": 1200, 
                        "height": 650, // Initial base height, CSS will override
                        "showToolBar": config.showToolBar ?? true,
                        "showAlgebraInput": config.showAlgebraInput ?? true,
                        "showMenuBar": config.showMenuBar ?? false,
                        "material_id": config.materialId,
                        "borderColor": "#FFFFFF",
                        "enableShiftDragZoom": true,
                        "showResetIcon": true,
                        "language": "fr",
                        "useBrowserForJS": true,
                        "scaleContainerClass": "ggb-container",
                        "allowUpscale": true,
                        "appletOnLoad": (api: any) => {
                            appletRef.current = api;
                            if (config.commands) {
                                config.commands.forEach(cmd => api.evalCommand(cmd));
                            }
                            // Une fois chargé, on attend un court instant pour éviter le flash puis on cache le loader
                            setTimeout(() => setIsLoaded(true), 800);
                        }
                    };

                    const applet = new window.GGBApplet(params, true);
                    applet.inject(containerId);

                } catch (e) {
                    console.error("GeoGebra injection error:", e);
                    setError(true);
                }
            }, 50);
        };

        initGGB();
        
    }, [isOpen, config, containerId]);

    return (
        <>
            <button 
                onClick={() => setIsOpen(true)}
                className={`
                    group relative flex items-center bg-white border-2 border-slate-200 shadow-md 
                    hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:border-slate-900
                    transition-all duration-300 ease-out rounded-full p-2 z-20 overflow-hidden
                    ${className}
                `}
                title="Ouvrir le laboratoire"
            >
                {/* Elegant Parabolic Icon Container - Larger & More Visible */}
                <div className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center border border-slate-200 group-hover:bg-slate-900 group-hover:text-white group-hover:border-slate-900 transition-colors duration-300 z-10">
                    <svg className="w-6 h-6 text-current transition-colors duration-300" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        {/* Coordinate System (Repère) */}
                        <path d="M12 3V21M3 12H21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="opacity-40" />
                        {/* Parabola Directed Upwards */}
                        <path d="M6 6C6 6 9 18 12 18C15 18 18 6 18 6" stroke="currentColor" className="text-amber-500 group-hover:text-amber-400" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </div>

                {/* Expanding Text */}
                <div className="max-w-0 overflow-hidden group-hover:max-w-[150px] transition-all duration-500 ease-out">
                    <span className="pl-3 pr-5 text-xs font-black text-slate-900 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-75 whitespace-nowrap">
                        Simulation
                    </span>
                </div>
            </button>

            <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title={config.title || "Laboratoire Mathématique"} showBrand={false}>
                {/* Responsive Container: Full height on mobile, fixed 70vh on desktop */}
                <div className="w-full h-full md:h-[70vh] min-h-[400px] flex flex-col relative bg-white rounded-xl overflow-hidden border border-slate-200 shadow-inner">
                    
                    {/* Container GeoGebra */}
                    <div className="absolute inset-0 z-10 bg-white">
                        <div id={containerId} className="w-full h-full"></div>
                    </div>

                    {/* Loading Overlay - Stylisé Platforme */}
                    {(!isLoaded && !error) && (
                        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-white transition-opacity duration-500">
                            <div className="relative w-20 h-20 mb-6 flex items-center justify-center">
                                <div className="absolute inset-0 border-4 border-slate-100 rounded-full"></div>
                                <div className="absolute inset-0 border-4 border-slate-900 rounded-full border-t-transparent animate-spin"></div>
                                <Icon name="science" className="text-3xl text-slate-300" />
                            </div>
                            <h3 className="text-xl font-display font-black text-slate-900 mb-2 animate-pulse tracking-tight">Initialisation...</h3>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em]">Laboratoire Virtuel</p>
                        </div>
                    )}

                    {/* Error State */}
                    {error && (
                        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-white text-rose-600">
                            <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center mb-4 border-2 border-rose-100">
                                <Icon name="cloud_off" className="text-3xl" />
                            </div>
                            <span className="font-bold text-lg text-slate-900 font-display">Connexion interrompue</span>
                            <p className="text-sm text-slate-500 mt-2 mb-6 font-medium">Le serveur GeoGebra est inaccessible.</p>
                            <button onClick={() => setIsOpen(false)} className="px-6 py-2 bg-slate-900 text-white rounded-lg font-bold text-xs uppercase tracking-widest hover:bg-slate-800 shadow-lg">
                                Fermer
                            </button>
                        </div>
                    )}
                </div>
            </Modal>
        </>
    );
};
