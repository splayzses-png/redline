import React, { useState, useEffect } from 'react';
import { redlineStore } from '../../services/store';
import { useAuth } from '../../context/AuthContext';
import type { SupportTicket, TicketStatus } from '../../types';
import { LifeBuoy, Send, CheckCircle, Clock, AlertCircle } from 'lucide-react';

export const AdminSupport: React.FC = () => {
  const { currentUser } = useAuth();
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');

  useEffect(() => {
    const update = () => {
      const all = redlineStore.getTickets();
      setTickets(all);
      if (all.length > 0 && !selectedTicketId) {
        setSelectedTicketId(all[0].id);
      }
    };
    update();
    return redlineStore.subscribe(update);
  }, [selectedTicketId]);

  if (!currentUser) return null;

  const selectedTicket = tickets.find((t) => t.id === selectedTicketId);

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicket || !replyText.trim()) return;

    redlineStore.replyTicket(selectedTicket.id, currentUser, replyText.trim());
    setReplyText('');
  };

  const handleStatusChange = (status: TicketStatus) => {
    if (!selectedTicket) return;
    selectedTicket.status = status;
    redlineStore.replyTicket(selectedTicket.id, currentUser, `[Status updated to ${status.toUpperCase()}]`);
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-zinc-800 pb-4">
        <h2 className="font-['Teko'] text-3xl font-bold uppercase text-white tracking-wider">
          Support & Dispute Resolution Desk
        </h2>
        <p className="text-zinc-400 text-xs">
          Manage match scoring disputes, slot inquiries, and communicate directly with participants.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* TICKETS LIST */}
        <div className="md:col-span-1 space-y-3">
          <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 block">
            Queue ({tickets.length} Tickets)
          </span>

          <div className="space-y-2">
            {tickets.map((t) => {
              const isSelected = selectedTicketId === t.id;

              return (
                <div
                  key={t.id}
                  onClick={() => setSelectedTicketId(t.id)}
                  className={`p-4 rounded-xl border transition cursor-pointer text-xs space-y-1.5 ${
                    isSelected
                      ? 'bg-zinc-850 border-rose-500 shadow-lg shadow-rose-950/20'
                      : 'bg-zinc-900/80 border-zinc-800 hover:border-zinc-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-zinc-300 truncate">{t.userDisplayName}</span>
                    <span
                      className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded ${
                        t.status === 'resolved'
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : t.status === 'in_progress'
                          ? 'bg-sky-500/20 text-sky-400'
                          : 'bg-amber-500/20 text-amber-400'
                      }`}
                    >
                      {t.status.replace('_', ' ')}
                    </span>
                  </div>
                  <h4 className="font-bold text-white truncate">{t.subject}</h4>
                  <span className="text-[10px] text-zinc-500 block">
                    Category: {t.category.replace('_', ' ')}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* THREAD VIEW */}
        <div className="md:col-span-2 bg-zinc-900/90 border border-zinc-800 rounded-2xl flex flex-col h-[520px] overflow-hidden">
          {selectedTicket ? (
            <>
              <div className="p-4 bg-zinc-950 border-b border-zinc-800 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-sm text-zinc-100">{selectedTicket.subject}</h3>
                  <span className="text-[10px] text-zinc-500">
                    Player: {selectedTicket.userDisplayName} • ID: {selectedTicket.id}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={selectedTicket.status}
                    onChange={(e) => handleStatusChange(e.target.value as TicketStatus)}
                    className="bg-zinc-900 border border-zinc-700 rounded-lg px-2.5 py-1 text-xs font-bold uppercase text-zinc-200"
                  >
                    <option value="open">Open</option>
                    <option value="in_progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>
              </div>

              <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs">
                {selectedTicket.messages.map((m) => {
                  const isStaff = m.senderRole !== 'player';

                  return (
                    <div
                      key={m.id}
                      className={`flex flex-col ${isStaff ? 'items-end' : 'items-start'}`}
                    >
                      <div className="flex items-center gap-1.5 text-[10px] text-zinc-500 mb-1">
                        <span className="font-bold text-zinc-300">{m.senderName}</span>
                        {isStaff && (
                          <span className="bg-rose-950/80 text-rose-400 px-1 rounded uppercase font-bold text-[9px] border border-rose-800/40">
                            Staff
                          </span>
                        )}
                        <span>• {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      <div
                        className={`max-w-md p-3 rounded-2xl ${
                          isStaff
                            ? 'bg-rose-600 text-white rounded-tr-none'
                            : 'bg-zinc-800 text-zinc-200 rounded-tl-none border border-zinc-700/60'
                        }`}
                      >
                        {m.message}
                      </div>
                    </div>
                  );
                })}
              </div>

              <form onSubmit={handleSendReply} className="p-3 bg-zinc-950 border-t border-zinc-800 flex gap-2">
                <input
                  type="text"
                  placeholder="Reply as moderator..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-rose-500"
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs uppercase flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Reply</span>
                </button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-xs text-zinc-500">
              Select a ticket to view messages
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
