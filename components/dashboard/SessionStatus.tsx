
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

    // LIVE STYLE : GREEN EMERALD VIBRANT (NO BADGE)
    if (status === 'live') {
        return (
            <div className="flex items-center gap-3 pl-1">
                <div className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                </div>
                <div className="flex flex-col leading-none">
                    <span className="text-[9px] font-black text-emerald-600 uppercase tracking-[0.2em] mb-0.5">En Direct</span>
                    <span className="text-[11px] font-bold text-emerald-700 font-mono tracking-widest">
                         {targetDate.toLocaleTimeString('fr-FR', {hour: '2-digit', minute:'2-digit'}).replace(':', 'H')}
                    </span>
                </div>
            </div>
        );
    }

    // UPCOMING STYLE : GREEN EMERALD CLAIR (NO BADGE)
    if (status === 'upcoming') {
        return (
            <div className="flex items-center gap-2 pl-1">
                <Icon name="event" className="text-[18px] text-emerald-500" />
                <span className="font-mono text-[11px] font-bold tracking-wider text-emerald-600 min-w-[120px]">
                    {text}
                    <span className={`inline-block w-1.5 h-3 ml-0.5 align-middle bg-emerald-500 ${isBlinking ? 'opacity-100' : 'opacity-0'}`}></span>
                </span>
            </div>
        );
    }

    if (status === 'ended') {
        return (
            <div className="flex items-center gap-2 opacity-50 grayscale hover:grayscale-0 transition-all pl-1">
                <Icon name="history" className="text-[16px] text-slate-400" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 line-through decoration-slate-300">
                    Terminée
                </span>
            </div>
        );
    }

    return null;
};
