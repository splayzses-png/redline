import React, { useEffect, useState } from 'react';
import { redlineStore } from '../../services/store';
import type { Announcement } from '../../types';
import { Megaphone, AlertCircle, Info } from 'lucide-react';

export const AnnouncementBanner: React.FC = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);

  useEffect(() => {
    const update = () => setAnnouncements(redlineStore.getAnnouncements());
    update();
    return redlineStore.subscribe(update);
  }, []);

  if (announcements.length === 0) return null;

  const current = announcements[0];

  return (
    <div className="bg-gradient-to-r from-rose-950/80 via-zinc-900 to-rose-950/80 border-b border-rose-500/30 text-zinc-100 px-4 py-2 text-xs flex items-center justify-between gap-3 shadow-inner">
      <div className="flex items-center gap-2 max-w-5xl mx-auto overflow-hidden">
        {current.type === 'warning' ? (
          <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
        ) : current.type === 'urgent' ? (
          <Megaphone className="w-4 h-4 text-rose-400 shrink-0 animate-bounce" />
        ) : (
          <Info className="w-4 h-4 text-rose-400 shrink-0" />
        )}
        <div className="truncate">
          <span className="font-bold text-rose-400 mr-2 tracking-wide uppercase">
            {current.title}:
          </span>
          <span className="text-zinc-300 font-medium">{current.content}</span>
        </div>
      </div>
    </div>
  );
};
