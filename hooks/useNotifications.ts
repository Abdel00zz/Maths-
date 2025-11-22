
import { useEffect, useRef } from 'react';
import { useAppContext } from '../context/AppContext';
import { AppNotification } from '../types';
import { Curriculum } from '../types';

/**
 * Intelligent Notification Hook
 * Handles automated background checks for sessions and motivational triggers.
 */
export const useNotifications = () => {
    const { state, dispatch, curriculum } = useAppContext();
    const processedSessionsRef = useRef<Set<string>>(new Set());
    const processedMotivationalRef = useRef<boolean>(false);

    // 1. Intelligent Session Monitor
    useEffect(() => {
        if (!curriculum) return;

        const checkSessions = () => {
            const now = new Date().getTime();
            const level = curriculum.levels[state.classId];
            
            if (!level) return;

            level.chapters?.forEach(chapter => {
                if (chapter.session_dates) {
                    chapter.session_dates.forEach(dateStr => {
                        const sessionTime = new Date(dateStr).getTime();
                        const diff = sessionTime - now;
                        const sessionId = `${chapter.id}-${dateStr}`;

                        const isStartingSoon = diff > 0 && diff < 15 * 60 * 1000; 
                        const isLive = diff <= 0 && diff > -2 * 60 * 60 * 1000;

                        const hasBeenNotified = processedSessionsRef.current.has(sessionId);
                        const alreadyExistsInState = state.notifications.some(n => n.id === `session-${sessionId}`);

                        if ((isStartingSoon || isLive) && !hasBeenNotified && !alreadyExistsInState) {
                            
                            const type = isLive ? 'session' : 'info';
                            const title = isLive ? '🔴 Séance EN DIRECT !' : '⏳ Préparez-vous à exceller';
                            const msg = isLive 
                                ? `Le cours sur "${chapter.title}" est en cours. Connectez-vous pour ne rien manquer.`
                                : `Votre séance sur "${chapter.title}" commence dans quelques minutes. Préparez vos outils.`;

                            const notif: AppNotification = {
                                id: `session-${sessionId}`,
                                type: type,
                                title: title,
                                message: msg,
                                timestamp: Date.now(),
                                isRead: false
                            };

                            dispatch({ type: 'ADD_NOTIFICATION', payload: notif });
                            processedSessionsRef.current.add(sessionId);
                        }
                    });
                }
            });
        };

        checkSessions();
        const interval = setInterval(checkSessions, 60000);
        return () => clearInterval(interval);
    }, [curriculum, state.classId, dispatch, state.notifications]);

    // 2. Intelligent Motivational Monitor (Resume Work)
    useEffect(() => {
        if (processedMotivationalRef.current) return;

        // Find the first chapter that is started but not finished
        const inProgressChapterId = Object.keys(state.progress).find(id => {
            const p = state.progress[id];
            return p.lesson.percentage > 0 && !p.isSubmitted;
        });

        if (inProgressChapterId && curriculum) {
            const level = curriculum.levels[state.classId];
            const chapter = level?.chapters.find(c => c.id === inProgressChapterId);
            
            if (chapter) {
                // Check if we recently notified about this (simple in-session check)
                const notifId = `resume-${inProgressChapterId}`;
                const alreadyExists = state.notifications.some(n => n.id === notifId);

                if (!alreadyExists) {
                    const notif: AppNotification = {
                        id: notifId,
                        type: 'info',
                        title: 'Reprenez votre élan 🚀',
                        message: `Vous avez commencé "${chapter.title}". Continuez votre progression vers l'excellence.`,
                        timestamp: Date.now(),
                        isRead: false
                    };
                    dispatch({ type: 'ADD_NOTIFICATION', payload: notif });
                }
            }
        }
        processedMotivationalRef.current = true;
    }, [state.progress, curriculum, state.classId, dispatch, state.notifications]);

    return {
        notifications: state.notifications,
        unreadCount: state.notifications.filter(n => !n.isRead).length
    };
};
