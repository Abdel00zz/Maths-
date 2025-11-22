
import React from 'react';
import { MathRenderer } from '../MathRenderer';

// Extended list with formulas wrapped in $...$ for the smart MathRenderer
const FORMULAS = [
    // Math & Physics Formulas
    { content: "$e^{i\\pi} + 1 = 0$", label: "Euler", top: "20%", left: "15%", delay: "0s", scale: 1.3 },
    { content: "$E = mc^2$", label: "Einstein", top: "15%", left: "70%", delay: "2s", scale: 1.1 },
    { content: "$\\displaystyle \\int_{-\\infty}^{\\infty} e^{-x^2} dx = \\sqrt{\\pi}$", label: "Gauss", top: "40%", left: "50%", delay: "1s", scale: 1.2 },
    { content: "$\\displaystyle i\\hbar\\frac{\\partial}{\\partial t}\\Psi = \\hat{H}\\Psi$", label: "Schrödinger", top: "70%", left: "15%", delay: "3s", scale: 1 },
    { content: "$\\displaystyle \\sum_{n=1}^{\\infty} \\frac{1}{n^2} = \\frac{\\pi^2}{6}$", label: "Riemann", top: "35%", left: "10%", delay: "5s", scale: 1.1 },
    { content: "$\\displaystyle \\nabla \\cdot \\mathbf{E} = \\frac{\\rho}{\\varepsilon_0}$", label: "Maxwell", top: "60%", left: "80%", delay: "2.5s", scale: 1 },
    { content: "$\\displaystyle \\phi = \\frac{1+\\sqrt{5}}{2}$", label: "Nombre d'Or", top: "50%", left: "90%", delay: "0.5s", scale: 1.2 },
    { content: "$\\displaystyle F = G \\frac{m_1 m_2}{r^2}$", label: "Newton", top: "85%", left: "60%", delay: "4s", scale: 1 },
    { content: "$\\displaystyle \\oint_C \\vec{B} \\cdot d\\vec{l} = \\mu_0 I$", label: "Ampère", top: "10%", left: "35%", delay: "6s", scale: 0.9 },
    { content: "$\\displaystyle x = \\frac{-b \\pm \\sqrt{\\Delta}}{2a}$", label: "Quadratique", top: "75%", left: "40%", delay: "1.5s", scale: 1.1 },
    
    // Arabic Mathematics & Concepts (Rendered as Text)
    { content: "الجبر", label: "Al-Jabr", top: "30%", left: "80%", delay: "3.5s", scale: 1.6, isText: true, color: "text-amber-400" },
    { content: "الخوارزميات", label: "Algorithmes", top: "60%", left: "30%", delay: "2s", scale: 1.4, isText: true, color: "text-amber-400" },
    { content: "اللانهاية", label: "Infini", top: "15%", left: "50%", delay: "4.5s", scale: 1.5, isText: true, color: "text-white" },
    { content: "برهان", label: "Démonstration", top: "90%", left: "80%", delay: "1s", scale: 1.3, isText: true, color: "text-amber-400" },
    { content: "$\\displaystyle \\pi \\approx \\frac{22}{7}$", label: "Archimède", top: "5%", left: "85%", delay: "5.5s", scale: 0.9 }
];

export const MathCosmos = () => (
  <div className="absolute inset-0 bg-slate-950 overflow-hidden perspective-1000 font-serif">
    
    {/* 1. Grid Floor (Base Structure) - Deeper 3D effect */}
    <div className="absolute inset-[-100%] w-[300%] h-[300%] origin-center transform-3d rotate-x-60 animate-[gridMove_40s_linear_infinite] opacity-20"
         style={{ 
             backgroundImage: 'linear-gradient(to right, rgba(255,255,255,0.15) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.15) 1px, transparent 1px)',
             backgroundSize: '80px 80px'
         }}>
    </div>

    {/* 2. Floating Formulas & Text */}
    {FORMULAS.map((f, i) => (
        <div 
            key={i}
            className={`absolute animate-float-slow select-none transition-all duration-500 cursor-pointer group hover:scale-110 hover:z-50 ${f.color || 'text-white/80 hover:text-white'}`}
            style={{ 
                top: f.top, 
                left: f.left, 
                animationDelay: f.delay,
                transform: `scale(${f.scale})`,
            }}
        >
            <div className="flex flex-col items-center backdrop-blur-[0px] group-hover:backdrop-blur-sm rounded-xl p-3 transition-all">
                <span className="text-[10px] font-sans font-bold uppercase tracking-widest mb-2 opacity-50 group-hover:opacity-100 text-amber-500 transition-opacity bg-black/40 px-2 py-0.5 rounded-full">
                    {f.label}
                </span>
                <div className={`drop-shadow-[0_0_15px_rgba(255,193,7,0.3)] ${f.isText ? 'font-arabic font-bold text-3xl md:text-5xl' : 'text-xl md:text-2xl'}`}>
                    {f.isText ? (
                        f.content
                    ) : (
                        <MathRenderer expression={f.content} />
                    )}
                </div>
            </div>
        </div>
    ))}

    {/* 3. Geometric Shapes - Enhanced Visibility */}
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-slate-500/20 rounded-full animate-[spin_120s_linear_infinite]"></div>
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-dashed border-amber-500/20 rounded-full animate-[spin_90s_linear_infinite_reverse]"></div>
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] border border-white/10 rounded-full animate-[spin_60s_linear_infinite]"></div>

    {/* 4. Ambient Light & Particles */}
    <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-bl from-indigo-900/40 via-transparent to-slate-950 pointer-events-none"></div>
    <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-slate-950 via-slate-900/50 to-transparent pointer-events-none"></div>
    
    <style>{`
      @keyframes gridMove {
        0% { transform: rotateX(60deg) translateY(0); }
        100% { transform: rotateX(60deg) translateY(80px); }
      }
      @keyframes float {
        0%, 100% { transform: translateY(0px) rotate(0deg); }
        25% { transform: translateY(-15px) rotate(1deg); }
        75% { transform: translateY(15px) rotate(-1deg); }
      }
      .animate-float-slow { animation: float 16s ease-in-out infinite; }
    `}</style>
  </div>
);
