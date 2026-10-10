import React, { useState, useEffect } from 'react';
import { redlineStore } from '../../services/store';
import { useAuth } from '../../context/AuthContext';
import type { Announcement } from '../../types';
import { Megaphone, Plus, CheckCircle, Trash2 } from 'lucide-react';

export const AdminAnnouncements: React.FC = () => {
  const { currentUser } = useAuth();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [type, setType] = useState<'info' | 'warning' | 'urgent'>('info');

  useEffect(() => {
    const update = () => setAnnouncements(redlineStore.getAnnouncements());
    update();
    return redlineStore.subscribe(update);
  }, []);

  if (!currentUser) return null;

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    const newAnn: Announcement = {
      id: `ann-${Date.now()}`,
      title: title.trim().toUpperCase(),
      content: content.trim(),
      type,
      active: true,
      createdAt: new Date().toISOString(),
    };

    redlineStore.saveAnnouncement(newAnn, currentUser);
    setTitle('');
    setContent('');
  };

  const handleToggle = (ann: Announcement) => {
    redlineStore.saveAnnouncement({ ...ann, active: !ann.active }, currentUser);
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-zinc-800 pb-4">
        <h2 className="font-['Teko'] text-3xl font-bold uppercase text-white tracking-wider">
          Site-Wide Announcements Desk
        </h2>
        <p className="text-zinc-400 text-xs">
          Publish immediate banner notices visible across the header for all site visitors and mobile users.
        </p>
      </div>

      <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-6 space-y-4">
        <h3 className="font-bold text-sm text-white uppercase">Publish New Banner Announcement</h3>

        <form onSubmit={handleCreate} className="space-y-3 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2 space-y-1">
              <label className="font-semibold text-zinc-300 uppercase block">Headline</label>
              <input
                type="text"
                required
                placeholder="e.g. MAINTENANCE OR SPECIAL SCRIM EVENT"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-200 focus:outline-none focus:border-rose-500 uppercase font-bold"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-zinc-300 uppercase block">Priority Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as any)}
                className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-200 focus:outline-none focus:border-rose-500 uppercase font-semibold"
              >
                <option value="info">Info (Standard)</option>
                <option value="warning">Warning (Fair Play)</option>
                <option value="urgent">Urgent (Room Alert)</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-zinc-300 uppercase block">Message Body</label>
            <input
              type="text"
              required
              placeholder="Detailed announcement copy..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-200 focus:outline-none focus:border-rose-500"
            />
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs uppercase"
            >
              Publish Banner
            </button>
          </div>
        </form>
      </div>

      <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="p-4 bg-zinc-950 border-b border-zinc-800 flex items-center justify-between text-xs">
          <span className="font-bold text-white uppercase">Active Announcements</span>
          <span className="text-zinc-500">{announcements.length} records</span>
        </div>

        <div className="divide-y divide-zinc-800/80 text-xs">
          {announcements.map((a) => (
            <div key={a.id} className="p-4 flex items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-rose-400 font-mono">{a.title}</span>
                  <span className="text-[10px] uppercase px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400 font-bold">
                    {a.type}
                  </span>
                </div>
                <p className="text-zinc-300">{a.content}</p>
              </div>

              <button
                type="button"
                onClick={() => handleToggle(a)}
                className={`px-3 py-1.5 rounded-lg text-[11px] font-bold uppercase transition ${
                  a.active ? 'bg-zinc-800 text-zinc-300' : 'bg-rose-600 text-white'
                }`}
              >
                {a.active ? 'Deactivate' : 'Activate'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
