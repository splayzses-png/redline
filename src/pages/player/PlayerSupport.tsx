import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { redlineStore } from '../../services/store';
import type { SupportTicket, TicketCategory } from '../../types';
import { LifeBuoy, Plus, MessageSquare, Send, CheckCircle, AlertCircle, ChevronRight, Clock } from 'lucide-react';

export const PlayerSupport: React.FC = () => {
  const { currentUser } = useAuth();
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [category, setCategory] = useState<TicketCategory>('match_dispute');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [replyText, setReplyText] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!currentUser) return;
    const update = () => {
      const userTicks = redlineStore.getTickets(currentUser.uid);
      setTickets(userTicks);
      if (userTicks.length > 0 && !selectedTicketId) {
        setSelectedTicketId(userTicks[0].id);
      }
    };
    update();
    return redlineStore.subscribe(update);
  }, [currentUser, selectedTicketId]);

  if (!currentUser) return null;

  const selectedTicket = tickets.find((t) => t.id === selectedTicketId);

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!subject.trim() || !message.trim()) {
      setErrorMsg('Please enter both subject and message details.');
      return;
    }

    const t = redlineStore.createTicket(currentUser, category, subject.trim(), message.trim());
    setShowCreateModal(false);
    setSubject('');
    setMessage('');
    setSelectedTicketId(t.id);
  };

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicket || !replyText.trim()) return;

    redlineStore.replyTicket(selectedTicket.id, currentUser, replyText.trim());
    setReplyText('');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-6">
        <div>
          <h1 className="font-['Teko'] text-4xl sm:text-5xl font-bold uppercase text-white tracking-wide">
            Support & Dispute Desk
          </h1>
          <p className="text-zinc-400 text-xs">
            Open inquiry or conflict tickets regarding slot reservations, room access, or match scoring.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowCreateModal(true)}
          className="px-5 py-2.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs uppercase tracking-wider transition shadow-lg shadow-rose-900/40 flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Ticket</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* TICKET LIST */}
        <div className="md:col-span-1 space-y-3">
          <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 block">
            My Tickets ({tickets.length})
          </span>

          {tickets.length === 0 ? (
            <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-8 text-center text-xs text-zinc-400">
              No tickets found. Need assistance? Click "New Ticket".
            </div>
          ) : (
            tickets.map((t) => {
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
                    <span className="font-mono text-[10px] text-zinc-500 uppercase">
                      {t.category.replace('_', ' ')}
                    </span>
                    <span
                      className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded ${
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

                  <h4 className="font-bold text-zinc-100 truncate">{t.subject}</h4>
                  <span className="text-[10px] text-zinc-600 block">
                    {new Date(t.createdAt).toLocaleDateString()}
                  </span>
                </div>
              );
            })
          )}
        </div>

        {/* CONVERSATION THREAD */}
        <div className="md:col-span-2 bg-zinc-900/90 border border-zinc-800 rounded-2xl flex flex-col h-[520px] overflow-hidden">
          {selectedTicket ? (
            <>
              {/* THREAD HEADER */}
              <div className="p-4 bg-zinc-950 border-b border-zinc-800 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-sm text-zinc-100 truncate">
                    {selectedTicket.subject}
                  </h3>
                  <div className="flex items-center gap-2 text-[10px] text-zinc-500">
                    <span>Category: {selectedTicket.category.replace('_', ' ')}</span>
                    {selectedTicket.assignedModerator && (
                      <span>• Assigned: {selectedTicket.assignedModerator}</span>
                    )}
                  </div>
                </div>
                <span
                  className={`text-xs font-bold uppercase px-2 py-0.5 rounded ${
                    selectedTicket.status === 'resolved'
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : 'bg-amber-500/20 text-amber-400'
                  }`}
                >
                  {selectedTicket.status}
                </span>
              </div>

              {/* MESSAGES SCROLL */}
              <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs">
                {selectedTicket.messages.map((m) => {
                  const isMine = m.senderId === currentUser.uid;

                  return (
                    <div
                      key={m.id}
                      className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}
                    >
                      <div className="flex items-center gap-1.5 text-[10px] text-zinc-500 mb-1">
                        <span className="font-bold text-zinc-400">{m.senderName}</span>
                        {m.senderRole !== 'player' && (
                          <span className="bg-rose-950/60 text-rose-400 px-1 rounded uppercase font-bold text-[9px] border border-rose-800/40">
                            {m.senderRole}
                          </span>
                        )}
                        <span>• {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      <div
                        className={`max-w-md p-3 rounded-2xl ${
                          isMine
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

              {/* REPLY INPUT */}
              <form
                onSubmit={handleSendReply}
                className="p-3 bg-zinc-950 border-t border-zinc-800 flex gap-2"
              >
                <input
                  type="text"
                  placeholder="Type your message or dispute inquiry..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-rose-500"
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs uppercase flex items-center gap-1.5 transition cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send</span>
                </button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-xs text-zinc-500">
              Select a ticket to view conversation details
            </div>
          )}
        </div>
      </div>

      {/* CREATE TICKET MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 max-w-md w-full space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="font-['Teko'] text-2xl font-bold uppercase text-white">
                Submit Support or Dispute Ticket
              </h3>
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="text-zinc-500 hover:text-white"
              >
                ✕
              </button>
            </div>

            {errorMsg && (
              <div className="p-3 bg-red-950/40 border border-red-500/40 rounded-xl text-red-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-400" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleCreateTicket} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-semibold text-zinc-300 uppercase block">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as TicketCategory)}
                  className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-200 text-xs focus:outline-none focus:border-rose-500"
                >
                  <option value="match_dispute">Match Score Dispute</option>
                  <option value="slot_issue">Slot Reservation Issue</option>
                  <option value="account_profile">Free Fire UID Verification</option>
                  <option value="prize_settlement">Prize Settlement Inquiry</option>
                  <option value="rule_violation">Report Hack / Emulator User</option>
                  <option value="other">General Question</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-zinc-300 uppercase block">Subject</label>
                <input
                  type="text"
                  required
                  placeholder="Brief summary of your inquiry..."
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-200 text-xs focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-zinc-300 uppercase block">
                  Detailed Explanation / Evidence Links
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Provide match details, screenshot link (Imgur/Drive), or tournament title..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-200 text-xs focus:outline-none focus:border-rose-500 resize-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-lg bg-zinc-800 text-zinc-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs uppercase"
                >
                  Submit Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
