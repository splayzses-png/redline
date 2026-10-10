import React, { useState, useEffect } from 'react';
import { redlineStore } from '../../services/store';
import { useAuth } from '../../context/AuthContext';
import type { Tournament, GameMode, MatchFormat, GameMap, TournamentStatus } from '../../types';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Trophy, Plus, Edit, Trash2, Calendar, MapPin, Users, CheckCircle, AlertCircle } from 'lucide-react';

export const AdminTournaments: React.FC = () => {
  const { currentUser } = useAuth();
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [gameMode, setGameMode] = useState<GameMode>('squad');
  const [matchFormat, setMatchFormat] = useState<MatchFormat>('battle_royale');
  const [map, setMap] = useState<GameMap>('Bermuda');
  const [totalSlots, setTotalSlots] = useState(12);
  const [prizePoolInr, setPrizePoolInr] = useState(500);
  const [startTime, setStartTime] = useState('2026-10-11T19:00');
  const [rules, setRules] = useState('Mobile devices only. PC Emulators strictly forbidden.');

  useEffect(() => {
    const update = () => setTournaments(redlineStore.getTournaments());
    update();
    return redlineStore.subscribe(update);
  }, []);

  if (!currentUser) return null;

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    const newTourney: Tournament = {
      id: `tourney-${Date.now()}`,
      slug: `${slug}-${Math.floor(Math.random() * 1000)}`,
      title: title.trim(),
      bannerUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80',
      gameMode,
      matchFormat,
      map,
      status: 'registration_open',
      isFree: true,
      entryFeeInr: 0,
      prizePoolInr: Number(prizePoolInr),
      prizeBreakdown: [
        { rank: 1, label: '1st Place (Booyah)', amountInr: Math.round(Number(prizePoolInr) * 0.6) },
        { rank: 2, label: '2nd Place', amountInr: Math.round(Number(prizePoolInr) * 0.4) },
      ],
      totalSlots: Number(totalSlots),
      filledSlots: 0,
      confirmedSlots: 0,
      startTime: new Date(startTime).toISOString(),
      registrationDeadline: new Date(startTime).toISOString(),
      checkInWindowMinutes: 20,
      roomCredentialsReleased: false,
      rules,
      scoringRules: {
        killPoints: 1,
        placementPoints: { 1: 12, 2: 9, 3: 8, 4: 7, 5: 6, 6: 5, 7: 4, 8: 3, 9: 2, 10: 1, 11: 0, 12: 0 },
      },
      createdBy: currentUser.uid,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    redlineStore.saveTournament(newTourney, currentUser);
    setShowCreateModal(false);
    setTitle('');
    setSuccessMsg(`Tournament "${newTourney.title}" created successfully!`);
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  const handleStatusChange = (tourneyId: string, status: TournamentStatus) => {
    redlineStore.updateTournamentStatus(tourneyId, status, currentUser);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-4">
        <div>
          <h2 className="font-['Teko'] text-3xl font-bold uppercase text-white tracking-wider">
            Tournament Management Desk
          </h2>
          <p className="text-zinc-400 text-xs">
            Create scrim events, configure custom maps and slots, and manage tournament lifecycles.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowCreateModal(true)}
          className="px-5 py-2.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs uppercase tracking-wider transition shadow-lg shadow-rose-900/40 flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Create Tournament</span>
        </button>
      </div>

      {successMsg && (
        <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* TOURNAMENTS TABLE */}
      <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-950 border-b border-zinc-800 text-[10px] font-bold uppercase tracking-wider text-zinc-400">
              <tr>
                <th className="py-3.5 px-4">Title & Mode</th>
                <th className="py-3.5 px-4">Map</th>
                <th className="py-3.5 px-4">Slots</th>
                <th className="py-3.5 px-4">Prize</th>
                <th className="py-3.5 px-4">Status & Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/80 font-medium">
              {tournaments.map((t) => (
                <tr key={t.id} className="hover:bg-zinc-850 transition">
                  <td className="py-3 px-4">
                    <div className="space-y-0.5">
                      <span className="font-bold text-zinc-100 text-sm block">{t.title}</span>
                      <span className="text-[10px] uppercase font-mono text-rose-400">
                        {t.gameMode} • {t.matchFormat.replace(/_/g, ' ')}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-zinc-300 font-mono">{t.map}</td>
                  <td className="py-3 px-4 text-zinc-300 font-mono">
                    {t.confirmedSlots} / {t.totalSlots}
                  </td>
                  <td className="py-3 px-4 font-mono font-bold text-amber-400">
                    ₹{t.prizePoolInr}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <select
                        value={t.status}
                        onChange={(e) => handleStatusChange(t.id, e.target.value as TournamentStatus)}
                        className="bg-zinc-950 border border-zinc-800 rounded-lg px-2.5 py-1 text-[11px] font-bold uppercase text-zinc-200 focus:outline-none focus:border-rose-500"
                      >
                        <option value="draft">Draft</option>
                        <option value="published">Published</option>
                        <option value="registration_open">Registration Open</option>
                        <option value="registration_closed">Registration Closed</option>
                        <option value="check_in">Check-in Open</option>
                        <option value="live">Live Match</option>
                        <option value="provisional_results">Provisional Results</option>
                        <option value="finalized">Finalized</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE TOURNAMENT MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 max-w-lg w-full space-y-4 my-8">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="font-['Teko'] text-2xl font-bold uppercase text-white">
                Create New Tournament Event
              </h3>
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="text-zinc-500 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-zinc-300 uppercase block">Tournament Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. REDLINE Daily Squad Scrims #105"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-200 focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-zinc-300 uppercase block">Game Mode</label>
                  <select
                    value={gameMode}
                    onChange={(e) => setGameMode(e.target.value as GameMode)}
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-200 uppercase"
                  >
                    <option value="squad">Squad</option>
                    <option value="duo">Duo</option>
                    <option value="solo">Solo</option>
                    <option value="clash_squad">Clash Squad</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-zinc-300 uppercase block">Map</label>
                  <select
                    value={map}
                    onChange={(e) => setMap(e.target.value as GameMap)}
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-200"
                  >
                    <option value="Bermuda">Bermuda</option>
                    <option value="Purgatory">Purgatory</option>
                    <option value="Kalahari">Kalahari</option>
                    <option value="Alpine">Alpine</option>
                    <option value="NexTerra">NexTerra</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-zinc-300 uppercase block">Total Slots</label>
                  <input
                    type="number"
                    min={4}
                    max={48}
                    required
                    value={totalSlots}
                    onChange={(e) => setTotalSlots(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-200"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-zinc-300 uppercase block">Prize Pool (INR)</label>
                  <input
                    type="number"
                    min={0}
                    required
                    value={prizePoolInr}
                    onChange={(e) => setPrizePoolInr(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-200"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-zinc-300 uppercase block">Start Date & Time (IST)</label>
                <input
                  type="datetime-local"
                  required
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-200"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-zinc-300 uppercase block">Rules & Restrictions</label>
                <textarea
                  rows={3}
                  value={rules}
                  onChange={(e) => setRules(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-200 resize-none"
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
                  Publish Tournament
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
