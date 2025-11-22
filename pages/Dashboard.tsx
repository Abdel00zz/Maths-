
import React, { useState, useEffect, useMemo } from 'react';
import { Icon } from '../components/ui/Base.tsx';
import { useAppContext } from '../context/AppContext.tsx';
import { useCurriculum } from '../hooks/useContent.ts';
import { OrientationModal } from '../components/OrientationModal.tsx';
import { HelpModal } from '../components/HelpModal.tsx';
import { NotificationModal } from '../components/NotificationModal.tsx';
import { useNotifications } from '../hooks/useNotifications.ts';
import { ChapterCard } from '../components/dashboard/ChapterCard.tsx';
import { StatCard } from '../components/dashboard/StatCard.tsx';
import { ChapterProgress } from '../types.ts';
import { getSessionStatus } from '../utils/sessionHelpers.ts';

const Dashboard: React.FC = () => {
  const { state } = useAppContext();
  const { data: curriculum, isLoading, error } = useCurriculum();
  
  const [showOrientation, setShowOrientation] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const { unreadCount } = useNotifications();

  // Clock for live sorting
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(interval);
  }, []);
  
  // Sorting Logic
  const sortedChapters = useMemo(() => {
      if (!curriculum) return [];
      const classLevel = curriculum.levels[state.classId];
      if (!classLevel) return [];
      
      const chapters = [...classLevel.chapters];

      return chapters.sort((a, b) => {
          const statusA = getSessionStatus(a, now);
          const statusB = getSessionStatus(b, now);

          if (statusA === 'live' && statusB !== 'live') return -1;
          if (statusB === 'live' && statusA !== 'live') return 1;
          if (statusA === 'upcoming' && statusB !== 'upcoming') return -1;
          if (statusB === 'upcoming' && statusA !== 'upcoming') return 1;
          return 0; 
      });
  }, [curriculum, state.classId, now]);

  // Original chapters for indexing
  const originalChapters = curriculum ? curriculum.levels[state.classId]?.chapters || [] : [];

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-[#FDFDFD]"><div className="animate-spin w-10 h-10 border-4 border-slate-900 border-t-transparent rounded-full"/></div>;
  }

  if (error || !curriculum) {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#FDFDFD] p-6 text-center">
            <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center mb-6">
                <Icon name="cloud_off" className="text-4xl text-rose-400" />
            </div>
            <h2 className="text-2xl font-black text-slate-900 mb-2 font-display">Erreur de Chargement</h2>
            <button onClick={() => window.location.reload()} className="px-8 py-3 bg-slate-900 text-white rounded-xl font-bold uppercase tracking-widest hover:bg-blue-600 transition-all shadow-lg">Réessayer</button>
        </div>
    );
  }

  const submitted = Object.values(state.progress).filter((p: ChapterProgress) => p.isSubmitted).length;
  const quizDone = Object.values(state.progress).filter((p: ChapterProgress) => p.quiz.isSubmitted).length;
  const totalChapters = sortedChapters.length;
  const completionRate = totalChapters > 0 ? Math.round((submitted / totalChapters) * 100) : 0;

  return (
    <div className="min-h-screen bg-[#F8F9FA] pb-32 relative font-body selection:bg-slate-900 selection:text-white overflow-x-hidden">
       
       {/* Background SVG Géométrique Visible (Cross Pattern) */}
       <div className="fixed inset-0 z-0 pointer-events-none opacity-[0.6]" 
            style={{ 
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23cbd5e1' fill-opacity='0.3'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                backgroundSize: '60px 60px'
            }}>
       </div>
       
       {/* Gradient Overlay for Top Fade */}
       <div className="fixed inset-x-0 top-0 h-64 bg-gradient-to-b from-white to-transparent pointer-events-none z-0"></div>

       <OrientationModal isOpen={showOrientation} onClose={() => setShowOrientation(false)} classId={state.classId} />
       <HelpModal isOpen={showHelp} onClose={() => setShowHelp(false)} />
       <NotificationModal isOpen={showNotifications} onClose={() => setShowNotifications(false)} />

       {/* Navigation Flottante */}
       <div className="fixed top-6 right-6 md:right-12 z-40 flex gap-3">
            <button onClick={() => setShowOrientation(true)} className="w-12 h-12 rounded-full bg-white border-2 border-slate-900 text-slate-900 flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[-2px] transition-all active:translate-y-0 active:shadow-none" title="Orientation">
                <Icon name="explore" className="text-xl" />
            </button>
            
            <button 
                onClick={() => setShowNotifications(true)} 
                className="w-12 h-12 rounded-full bg-white border-2 border-slate-900 text-slate-900 flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[-2px] transition-all active:translate-y-0 active:shadow-none relative" 
                title="Notifications"
            >
                <Icon name={unreadCount > 0 ? "notifications_active" : "notifications"} className={`text-xl ${unreadCount > 0 ? 'text-amber-600' : ''}`} />
                {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 w-3 h-3 bg-rose-500 rounded-full border-2 border-white"></span>
                )}
            </button>

            <button onClick={() => setShowHelp(true)} className="w-12 h-12 rounded-full bg-white border-2 border-slate-900 text-slate-900 flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[-2px] transition-all active:translate-y-0 active:shadow-none" title="Aide">
                <Icon name="help" className="text-xl" />
            </button>
       </div>

       <div className="container mx-auto px-6 md:px-12 pt-12 md:pt-16 max-w-7xl relative z-10">
          
          {/* Header Année Scolaire - Isolé en haut */}
          <div className="mb-8">
             <span className="inline-flex items-center gap-2 bg-slate-900 text-white px-5 py-2 rounded-full text-[11px] font-black uppercase tracking-widest shadow-xl hover:scale-105 transition-transform cursor-default">
                <Icon name="school" className="text-sm" />
                Année Scolaire 2025-2026
             </span>
          </div>

          {/* HEADER PRINCIPAL : Alignement Parfait et Fabuleux */}
          <header className="mb-20">
             <div className="flex flex-col-reverse md:flex-row md:items-end justify-between gap-8 pb-4">
                 
                 {/* GAUCHE: STATS ALIGNÉES AVEC LE BAS DU TEXTE */}
                 <div className="flex flex-wrap gap-3 pb-2">
                    <StatCard 
                        label="Validés" 
                        value={submitted} 
                        icon="check_circle"
                        accent="slate"
                    />
                    <StatCard 
                        label="Quiz" 
                        value={quizDone}
                        icon="bolt" 
                        accent="emerald"
                    />
                    <StatCard 
                        label="Global" 
                        value={`${completionRate}%`} 
                        icon="pie_chart"
                        accent="violet" 
                    />
                 </div>

                 {/* DROITE: TEXTE ARABE + NOM (RTL) */}
                 <div className="text-right relative ml-auto max-w-4xl">
                     {/* Titre RTL avec le nom intégré directement dans le flux */}
                     <h1 className="text-5xl md:text-6xl lg:text-7xl font-arabic font-extrabold text-slate-900 leading-[1.3] tracking-tight" dir="rtl">
                         مرحباً بعودتك، <span className="text-transparent bg-clip-text bg-gradient-to-l from-amber-500 to-orange-600 px-1">{state.studentName}</span>
                     </h1>
                     <p className="text-lg text-slate-500 font-medium mt-2 font-arabic" dir="rtl">
                        كل خطوة صغيرة تقربك من التميز. واصل التقدم!
                     </p>
                 </div>
             </div>
          </header>

          {/* SECTION CONTENU - Lignes Majestueuses */}
          <div className="relative">
             
             {/* Titre de Section avec Séparateurs Fabuleux */}
             <div className="mb-16 flex items-center gap-6">
                 {/* Ligne Gauche */}
                 <div className="h-[2px] flex-1 bg-gradient-to-l from-slate-900 to-transparent opacity-20 relative">
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-slate-900 rotate-45"></div>
                 </div>
                 
                 <h2 className="font-display text-3xl md:text-4xl font-black text-slate-900 tracking-tight uppercase text-center">
                    Progression Pédagogique
                 </h2>
                 
                 {/* Ligne Droite */}
                 <div className="h-[2px] flex-1 bg-gradient-to-r from-slate-900 to-transparent opacity-20 relative">
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-slate-900 rotate-45"></div>
                 </div>
             </div>

             {/* Grid de Cartes - Grandes et Aérées */}
             <div className="grid grid-cols-1 gap-10 pb-32">
                {sortedChapters.map((chapter, index) => {
                    // Calculer l'index réel basé sur la liste originale du curriculum
                    const realIndex = originalChapters.findIndex(c => c.id === chapter.id) + 1;
                    return (
                        <div key={chapter.id} className="animate-fadeIn" style={{ animationDelay: `${index * 100}ms` }}>
                            <ChapterCard chapter={chapter} index={realIndex} />
                        </div>
                    );
                })}
             </div>
             
             {/* Footer Signature */}
             <div className="text-center py-12">
                <div className="inline-flex items-center gap-4 opacity-30">
                    <div className="w-12 h-[1px] bg-slate-900"></div>
                    <div className="w-2 h-2 bg-slate-900 rounded-full"></div>
                    <div className="w-12 h-[1px] bg-slate-900"></div>
                </div>
                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400 mt-4">
                    Planet Math • Excellence • 2025
                </p>
             </div>

          </div>
       </div>
    </div>
  );
};

export default Dashboard;
