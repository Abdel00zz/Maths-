
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { CircularProgress } from '../ui/DataDisplay.tsx';
import { Icon } from '../ui/Base.tsx';
import { useAppContext } from '../../context/AppContext.tsx';
import { usePrefetchContent } from '../../hooks/useContent.ts';
import { useChapterProgress } from '../../hooks/useProgress.ts';
import { ContentService } from '../../services/ContentService.ts';
import { getSessionStatus } from '../../utils/sessionHelpers.ts';
import { SessionStatus } from './SessionStatus.tsx';
import { MathRenderer } from '../MathRenderer.tsx';

export const ChapterCard: React.FC<{ chapter: any; index: number }> = React.memo(({ chapter, index }) => {
    const navigate = useNavigate();
    const { state } = useAppContext();
    const { prefetchChapter } = usePrefetchContent();
    const stats = useChapterProgress(chapter.id);

    // Session Logic
    const [now, setNow] = useState(new Date());
    useEffect(() => { const t = setInterval(() => setNow(new Date()), 60000); return () => clearInterval(t); }, []);
    
    const sessionStatus = getSessionStatus(chapter, now);
    const isLive = sessionStatus === 'live';
    const isUpcoming = sessionStatus === 'upcoming';
    // La carte est "Active/Highlight" si elle est en direct OU si une séance est programmée
    const isHighlighted = isLive || isUpcoming;
    
    // UNLOCK RULE
    const hasSessions = chapter.session_dates && chapter.session_dates.length > 0;
    const isUnlocked = chapter.isActive || hasSessions;

    // Data Fetching
    const { data: quizData, isLoading: quizLoading } = useQuery({
        queryKey: ['quiz', state.classId, chapter.id, 'count'],
        queryFn: () => ContentService.getChapterQuiz(state.classId, chapter.id).catch(() => ({ questions: [] })),
        enabled: !!chapter.id && isUnlocked,
        staleTime: 1000 * 60 * 60 * 24
    });

    const { data: exData } = useQuery({
        queryKey: ['exercises', state.classId, chapter.id, 'count'],
        queryFn: () => ContentService.getChapterExercises(state.classId, chapter.id).catch(() => ({ exercises: [] })),
        enabled: !!chapter.id && isUnlocked,
        staleTime: 1000 * 60 * 60 * 24
    });

    const quizCount = quizData?.questions?.length;
    const exCount = exData?.exercises?.length;

    const handleNavigate = () => {
        if (isUnlocked) navigate(`/chapter/${chapter.id}`);
    };

    // --- Style "Cadre Visible & Gras" (Néo-Brutaliste Chic) ---
    // Si HIGHLIGHTED (Live ou Upcoming) : Style JAUNE BRILLANT & NOIR
    const containerClasses = isUnlocked 
        ? isHighlighted 
            ? "bg-gradient-to-br from-white via-yellow-50 to-yellow-100 border-[3px] border-yellow-400 shadow-[0_0_40px_-5px_rgba(250,204,21,0.6)] hover:shadow-[0_0_60px_-5px_rgba(250,204,21,0.8)] hover:-translate-y-2 cursor-pointer group animate-[pulse_4s_ease-in-out_infinite]"
            : "bg-white border-2 border-slate-900 shadow-[6px_6px_0px_0px_rgba(15,23,42,0.15)] hover:shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] hover:-translate-y-1 cursor-pointer group"
        : "bg-slate-50 border-2 border-slate-200 opacity-60 cursor-not-allowed";

    return (
        <div 
            onClick={handleNavigate}
            onMouseEnter={() => isUnlocked && prefetchChapter(chapter.id)}
            className={`relative w-full rounded-[2.5rem] transition-all duration-300 ease-out select-none overflow-hidden p-0 ${containerClasses}`}
        >
            {/* Effet de brillance supplémentaire pour le mode Highlighted */}
            {isHighlighted && <div className="absolute inset-0 bg-yellow-400/10 animate-pulse pointer-events-none"></div>}

            <div className="relative p-8 md:p-10 flex flex-col md:flex-row items-center gap-8 h-full">
                
                {/* GAUCHE : Indicateur de Progression Épuré */}
                <div className="flex-shrink-0 relative">
                    {isUnlocked ? (
                         <div className="scale-110 transform transition-transform duration-500 group-hover:scale-125 group-hover:rotate-6">
                            <CircularProgress 
                                percentage={stats.globalPercentage} 
                                size={80} 
                                strokeWidth={8} 
                                // Couleur Jaune Brillant pour le cercle, texte Noir par défaut via component
                                color={isHighlighted ? "text-yellow-500" : "text-slate-900"} 
                                emptyColor={isHighlighted ? "text-yellow-200" : "text-slate-100"} 
                            />
                         </div>
                    ) : (
                        <div className="w-20 h-20 rounded-full bg-slate-100 border-2 border-slate-200 flex items-center justify-center text-slate-300">
                            <Icon name="lock" className="text-2xl" />
                        </div>
                    )}
                </div>

                {/* CENTRE : Contenu Pédagogique */}
                <div className="flex-1 text-center md:text-left min-w-0 w-full flex flex-col justify-center gap-4 pl-0 md:pl-2">
                    
                    {/* Meta Tags & Session */}
                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                        {/* Badge Chapitre : Noir sur Jaune si actif, Blanc sur Noir sinon */}
                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm ${isHighlighted ? 'bg-yellow-400 text-slate-900' : 'bg-slate-900 text-white'}`}>
                            Chapitre {String(index).padStart(2, '0')}
                        </span>
                        
                        {/* Affichage Session toujours visible si existante */}
                        <div className="scale-100 origin-left">
                             <SessionStatus chapter={chapter} />
                        </div>
                    </div>

                    {/* Titre - Toujours NOIR pour la lisibilité */}
                    <h3 className={`text-2xl md:text-3xl font-display font-black leading-tight tracking-tight ${isUnlocked ? 'text-slate-900' : 'text-slate-400'}`}>
                        <MathRenderer expression={chapter.title} inline />
                    </h3>

                    {/* Détails Techniques - Noir ou Gris foncé */}
                    {isUnlocked && (
                        <div className={`flex flex-wrap items-center justify-center md:justify-start gap-6 font-medium pt-1 ${isHighlighted ? 'text-slate-800' : 'text-slate-500'}`}>
                            <div className="flex items-center gap-2">
                                <div className={`w-1.5 h-1.5 rounded-full ${isHighlighted ? 'bg-yellow-500' : 'bg-slate-900'}`}></div>
                                <span className="text-[10px] font-bold uppercase tracking-wider">Cours</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className={`w-1.5 h-1.5 rounded-full ${isHighlighted ? 'bg-yellow-500' : 'bg-slate-900'}`}></div>
                                <span className="text-[10px] font-bold uppercase tracking-wider">{quizLoading ? '-' : (quizCount || 0)} QCM</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className={`w-1.5 h-1.5 rounded-full ${isHighlighted ? 'bg-yellow-500' : 'bg-slate-900'}`}></div>
                                <span className="text-[10px] font-bold uppercase tracking-wider">{exCount || 0} Exos</span>
                            </div>
                        </div>
                    )}
                </div>

                {/* DROITE : Flèche Extrême (Bouton Flottant) */}
                {isUnlocked && (
                    <div className="hidden md:flex items-center justify-center pl-4">
                        <div className={`w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:rotate-[-45deg] shadow-lg border-4 border-white ring-1 ${isHighlighted ? 'bg-yellow-400 text-slate-900 ring-yellow-300' : 'bg-slate-900 text-white ring-slate-100'}`}>
                            <Icon name="arrow_forward" className="text-3xl font-bold" />
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
});
