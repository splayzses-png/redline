import React, { useState, useEffect } from 'react';
import { redlineStore } from '../../services/store';
import { useAuth } from '../../context/AuthContext';
import type { Tournament, ResultEntry, TournamentResult } from '../../types';
import { Award, Plus, Trash2, CheckCircle, Clock, ShieldCheck, AlertTriangle } from 'lucide-react';

export const AdminResults: React.FC = () => {
  const { currentUser } = useAuth();
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [selectedTourneyId, setSelectedTourneyId] = useState<string>('');
  const [entries, setEntries] = useState<ResultEntry[]>([]);
  const [isProvisional, setIsProvisional] = useState(true);
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
    if (selectedTourneyId) {
      const existing = redlineStore.getTournamentResult(selectedTourneyId);
      if (existing) {
        setEntries(existing.entries);
        setIsProvisional(existing.isProvisional);
      } else {
        // Populate from confirmed bookings
        const tourney = redlineStore.getTournament(selectedTourneyId);
        const tourneyBookings = redlineStore
          .getBookings()
          .filter(
            (b) =>
              b.tournamentId === selectedTourneyId &&
              (b.status === 'confirmed' || b.status === 'checked_in')
          );

        const initialEntries: ResultEntry[] = tourneyBookings.map((b, idx) => {
          const rank = idx + 1;
          const placementPts = tourney?.scoringRules?.placementPoints?.[rank] || 0;
          const prizeBreakdown = tourney?.prizeBreakdown?.find((p) => p.rank === rank);

          return {
            rank,
            teamOrPlayerName: b.teamName || b.playerIgn,
            freeFireUid: b.playerUid,
            kills: 0,
            killPoints: 0,
            placementPoints: placementPts,
            deductions: 0,
            totalPoints: placementPts,
            prizeWonInr: prizeBreakdown ? prizeBreakdown.amountInr : 0,
          };
        });

        if (initialEntries.length === 0) {
          // Fallback demo rows if no bookings yet
          initialEntries.push({
            rank: 1,
            teamOrPlayerName: 'TEAM VORTEX',
            freeFireUid: '9482716352',
            kills: 12,
            killPoints: 12,
            placementPoints: 12,
            deductions: 0,
            totalPoints: 24,
            prizeWonInr: tourney?.prizeBreakdown?.[0]?.amountInr || 300,
          });
        }

        setEntries(initialEntries);
        setIsProvisional(true);
      }
    }
  }, [selectedTourneyId]);

  if (!currentUser) return null;

  const currentTourney = tournaments.find((t) => t.id === selectedTourneyId);

  const handleUpdateEntry = (index: number, field: keyof ResultEntry, value: any) => {
    const updated = [...entries];
    updated[index] = { ...updated[index], [field]: value };

    // Auto-calculate points
    const kills = Number(updated[index].kills) || 0;
    const killMultiplier = currentTourney?.scoringRules?.killPoints || 1;
    const killPoints = kills * killMultiplier;
    const placePoints = Number(updated[index].placementPoints) || 0;
    const deductions = Number(updated[index].deductions) || 0;
    const totalPoints = Math.max(0, killPoints + placePoints - deductions);

    updated[index].killPoints = killPoints;
    updated[index].totalPoints = totalPoints;

    setEntries(updated);
  };

  const handleSaveResults = (provisional: boolean) => {
    setMsg(null);
    if (entries.length === 0) {
      setMsg({ type: 'err', text: 'At least one result entry is required.' });
      return;
    }

    // Sort by totalPoints descending and reassign rank
    const sorted = [...entries].sort((a, b) => b.totalPoints - a.totalPoints);
    sorted.forEach((item, idx) => {
      item.rank = idx + 1;
      const prizeMatch = currentTourney?.prizeBreakdown?.find((p) => p.rank === item.rank);
      if (prizeMatch) {
        item.prizeWonInr = prizeMatch.amountInr;
      }
    });

    const res = redlineStore.saveTournamentResults(
      selectedTourneyId,
      sorted,
      provisional,
      currentUser
    );

    if (res.success) {
      setIsProvisional(provisional);
      setEntries(sorted);
      setMsg({
        type: 'ok',
        text: provisional
          ? 'Provisional standings published! Participants can view scores and file disputes.'
          : 'Match results FINALIZED! Prize distribution records added to ledger.',
      });
    } else {
      setMsg({ type: 'err', text: res.error || 'Failed to save results.' });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-4">
        <div>
          <h2 className="font-['Teko'] text-3xl font-bold uppercase text-white tracking-wider">
            Results & Scoring Desk
          </h2>
          <p className="text-zinc-400 text-xs">
            Enter placement points, kill frags, and penalties. Scores auto-calculate total standings and map to prize allocations.
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

      {/* RESULTS EDITOR TABLE */}
      <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-950 border-b border-zinc-800 text-[10px] font-bold uppercase tracking-wider text-zinc-400">
              <tr>
                <th className="py-3.5 px-4 w-16 text-center">Rank</th>
                <th className="py-3.5 px-4">Squad / IGN</th>
                <th className="py-3.5 px-4">Free Fire UID</th>
                <th className="py-3.5 px-4 w-24 text-center">Kills</th>
                <th className="py-3.5 px-4 w-24 text-center">Place Pts</th>
                <th className="py-3.5 px-4 w-24 text-center">Deduction</th>
                <th className="py-3.5 px-4 w-24 text-center font-bold text-white">Total Pts</th>
                <th className="py-3.5 px-4 w-28 text-right">Prize (INR)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/80 font-medium">
              {entries.map((entry, idx) => (
                <tr key={idx} className="hover:bg-zinc-850 transition">
                  <td className="py-3 px-4 font-mono font-bold text-center text-zinc-400">
                    #{entry.rank}
                  </td>
                  <td className="py-3 px-4">
                    <input
                      type="text"
                      value={entry.teamOrPlayerName}
                      onChange={(e) => handleUpdateEntry(idx, 'teamOrPlayerName', e.target.value)}
                      className="w-full px-2 py-1 bg-zinc-950 border border-zinc-800 rounded text-zinc-100 font-bold"
                    />
                  </td>
                  <td className="py-3 px-4 font-mono">
                    <input
                      type="text"
                      value={entry.freeFireUid}
                      onChange={(e) => handleUpdateEntry(idx, 'freeFireUid', e.target.value)}
                      className="w-full px-2 py-1 bg-zinc-950 border border-zinc-800 rounded text-zinc-300 font-mono text-xs"
                    />
                  </td>
                  <td className="py-3 px-4 text-center">
                    <input
                      type="number"
                      min={0}
                      value={entry.kills}
                      onChange={(e) => handleUpdateEntry(idx, 'kills', Number(e.target.value))}
                      className="w-16 px-2 py-1 bg-zinc-950 border border-zinc-800 rounded text-center text-rose-400 font-bold font-mono"
                    />
                  </td>
                  <td className="py-3 px-4 text-center">
                    <input
                      type="number"
                      min={0}
                      value={entry.placementPoints}
                      onChange={(e) => handleUpdateEntry(idx, 'placementPoints', Number(e.target.value))}
                      className="w-16 px-2 py-1 bg-zinc-950 border border-zinc-800 rounded text-center text-zinc-200 font-mono"
                    />
                  </td>
                  <td className="py-3 px-4 text-center">
                    <input
                      type="number"
                      min={0}
                      value={entry.deductions}
                      onChange={(e) => handleUpdateEntry(idx, 'deductions', Number(e.target.value))}
                      className="w-16 px-2 py-1 bg-zinc-950 border border-zinc-800 rounded text-center text-red-400 font-mono"
                    />
                  </td>
                  <td className="py-3 px-4 text-center font-mono font-extrabold text-sm text-emerald-400">
                    {entry.totalPoints}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <input
                      type="number"
                      min={0}
                      value={entry.prizeWonInr || 0}
                      onChange={(e) => handleUpdateEntry(idx, 'prizeWonInr', Number(e.target.value))}
                      className="w-20 px-2 py-1 bg-zinc-950 border border-zinc-800 rounded text-right text-amber-400 font-bold font-mono"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* BOTTOM ACTION BAR */}
        <div className="p-4 bg-zinc-950 border-t border-zinc-800 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs">
            <span className="text-zinc-400">Current Status:</span>
            <span
              className={`font-bold uppercase font-mono px-2 py-0.5 rounded text-[10px] ${
                isProvisional
                  ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                  : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
              }`}
            >
              {isProvisional ? 'Provisional Draft' : 'Finalized & Verified'}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => handleSaveResults(true)}
              className="px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-bold text-xs uppercase transition flex items-center gap-1.5"
            >
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>Publish Provisional Standings</span>
            </button>
            <button
              type="button"
              onClick={() => handleSaveResults(false)}
              className="px-5 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs uppercase transition shadow-lg shadow-rose-900/40 flex items-center gap-1.5 cursor-pointer"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Finalize & Record Prizes</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
