import React from 'react';

export const PlanetMathLogo: React.FC<{ light?: boolean; className?: string }> = ({ light = false, className = "" }) => (
  <div className={`relative w-12 h-12 flex items-center justify-center group ${className}`}>
    <div className={`absolute inset-0 border-2 rounded-full animate-[spin_8s_linear_infinite] ${light ? 'border-slate-200' : 'border-white/20'} border-dashed`}></div>
    <div className={`absolute inset-2 border-2 rounded-full animate-[spin_12s_linear_infinite_reverse] ${light ? 'border-amber-500' : 'border-amber-500/50'}`}></div>
    <div className="w-4 h-4 bg-gradient-to-tr from-amber-500 to-orange-600 rounded-full shadow-lg shadow-amber-500/50 relative z-10"></div>
  </div>
);