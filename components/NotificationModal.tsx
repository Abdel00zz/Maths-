import React from 'react';
import { Modal } from './ui/LayoutComponents';
import { Icon, Button } from './ui/Base';
import { AppNotification } from '../types';
import { useAppContext } from '../context/AppContext';

interface NotificationModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const NotificationItem: React.FC<{ notification: AppNotification; onRead: (id: string) => void }> = ({ notification, onRead }) => {
    const timeAgo = (timestamp: number) => {
        const seconds = Math.floor((Date.now() - timestamp) / 1000);
        if (seconds < 60) return "À l'instant";
        const minutes = Math.floor(seconds / 60);
        if (minutes < 60) return `Il y a ${minutes} min`;
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `Il y a ${hours} h`;
        return `Il y a ${Math.floor(hours / 24)} j`;
    };

    const getTheme = () => {
        switch (notification.type) {
            case 'achievement': return { icon: 'emoji_events', color: 'text-amber-600 bg-amber-50 border-amber-200' };
            case 'session': return { icon: 'live_tv', color: 'text-rose-600 bg-rose-50 border-rose-200' };
            case 'update': return { icon: 'update', color: 'text-blue-600 bg-blue-50 border-blue-200' };
            default: return { icon: 'notifications', color: 'text-slate-600 bg-slate-50 border-slate-200' };
        }
    };

    const theme = getTheme();

    return (
        <div 
            onClick={() => !notification.isRead && onRead(notification.id)}
            className={`
                relative p-5 rounded-xl border-2 transition-all duration-300 group mb-4 last:mb-0 cursor-pointer
                ${notification.isRead 
                    ? 'bg-white border-slate-100 opacity-70 grayscale-[0.5] hover:opacity-100 hover:grayscale-0' 
                    : 'bg-white border-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,0.1)] hover:translate-y-[-2px]'
                }
            `}
        >
            <div className="flex gap-5">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center border-2 flex-shrink-0 ${theme.color}`}>
                    <Icon name={theme.icon} className="text-2xl" />
                </div>
                <div className="flex-1">
                    <div className="flex justify-between items-start mb-1">
                        <h4 className={`font-bold text-sm ${notification.isRead ? 'text-slate-600' : 'text-slate-900'}`}>
                            {notification.title}
                        </h4>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 bg-slate-50 px-2 py-0.5 rounded border border-slate-100">
                            {timeAgo(notification.timestamp)}
                        </span>
                    </div>
                    <p className="text-xs text-slate-500 font-medium leading-relaxed">
                        {notification.message}
                    </p>
                </div>
            </div>
            
            {/* Unread Indicator */}
            {!notification.isRead && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-rose-500 rounded-full border-2 border-white shadow-sm animate-pulse"></div>
            )}
        </div>
    );
};

export const NotificationModal: React.FC<NotificationModalProps> = ({ isOpen, onClose }) => {
    const { state, dispatch } = useAppContext();
    const notifications = state.notifications || [];
    const unreadCount = notifications.filter(n => !n.isRead).length;

    const handleMarkAllRead = () => {
        dispatch({ type: 'MARK_ALL_NOTIFICATIONS_READ' });
    };

    const handleMarkRead = (id: string) => {
        dispatch({ type: 'MARK_NOTIFICATION_READ', payload: { id } });
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Notifications">
            <div className="flex justify-between items-end mb-8 pb-4 border-b-2 border-dashed border-slate-200">
                <div>
                    <h4 className="font-bold text-slate-900">Activités récentes</h4>
                    <p className="text-xs text-slate-500 font-medium">Restez informé de votre progression.</p>
                </div>
                {unreadCount > 0 && (
                    <button 
                        onClick={handleMarkAllRead}
                        className="text-[10px] font-bold uppercase tracking-widest text-slate-500 hover:text-slate-900 hover:underline transition-colors"
                    >
                        Tout marquer comme lu
                    </button>
                )}
            </div>

            <div className="min-h-[300px]">
                {notifications.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-64 text-slate-400">
                        <div className="w-20 h-20 bg-slate-50 rounded-full border-2 border-dashed border-slate-200 flex items-center justify-center mb-4">
                            <Icon name="notifications_off" className="text-3xl" />
                        </div>
                        <p className="font-bold text-sm">Aucune notification</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {notifications.map(notif => (
                            <NotificationItem key={notif.id} notification={notif} onRead={handleMarkRead} />
                        ))}
                    </div>
                )}
            </div>
        </Modal>
    );
};