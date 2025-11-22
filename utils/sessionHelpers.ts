
import { CurriculumChapter } from "../types";

export type SessionStatusType = 'live' | 'upcoming' | 'ended' | 'none';

const SESSION_DURATION_MS = 2 * 60 * 60 * 1000; // 2 Hours

/**
 * Analyzes the session dates and determines the current status relative to "now".
 */
export const getSessionStatus = (chapter: CurriculumChapter, now: Date = new Date()): SessionStatusType => {
    if (!chapter.session_dates || chapter.session_dates.length === 0) return 'none';

    // 1. Check for LIVE (Current time is between start and start + 2h)
    const hasActive = chapter.session_dates.some(dateStr => {
        const start = new Date(dateStr).getTime();
        const end = start + SESSION_DURATION_MS;
        const current = now.getTime();
        return current >= start && current <= end;
    });
    if (hasActive) return 'live';

    // 2. Check for UPCOMING (Current time is before start)
    // We want the *soonest* upcoming one to define the status
    const hasUpcoming = chapter.session_dates.some(dateStr => {
        const start = new Date(dateStr).getTime();
        return now.getTime() < start;
    });
    if (hasUpcoming) return 'upcoming';

    // 3. If we are here, sessions exist but none are live or upcoming -> Ended
    return 'ended';
};

/**
 * Gets the specific date object relevant to the current status.
 */
export const getRelevantSessionDate = (chapter: CurriculumChapter, status: SessionStatusType, now: Date = new Date()): Date | null => {
    if (!chapter.session_dates || status === 'none') return null;

    const timestamps = chapter.session_dates.map(d => new Date(d).getTime()).sort((a, b) => a - b);
    const current = now.getTime();

    if (status === 'live') {
        // Find the one currently active
        const active = timestamps.find(t => current >= t && current <= t + SESSION_DURATION_MS);
        return active ? new Date(active) : null;
    }

    if (status === 'upcoming') {
        // Find the first one in the future
        const next = timestamps.find(t => current < t);
        return next ? new Date(next) : null;
    }

    if (status === 'ended') {
        // Return the last one that finished
        return new Date(timestamps[timestamps.length - 1]);
    }

    return null;
};

/**
 * Formats a date for display (e.g., "Aujourd'hui à 14h00", "Demain à 10h00")
 */
export const formatSessionDisplay = (date: Date): string => {
    const now = new Date();
    const isToday = date.getDate() === now.getDate() && date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
    
    // Check for tomorrow
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const isTomorrow = date.getDate() === tomorrow.getDate() && date.getMonth() === tomorrow.getMonth() && date.getFullYear() === tomorrow.getFullYear();

    const timeStr = date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }).replace(':', 'h');

    if (isToday) return `Aujourd'hui à ${timeStr}`;
    if (isTomorrow) return `Demain à ${timeStr}`;
    
    // Standard date format
    return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }).replace(':', 'h');
};
