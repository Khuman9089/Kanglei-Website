// components/notifications/NotificationCenterModal.tsx - Notification Center Modal
import React from 'react';
import { Bell, X, Sparkles, Clock, Calendar, CheckCheck, Trash2, ExternalLink } from 'lucide-react';
import { AppNotification } from '../../types/admin';

interface NotificationCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: AppNotification[];
  onMarkAllRead: () => void;
  onClearAll: () => void;
}

export const NotificationCenterModal: React.FC<NotificationCenterModalProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAllRead,
  onClearAll,
}) => {
  if (!isOpen) return null;

  const getIcon = (type: AppNotification['type']) => {
    switch (type) {
      case 'festival':
        return <Sparkles className="w-4 h-4 text-purple-600" />;
      case 'muhurta':
        return <Clock className="w-4 h-4 text-amber-600" />;
      case 'panchang':
        return <Calendar className="w-4 h-4 text-orange-600" />;
      default:
        return <Bell className="w-4 h-4 text-indigo-600" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-900 to-indigo-950 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center">
              <Bell className="w-4 h-4 text-amber-400" />
            </div>
            <div>
              <h3 className="font-serif font-black text-base leading-tight">Notification Center</h3>
              <p className="text-[10px] text-slate-300 font-medium">Daily Panchang & Vedic Alerts</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Actions bar */}
        {notifications.length > 0 && (
          <div className="px-4 py-2 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs">
            <button
              onClick={onMarkAllRead}
              className="flex items-center gap-1 font-bold text-indigo-700 hover:text-indigo-900 cursor-pointer"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              <span>Mark all read</span>
            </button>
            <button
              onClick={onClearAll}
              className="flex items-center gap-1 font-bold text-rose-600 hover:text-rose-800 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear all</span>
            </button>
          </div>
        )}

        {/* Notifications list */}
        <div className="flex-1 overflow-y-auto p-4 divide-y divide-slate-100 space-y-2">
          {notifications.length === 0 ? (
            <div className="py-12 text-center text-slate-400 flex flex-col items-center">
              <Bell className="w-10 h-10 stroke-1 text-slate-300 mb-2" />
              <p className="text-xs font-semibold text-slate-600">No new notifications</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Daily Panchang and festival reminders will appear here.</p>
            </div>
          ) : (
            notifications.map((item) => (
              <div
                key={item.id}
                className={`p-3 rounded-2xl transition-all ${
                  item.read ? 'bg-slate-50/70 border border-slate-100' : 'bg-amber-50/60 border border-amber-200/80 shadow-2xs'
                }`}
              >
                <div className="flex items-start gap-2.5">
                  <div className="w-7 h-7 rounded-xl bg-white shadow-2xs border border-slate-200/70 flex items-center justify-center shrink-0 mt-0.5">
                    {getIcon(item.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <h4 className="text-xs font-extrabold text-slate-900 truncate">{item.title}</h4>
                      {!item.read && (
                        <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
                      )}
                    </div>
                    <p className="text-[11.5px] text-slate-600 font-medium leading-relaxed mt-1">
                      {item.message}
                    </p>
                    <div className="flex items-center justify-between mt-2 pt-1 border-t border-slate-200/40 text-[10px] text-slate-400 font-mono">
                      <span>{new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      {item.linkUrl && (
                        <a
                          href={item.linkUrl}
                          target={item.linkUrl.startsWith('http') ? '_blank' : '_self'}
                          rel="noopener noreferrer"
                          className="text-amber-800 font-bold flex items-center gap-1 hover:underline"
                        >
                          <span>Open</span>
                          <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
