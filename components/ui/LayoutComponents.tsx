
import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Icon } from './Base';

// --- Professional Card ---
export const Card: React.FC<{ 
  children: React.ReactNode; 
  className?: string; 
  onClick?: () => void;
  onMouseEnter?: () => void;
  variant?: 'default' | 'glass' | 'neumorph' | 'ultra' | 'flat';
}> = React.memo(({ children, className = "", onClick, onMouseEnter, variant = 'default' }) => {
  
  const baseClasses = "rounded-3xl transition-all duration-300 relative overflow-hidden";

  const variants = {
    default: "bg-white shadow-sm hover:shadow-md border border-slate-100",
    flat: "bg-slate-50 border border-slate-100",
    glass: "bg-white/80 backdrop-blur-sm border border-white/50 shadow-sm",
    neumorph: "bg-[#F0F4F9] shadow-inner border border-white",
    ultra: "bg-white border border-slate-100 shadow-lg hover:-translate-y-1"
  };

  return (
    <div 
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      className={`${baseClasses} ${variants[variant]} ${className}`}
    >
      <div className="relative z-10 h-full">
        {children}
      </div>
    </div>
  );
});

// --- Modal Component using Portal ---
interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: React.ReactNode;
    showBrand?: boolean; 
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 md:p-6 animate-fadeIn">
      {/* Backdrop Overlay - Improved Glassmorphism */}
      <div className="absolute inset-0 bg-slate-900/30 backdrop-blur-xl transition-opacity duration-500" onClick={onClose} />
      
      {/* Modal Container - Google One Style: Ultra Rounded (3rem), White, Floating */}
      <div className="relative bg-white/95 backdrop-blur-2xl w-full md:max-w-5xl h-full md:h-auto md:max-h-[85vh] flex flex-col shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] transform transition-all rounded-[3rem] overflow-hidden border border-white/50 ring-1 ring-white/60">
        
        {/* Header Architectural */}
        <div className="px-8 py-8 flex items-center justify-between sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-slate-100/50">
           <div className="flex flex-col min-w-0 pr-4">
              {title && <h3 className="text-3xl font-display font-black text-slate-900 tracking-tight leading-tight">{title}</h3>}
           </div>
           <button 
             onClick={onClose} 
             className="w-14 h-14 rounded-full bg-slate-50 hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-all duration-300 active:scale-90 flex-shrink-0"
             aria-label="Fermer"
           >
             <Icon name="close" className="text-xl" />
           </button>
        </div>
        
        {/* Content Scrollable */}
        <div className="px-8 pb-10 pt-6 overflow-y-auto custom-scrollbar flex-1 font-body text-slate-700">
           {children}
        </div>
      </div>
    </div>,
    document.body 
  );
};

// --- Mobile Sheet / Drawer Component ---
export const Sheet: React.FC<{ 
    isOpen: boolean; 
    onClose: () => void; 
    children: React.ReactNode; 
    title?: string; 
    position?: 'bottom' | 'right';
}> = ({ isOpen, onClose, children, title, position = 'bottom' }) => {
    const [visible, setVisible] = useState(isOpen);

    useEffect(() => {
        if (isOpen) setVisible(true);
        else setTimeout(() => setVisible(false), 300);
    }, [isOpen]);

    if (!visible) return null;

    const baseClasses = "fixed z-[100] bg-white shadow-2xl transition-transform duration-300 ease-out";
    const posClasses = position === 'bottom' 
        ? `bottom-0 left-0 right-0 rounded-t-[2.5rem] max-h-[90vh] ${isOpen ? 'translate-y-0' : 'translate-y-full'}`
        : `top-0 right-0 h-full w-80 md:w-96 border-l border-slate-100 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`;

    return createPortal(
        <div className="fixed inset-0 z-[9999]">
            <div 
                className={`absolute inset-0 bg-slate-900/30 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}
                onClick={onClose}
            />
            <div className={`${baseClasses} ${posClasses} flex flex-col pb-safe-bottom`}>
                 {position === 'bottom' && (
                    <div className="w-full flex justify-center pt-4 pb-2 touch-none" onClick={onClose}>
                        <div className="w-14 h-1.5 bg-slate-200 rounded-full" />
                    </div>
                 )}
                 <div className="flex-1 overflow-y-auto custom-scrollbar font-body">
                    {title && (
                        <div className="flex justify-between items-center px-8 py-6 sticky top-0 bg-white/90 backdrop-blur-md z-10 border-b border-slate-50">
                            <h3 className="text-xl font-bold text-slate-900 font-display tracking-tight">{title}</h3>
                            <button onClick={onClose} className="w-10 h-10 hover:bg-slate-100 rounded-full flex items-center justify-center text-slate-500 transition-colors">
                                <Icon name="close" />
                            </button>
                        </div>
                    )}
                    <div className="p-8 text-slate-700">
                        {children}
                    </div>
                 </div>
            </div>
        </div>,
        document.body
    );
};
