
import React from 'react';

// --- Icon Component ---
export const Icon: React.FC<{ name: string; className?: string; filled?: boolean }> = ({ name, className = "", filled = false }) => (
  <span 
    className={`material-symbols-outlined select-none ${className}`} 
    style={{ fontVariationSettings: `'FILL' ${filled ? 1 : 0}` }}
  >
    {name}
  </span>
);

// --- Badge Component ---
export const Badge: React.FC<{ children: React.ReactNode; color?: string; className?: string }> = ({ children, color = "bg-slate-100 text-slate-700", className = "" }) => (
  <span className={`inline-flex items-center px-2 py-1 rounded-sm text-[11px] font-bold uppercase tracking-wide ${color} ${className}`}>
    {children}
  </span>
);

// --- Button Component ---
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'white' | 'ghost' | 'outline' | 'success' | 'glass';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  icon?: string;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  icon, 
  fullWidth = false,
  className = "", 
  ...props 
}) => {
  // Utilisation de classes standards Tailwind au lieu de hex arbitraires pour garantir la compatibilité
  const baseStyles = "inline-flex items-center justify-center gap-2 rounded-md font-semibold transition-all duration-200 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-blue-700 text-white hover:bg-blue-800 shadow-sm active:bg-blue-900", // Standard blue instead of hex
    secondary: "bg-slate-100 text-slate-900 hover:bg-slate-200 border border-transparent",
    white: "bg-white text-blue-700 border border-blue-700 hover:bg-blue-50",
    ghost: "bg-transparent text-slate-600 hover:bg-slate-100 hover:text-blue-700",
    outline: "bg-transparent border border-slate-300 text-slate-700 hover:border-slate-800",
    success: "bg-emerald-700 text-white hover:bg-emerald-800 shadow-sm", // Standard emerald
    glass: "bg-white/90 backdrop-blur-sm border border-slate-200 text-slate-800 hover:bg-white"
  };

  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-5 py-2.5 text-sm",
    lg: "px-8 py-3 text-base",
    icon: "w-10 h-10 p-0"
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${fullWidth ? 'w-full' : ''} ${className}`} 
      {...props}
    >
      {icon && <Icon name={icon} className={children ? "text-[1.2em]" : "text-[1.5em]"} />}
      {children}
    </button>
  );
};
