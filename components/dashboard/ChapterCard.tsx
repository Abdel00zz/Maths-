
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

// Motif SVG "Blue Marin" Géométrique & Doux
const CARD_PATTERN = `data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%231e3a8a' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E`;

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

    // --- Style "Blue Marin Doux" avec SVG ---
    // Fond très clair (#F0F7FF) avec motif, bordure Bleu Marine (blue-900)
    const containerClasses = isUnlocked 
        ? isHighlighted 
            ? "bg-[#F0F7FF] border-[3px] border-blue-900 shadow-[0_8px_30px_rgb(30,58,138,0.12)] hover:shadow-[0_8px_40px_rgb(30,58,138,0.2)] hover:-translate-y-1 cursor-pointer group"
            : "bg-white border-2 border-slate-900 shadow-[6px_6px_0px_0px_rgba(15,23,42,0.15)] hover:shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] hover:-translate-y-1 cursor-pointer group"
        : "bg-slate-50 border-2 border-slate-200 opacity-60 cursor-not-allowed";

    return (
        <div 
            onClick={handleNavigate}
            onMouseEnter={() => isUnlocked && prefetchChapter(chapter.id)}
            className={`relative w-full rounded-[2.5rem] transition-all duration-300 ease-out select-none overflow-hidden p-0 ${containerClasses}`}
            style={isHighlighted ? { backgroundImage: `url("${CARD_PATTERN}")`, backgroundSize: '60px 60px' } : {}}
        >
            {/* Gradient Overlay subtil pour la profondeur sur la carte active */}
            {isHighlighted && <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-transparent to-blue-50/30 pointer-events-none"></div>}

            <div className="relative p-8 md:p-10 flex flex-col md:flex-row items-center gap-8 h-full z-10">
                
                {/* GAUCHE : Indicateur de Progression - Style Blue Marin */}
                <div className="flex-shrink-0 relative">
                    {isUnlocked ? (
                         <div className="scale-110 transform transition-transform duration-500 group-hover:scale-125 group-hover:rotate-3">
                            <CircularProgress 
                                percentage={stats.globalPercentage} 
                                size={80} 
                                strokeWidth={8} 
                                color={isHighlighted ? "text-blue-900" : "text-slate-900"} 
                                emptyColor={isHighlighted ? "text-blue-200/50" : "text-slate-100"} 
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
                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm ${isHighlighted ? 'bg-blue-900 text-white' : 'bg-slate-900 text-white'}`}>
                            Chapitre {String(index).padStart(2, '0')}
                        </span>
                        
                        {/* Affichage Session */}
                        <div className="scale-100 origin-left">
                             <SessionStatus chapter={chapter} />
                        </div>
                    </div>

                    {/* Titre - Noir Profond (Visible) */}
                    <h3 className="text-2xl md:text-3xl font-display font-black text-slate-900 leading-tight tracking-tight">
                        <MathRenderer expression={chapter.title} inline />
                    </h3>

                    {/* Détails Techniques - Blue Marin contrasté */}
                    {isUnlocked && (
                        <div className={`flex flex-wrap items-center justify-center md:justify-start gap-6 font-medium pt-1 ${isHighlighted ? 'text-blue-900' : 'text-slate-500'}`}>
                            <div className="flex items-center gap-2">
                                <div className={`w-1.5 h-1.5 rounded-full ${isHighlighted ? 'bg-blue-900' : 'bg-slate-900'}`}></div>
                                <span className="text-[10px] font-bold uppercase tracking-wider">Cours</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className={`w-1.5 h-1.5 rounded-full ${isHighlighted ? 'bg-blue-900' : 'bg-slate-900'}`}></div>
                                <span className="text-[10px] font-bold uppercase tracking-wider">{quizLoading ? '-' : (quizCount || 0)} QCM</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className={`w-1.5 h-1.5 rounded-full ${isHighlighted ? 'bg-blue-900' : 'bg-slate-900'}`}></div>
                                <span className="text-[10px] font-bold uppercase tracking-wider">{exCount || 0} Exos</span>
                            </div>
                        </div>
                    )}
                </div>

                {/* DROITE : Flèche Extrême (Bouton Flottant - Blue Marin) */}
                {isUnlocked && (
                    <div className="hidden md:flex items-center justify-center pl-4">
                        <div className={`w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:rotate-[-45deg] shadow-lg border-4 border-white ring-1 ${isHighlighted ? 'bg-blue-900 text-white ring-blue-200 shadow-blue-900/20' : 'bg-slate-900 text-white ring-slate-100'}`}>
                            <Icon name="arrow_forward" className="text-3xl" />
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
});
