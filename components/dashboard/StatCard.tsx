
import React from 'react';
import { Icon } from '../ui/Base';

export const StatCard: React.FC<{ 
    label: string; 
    value: string | number; 
    sublabel?: string;
    icon: string;
    accent?: 'slate' | 'emerald' | 'violet';
}> = ({ label, value, sublabel, icon, accent = 'slate' }) => {
    
    // Style "Google One" / Nano-Pill : Très arrondi, fond subtil, pas de bordure
    const colors = {
        slate: "bg-slate-100 text-slate-900",
        emerald: "bg-emerald-50 text-emerald-800",
        violet: "bg-violet-50 text-violet-800"
    };

    return (
        <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full transition-all duration-300 hover:shadow-md cursor-default ${colors[accent]}`}>
            <Icon name={icon} className="text-lg opacity-70" filled />
            <span className="text-sm font-black font-display tracking-tight">
                {value}
            </span>
            {/* Label caché sur mobile ou très discret */}
            <span className="hidden sm:inline-block text-[10px] font-bold uppercase tracking-wider opacity-50 ml-1">
                {label}
            </span>
        </div>
    );
};
