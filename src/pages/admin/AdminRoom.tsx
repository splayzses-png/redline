import React, { useState, useEffect } from 'react';
import { redlineStore } from '../../services/store';
import { useAuth } from '../../context/AuthContext';
import type { Tournament, TournamentRoom } from '../../types';
import { KeyRound, ShieldAlert, Sparkles, CheckCircle, AlertTriangle, Send } from 'lucide-react';

export const AdminRoom: React.FC = () => {
  const { currentUser } = useAuth();
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [selectedTourneyId, setSelectedTourneyId] = useState<string>('');
  const [roomId, setRoomId] = useState('');
  const [roomPassword, setRoomPassword] = useState('');
  const [instructions, setInstructions] = useState('');
  const [msg, setMsg] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);

  useEffect(() => {
    const update = () => {
      const all = redlineStore.getTournaments();
      setTournaments(all);
      if (all.length > 0 && !selectedTourneyId) {
        setSelectedTourneyId(all[0].id);
      }
    };
    update();
    return redlineStore.subscribe(update);
  }, [selectedTourneyId]);

  useEffect(() => {
    if (selectedTourneyId && currentUser) {
      const check = redlineStore.getRoomCredentials(selectedTourneyId, currentUser);
      if (check.room) {
        setRoomId(check.room.roomId);
        setRoomPassword(check.room.roomPassword);
        setInstructions(check.room.customInstructions || '');
      } else {
        setRoomId('');
        setRoomPassword('');
        setInstructions('Enter your assigned slot number inside custom room. Do not switch slots.');
      }
    }
  }, [selectedTourneyId, currentUser]);

  if (!currentUser) return null;

  const currentTourney = tournaments.find((t) => t.id === selectedTourneyId);

  const handleSaveAndRelease = (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(null);

    if (!roomId.trim() || !roomPassword.trim()) {
      setMsg({ type: 'err', text: 'Both Custom Room ID and Password are required.' });
      return;
    }

    const res = redlineStore.releaseRoomCredentials(
      selectedTourneyId,
      roomId.trim(),
      roomPassword.trim(),
      instructions.trim(),
      currentUser
    );

    if (res.success) {
      setMsg({
        type: 'ok',
        text: 'Credentials released! Confirmed participants can now view room details on their passes.',
      });
    } else {
      setMsg({ type: 'err', text: res.error || 'Failed to release credentials' });
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-4">
        <div>
          <h2 className="font-['Teko'] text-3xl font-bold uppercase text-white tracking-wider">
            Custom Room Credentials Desk
          </h2>
          <p className="text-zinc-400 text-xs">
            Securely provision Custom Room ID and Password. Credentials are strictly isolated from public queries.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase text-zinc-400">Tournament:</span>
          <select
            value={selectedTourneyId}
            onChange={(e) => setSelectedTourneyId(e.target.value)}
            className="bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-1.5 text-xs font-bold uppercase text-white focus:outline-none focus:border-rose-500"
          >
            {tournaments.map((t) => (
              <option key={t.id} value={t.id}>
                {t.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {msg && (
        <div
          className={`p-3.5 rounded-xl border text-xs flex items-center gap-2 ${
            msg.type === 'ok'
              ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
              : 'bg-red-950/40 border-red-500/40 text-red-300'
          }`}
        >
          {msg.type === 'ok' ? (
            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
          ) : (
            <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
          )}
          <span>{msg.text}</span>
        </div>
      )}

      {currentTourney && (
        <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
            <div className="space-y-1">
              <span className="text-[10px] text-zinc-500 font-bold uppercase block">Target Match</span>
              <h3 className="font-['Teko'] text-2xl font-bold text-white uppercase">
                {currentTourney.title}
              </h3>
            </div>

            <div className="text-right">
              <span className="text-[10px] text-zinc-500 uppercase font-bold block">Status</span>
              <span
                className={`text-xs font-bold uppercase font-mono ${
                  currentTourney.roomCredentialsReleased ? 'text-emerald-400' : 'text-amber-400'
                }`}
              >
                {currentTourney.roomCredentialsReleased ? '● RELEASED TO PLAYERS' : '○ CONFIDENTIAL / HELD'}
              </span>
            </div>
          </div>

          <form onSubmit={handleSaveAndRelease} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="font-semibold text-zinc-300 uppercase block">Custom Room ID</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 8492019"
                  value={roomId}
                  onChange={(e) => setRoomId(e.target.value)}
                  className="w-full px-3 py-2.5 bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-200 font-mono text-sm tracking-wider focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-zinc-300 uppercase block">Room Password</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. RL99"
                  value={roomPassword}
                  onChange={(e) => setRoomPassword(e.target.value)}
                  className="w-full px-3 py-2.5 bg-zinc-950 border border-zinc-800 rounded-lg text-rose-400 font-mono text-sm tracking-wider focus:outline-none focus:border-rose-500"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-zinc-300 uppercase block">Host Room Instructions</label>
              <textarea
                rows={3}
                placeholder="Instructions displayed to checked-in participants inside their pass..."
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-200 resize-none focus:outline-none focus:border-rose-500"
              />
            </div>

            <div className="p-3 bg-amber-950/20 border border-amber-800/40 rounded-xl text-amber-300 text-[11px] flex items-start gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span>
                Releasing credentials will instantly broadcast in-app notifications and make Room ID & Password visible on confirmed players' matchday passes.
              </span>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs uppercase tracking-wider transition shadow-lg shadow-rose-900/40 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>Save & Release Custom Room Pass</span>
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
