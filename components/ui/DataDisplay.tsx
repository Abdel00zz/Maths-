
import React from 'react';
import { Link } from 'react-router-dom';
import { Icon } from './Base';

// --- Circular Progress : More Impactful ---
export const CircularProgress: React.FC<{ percentage: number; size?: number; strokeWidth?: number; color?: string; emptyColor?: string }> = ({ 
  percentage, 
  size = 60, 
  strokeWidth = 6,
  color = "text-violet-600",
  emptyColor = "text-slate-100"
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg className="transform -rotate-90 w-full h-full">
        <circle className={emptyColor} strokeWidth={strokeWidth} stroke="currentColor" fill="transparent" r={radius} cx={size / 2} cy={size / 2} />
        <circle className={`${color} transition-all duration-1000 ease-out`} strokeWidth={strokeWidth} strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round" stroke="currentColor" fill="transparent" r={radius} cx={size / 2} cy={size / 2} />
      </svg>
      <div className="absolute flex items-center justify-center flex-col">
         {/* BIGGER PERCENTAGE TEXT */}
         <span className="text-slate-900 font-black text-3xl md:text-4xl leading-none tracking-tight">{percentage}</span>
         <span className="text-xs font-bold text-slate-300 mt-[-2px]">%</span>
      </div>
    </div>
  );
};

// --- ProgressBar Component ---
export const ProgressBar: React.FC<{ progress: number; color?: string; height?: string; bg?: string }> = ({ progress, color = "bg-violet-600", height = "h-2", bg="bg-slate-100" }) => (
  <div className={`w-full ${bg} rounded-full overflow-hidden ${height}`}>
    <div 
      className={`${color} h-full rounded-full transition-all duration-700 ease-out shadow-[0_0_10px_rgba(124,58,237,0.4)]`} 
      style={{ width: `${Math.max(0, Math.min(100, progress))}%` }}
    />
  </div>
);

// --- Breadcrumb Component ---
export const Breadcrumb: React.FC<{ items: { label: string; link?: string }[] }> = ({ items }) => (
  <div className="flex items-center gap-2 text-[10px] font-bold tracking-widest text-slate-400 uppercase mb-8 overflow-x-auto whitespace-nowrap pb-2 scrollbar-hide">
    {items.map((item, idx) => (
      <React.Fragment key={idx}>
        {item.link ? (
          <Link to={item.link} className="hover:text-violet-600 transition-colors">
            {item.label}
          </Link>
        ) : (
          <span className="text-slate-800">{item.label}</span>
        )}
        {idx < items.length - 1 && (
           <Icon name="arrow_forward" className="text-[10px] opacity-50" />
        )}
      </React.Fragment>
    ))}
  </div>
);
