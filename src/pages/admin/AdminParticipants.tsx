import React, { useState, useEffect } from 'react';
import { redlineStore } from '../../services/store';
import { useAuth } from '../../context/AuthContext';
import type { Tournament, Booking } from '../../types';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Users, CheckCircle, XCircle, Search, ShieldCheck } from 'lucide-react';

export const AdminParticipants: React.FC = () => {
  const { currentUser } = useAuth();
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [selectedTourneyId, setSelectedTourneyId] = useState<string>('');
  const [bookings, setBookings] = useState<Booking[]>([]);

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
    if (selectedTourneyId) {
      const allB = redlineStore.getBookings();
      setBookings(allB.filter((b) => b.tournamentId === selectedTourneyId));
    }
  }, [selectedTourneyId]);

  const toggleCheckIn = (b: Booking) => {
    if (!currentUser) return;
    if (b.status === 'checked_in') {
      b.status = 'confirmed';
    } else {
      b.status = 'checked_in';
      b.checkedInAt = new Date().toISOString();
    }
    redlineStore.saveTournament(redlineStore.getTournament(b.tournamentId)!, currentUser);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-4">
        <div>
          <h2 className="font-['Teko'] text-3xl font-bold uppercase text-white tracking-wider">
            Participant Roster Desk
          </h2>
          <p className="text-zinc-400 text-xs">
            Verify player Free Fire UIDs, conduct matchday roll-calls, and toggle participant check-ins.
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

      <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-950 border-b border-zinc-800 text-[10px] font-bold uppercase tracking-wider text-zinc-400">
              <tr>
                <th className="py-3.5 px-4">Slot</th>
                <th className="py-3.5 px-4">Player IGN</th>
                <th className="py-3.5 px-4">Free Fire UID</th>
                <th className="py-3.5 px-4">Clan / Team</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Check-in Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/80 font-medium">
              {bookings.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-zinc-500 text-xs">
                    No participants registered for this event yet.
                  </td>
                </tr>
              ) : (
                bookings.map((b) => (
                  <tr key={b.id} className="hover:bg-zinc-850 transition">
                    <td className="py-3 px-4 font-mono font-bold text-rose-400">
                      #{b.slotNumber.toString().padStart(2, '0')}
                    </td>
                    <td className="py-3 px-4 font-bold text-zinc-100">{b.playerIgn}</td>
                    <td className="py-3 px-4 font-mono text-zinc-300">{b.playerUid}</td>
                    <td className="py-3 px-4 text-zinc-400">{b.teamName || 'Solo Squad'}</td>
                    <td className="py-3 px-4">
                      <StatusBadge status={b.status} size="sm" />
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => toggleCheckIn(b)}
                        className={`px-3 py-1 rounded-lg text-[11px] font-bold uppercase transition ${
                          b.status === 'checked_in'
                            ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-500/40'
                            : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200'
                        }`}
                      >
                        {b.status === 'checked_in' ? 'Checked In ✓' : 'Mark Present'}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
