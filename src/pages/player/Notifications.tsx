import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { redlineStore } from '../../services/store';
import type { InAppNotification } from '../../types';
import { Bell, Check, KeyRound, Calendar, Trophy, Info, ChevronRight } from 'lucide-react';

interface NotificationsProps {
  onNavigate: (path: string) => void;
}

export const Notifications: React.FC<NotificationsProps> = ({ onNavigate }) => {
  const { currentUser } = useAuth();
  const [notifications, setNotifications] = useState<InAppNotification[]>([]);

  useEffect(() => {
    if (!currentUser) return;
    const update = () => {
      setNotifications(redlineStore.getNotifications(currentUser.uid));
    };
    update();
    return redlineStore.subscribe(update);
  }, [currentUser]);

  if (!currentUser) return null;

  const handleMarkAllRead = () => {
    redlineStore.markAllNotificationsAsRead(currentUser.uid);
  };

  const handleNotificationClick = (n: InAppNotification) => {
    redlineStore.markNotificationAsRead(n.id);
    if (n.link) {
      onNavigate(n.link);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-6">
        <div>
          <h1 className="font-['Teko'] text-4xl sm:text-5xl font-bold uppercase text-white tracking-wide">
            Notification Center
          </h1>
          <p className="text-zinc-400 text-xs">
            Real-time match room releases, booking confirmations, and tournament announcements.
          </p>
        </div>

        {notifications.some((n) => !n.read) && (
          <button
            type="button"
            onClick={handleMarkAllRead}
            className="px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-bold uppercase transition flex items-center gap-1.5 self-start sm:self-auto"
          >
            <Check className="w-3.5 h-3.5 text-emerald-400" />
            <span>Mark All Read</span>
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-12 text-center text-xs text-zinc-400 space-y-3">
          <Bell className="w-8 h-8 text-zinc-600 mx-auto" />
          <p>No notifications yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((n) => {
            const timeStr = new Date(n.createdAt).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
              day: 'numeric',
              month: 'short',
            });

            return (
              <div
                key={n.id}
                onClick={() => handleNotificationClick(n)}
                className={`p-4 rounded-xl border transition cursor-pointer flex items-start justify-between gap-4 ${
                  n.read
                    ? 'bg-zinc-900/50 border-zinc-800/80 hover:bg-zinc-850'
                    : 'bg-zinc-900 border-rose-500/40 shadow-lg shadow-rose-950/20 hover:border-rose-500'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`p-2 rounded-lg shrink-0 mt-0.5 ${
                      n.type === 'room_released'
                        ? 'bg-rose-500/20 text-rose-400'
                        : n.type === 'prize_settled'
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : 'bg-zinc-800 text-zinc-300'
                    }`}
                  >
                    {n.type === 'room_released' ? (
                      <KeyRound className="w-4 h-4" />
                    ) : n.type === 'prize_settled' ? (
                      <Trophy className="w-4 h-4" />
                    ) : (
                      <Info className="w-4 h-4" />
                    )}
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4
                        className={`text-sm font-bold ${
                          n.read ? 'text-zinc-300' : 'text-white'
                        }`}
                      >
                        {n.title}
                      </h4>
                      {!n.read && (
                        <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                      )}
                    </div>
                    <p className="text-xs text-zinc-400 leading-relaxed">{n.message}</p>
                    <span className="text-[10px] text-zinc-600 font-mono block">{timeStr}</span>
                  </div>
                </div>

                {n.link && (
                  <ChevronRight className="w-4 h-4 text-zinc-500 shrink-0 self-center" />
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
