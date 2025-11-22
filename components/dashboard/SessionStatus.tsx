
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { CurriculumChapter } from '../../types';
import { getSessionStatus, getRelevantSessionDate, formatSessionDisplay } from '../../utils/sessionHelpers';
import { Icon } from '../ui/Base';

// --- Optimized Typewriter Hook ---
const useTypewriterLoop = (phrases: string[], typingSpeed = 80, deletingSpeed = 50, pauseDuration = 2000, enabled: boolean = true) => {
    const [text, setText] = useState('');
    const [isBlinking, setIsBlinking] = useState(false);
    
    const stateRef = useRef({
        phraseIndex: 0,
        currentText: '',
        isDeleting: false
    });

    useEffect(() => {
        if (!enabled) {
            return;
        }

        let timeoutId: ReturnType<typeof setTimeout>;

        const animate = () => {
            const state = stateRef.current;
            const fullText = phrases[state.phraseIndex % phrases.length];
            let delta = typingSpeed;

            if (state.isDeleting) {
                state.currentText = fullText.substring(0, state.currentText.length - 1);
                delta = deletingSpeed;
            } else {
                state.currentText = fullText.substring(0, state.currentText.length + 1);
            }

            setText(state.currentText);

            if (!state.isDeleting && state.currentText === fullText) {
                delta = pauseDuration;
                state.isDeleting = true;
                setIsBlinking(true);
            } else if (state.isDeleting && state.currentText === '') {
                state.isDeleting = false;
                state.phraseIndex++;
                delta = 500;
                setIsBlinking(false);
            } else {
                setIsBlinking(false);
            }

            timeoutId = setTimeout(animate, delta);
        };

        timeoutId = setTimeout(animate, typingSpeed);

        return () => clearTimeout(timeoutId);
    }, [phrases, typingSpeed, deletingSpeed, pauseDuration, enabled]);

    return { text, isBlinking };
};

export const SessionStatus: React.FC<{ chapter: CurriculumChapter }> = ({ chapter }) => {
    const [now, setNow] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setNow(new Date()), 60000);
        return () => clearInterval(timer);
    }, []);

    const status = useMemo(() => getSessionStatus(chapter, now), [chapter, now]);
    const targetDate = useMemo(() => getRelevantSessionDate(chapter, status, now), [chapter, status, now]);
    
    const isUpcoming = status === 'upcoming';

    const phrases = useMemo(() => {
        if (!isUpcoming || !targetDate) return [];
        return ["SÉANCE À VENIR", formatSessionDisplay(targetDate).toUpperCase()];
    }, [isUpcoming, targetDate]);
    
    const { text, isBlinking } = useTypewriterLoop(
        phrases, 
        70, 
        40, 
        2000,
        isUpcoming 
    );

    if (status === 'none' || !targetDate) return null;

    // LIVE STYLE : JAUNE BRILLANT & NOIR
    if (status === 'live') {
        return (
            <div className="relative group">
                <div className="absolute -inset-1 bg-yellow-400 rounded-full blur opacity-60 animate-pulse"></div>
                <div className="relative flex items-center gap-3 px-4 py-1.5 rounded-full bg-yellow-50 border border-yellow-400 shadow-sm transition-all">
                    <div className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-500 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-yellow-600"></span>
                    </div>
                    <div className="flex flex-col leading-none">
                        <span className="text-[9px] font-black text-slate-900 uppercase tracking-[0.2em]">En Direct</span>
                        <span className="text-[11px] font-bold text-slate-800 font-mono tracking-widest">
                             {targetDate.toLocaleTimeString('fr-FR', {hour: '2-digit', minute:'2-digit'}).replace(':', 'H')}
                        </span>
                    </div>
                </div>
            </div>
        );
    }

    // UPCOMING STYLE : NOIR SUR JAUNE/AMBRE
    if (status === 'upcoming') {
        return (
            <div className="flex items-center gap-2 px-2 py-1">
                <Icon name="event" className="text-[16px] text-yellow-600" />
                {/* Texte Noir pour la visibilité maximale */}
                <span className="font-mono text-[11px] font-bold tracking-wider text-slate-900 min-w-[120px]">
                    {text}
                    <span className={`inline-block w-1.5 h-3 ml-0.5 align-middle bg-yellow-500 ${isBlinking ? 'animate-pulse' : 'opacity-100'}`}></span>
                </span>
            </div>
        );
    }

    if (status === 'ended') {
        return (
            <div className="flex items-center gap-2 opacity-60 grayscale hover:grayscale-0 transition-all">
                <Icon name="history" className="text-[16px] text-slate-400" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 line-through decoration-slate-300">
                    Terminée
                </span>
            </div>
        );
    }

    return null;
};
