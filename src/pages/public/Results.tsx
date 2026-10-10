import React, { useState, useEffect } from 'react';
import { redlineStore } from '../../services/store';
import type { Tournament, TournamentResult } from '../../types';
import { Trophy, Award, Crosshair, ShieldCheck, Clock, AlertCircle } from 'lucide-react';

export const Results: React.FC = () => {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [selectedTourneyId, setSelectedTourneyId] = useState<string>('');
  const [result, setResult] = useState<TournamentResult | null>(null);

  useEffect(() => {
    const update = () => {
      const all = redlineStore.getTournaments();
      // Tournaments with provisional or finalized results
      const withResults = all.filter(
        (t) => t.status === 'finalized' || t.status === 'provisional_results'
      );
      setTournaments(withResults);

      if (withResults.length > 0 && !selectedTourneyId) {
        setSelectedTourneyId(withResults[0].id);
      }
    };
    update();
    return redlineStore.subscribe(update);
  }, [selectedTourneyId]);

  useEffect(() => {
    if (selectedTourneyId) {
      const res = redlineStore.getTournamentResult(selectedTourneyId);
      setResult(res || null);
    }
  }, [selectedTourneyId]);

  const activeTourney = tournaments.find((t) => t.id === selectedTourneyId);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* HEADER */}
      <div className="border-b border-zinc-800 pb-6 space-y-2">
        <div className="flex items-center gap-2 text-rose-500 text-xs font-bold uppercase tracking-wider">
          <Award className="w-4 h-4" />
          <span>Official Esports Standings</span>
        </div>
        <h1 className="font-['Teko'] text-4xl sm:text-5xl font-bold tracking-wide text-white uppercase">
          Results & Leaderboards
        </h1>
        <p className="text-zinc-400 text-sm max-w-2xl">
          Verified match standings, total points, kill frags, and prize distribution. Results are audited by the REDLINE referee team before finalization.
        </p>
      </div>

      {/* TOURNAMENT SELECTOR */}
      {tournaments.length === 0 ? (
        <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-12 text-center space-y-3">
          <Trophy className="w-10 h-10 text-zinc-600 mx-auto" />
          <h3 className="text-base font-bold text-zinc-200">No Finalized Results Yet</h3>
          <p className="text-xs text-zinc-400">
            Tournaments currently in progress will publish standings here once matches conclude.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-zinc-900/70 border border-zinc-800 p-4 rounded-xl">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-zinc-400 uppercase">Select Match:</span>
              <select
                value={selectedTourneyId}
                onChange={(e) => setSelectedTourneyId(e.target.value)}
                className="bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-1.5 text-xs font-bold text-white uppercase focus:outline-none focus:border-rose-500"
              >
                {tournaments.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.title} ({t.map} • {t.gameMode.toUpperCase()})
                  </option>
                ))}
              </select>
            </div>

            {result && (
              <div className="flex items-center gap-2">
                {result.isProvisional ? (
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">
                    <Clock className="w-3.5 h-3.5" />
                    Provisional Standings (Dispute Period Active)
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Verified & Finalized
                  </span>
                )}
              </div>
            )}
          </div>

          {/* ACTIVE TOURNAMENT DETAILS */}
          {activeTourney && (
            <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-5 flex flex-wrap items-center justify-between gap-4 text-xs">
              <div>
                <span className="text-[10px] text-rose-500 font-bold uppercase tracking-wider block">
                  Match Title
                </span>
                <span className="font-['Teko'] text-2xl font-bold text-white tracking-wide">
                  {activeTourney.title}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block">
                  Map & Mode
                </span>
                <span className="font-semibold text-zinc-200">
                  {activeTourney.map} • {activeTourney.gameMode.toUpperCase()}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block">
                  Prize Pool
                </span>
                <span className="font-semibold text-amber-400">
                  ₹{activeTourney.prizePoolInr} INR
                </span>
              </div>
            </div>
          )}

          {/* LEADERBOARD TABLE */}
          {result && result.entries && result.entries.length > 0 ? (
            <div className="bg-zinc-900/80 border border-zinc-800 rounded-xl overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-zinc-950 border-b border-zinc-800 text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                    <tr>
                      <th className="py-3.5 px-4 text-center w-16">Rank</th>
                      <th className="py-3.5 px-4">Squad / Player IGN</th>
                      <th className="py-3.5 px-4">Free Fire UID</th>
                      <th className="py-3.5 px-4 text-center">Kills</th>
                      <th className="py-3.5 px-4 text-center">Kill Pts</th>
                      <th className="py-3.5 px-4 text-center">Place Pts</th>
                      <th className="py-3.5 px-4 text-center">Penalties</th>
                      <th className="py-3.5 px-4 text-center font-bold text-white">Total Pts</th>
                      <th className="py-3.5 px-4 text-right">Prize Won</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/60 font-medium">
                    {result.entries.map((entry) => {
                      const isBooyah = entry.rank === 1;
                      const isPodium = entry.rank <= 3;

                      let rankBadge = (
                        <span className="font-mono font-bold text-zinc-400">#{entry.rank}</span>
                      );
                      if (entry.rank === 1) {
                        rankBadge = (
                          <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/50 font-bold font-mono text-xs">
                            🥇 1
                          </span>
                        );
                      } else if (entry.rank === 2) {
                        rankBadge = (
                          <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-slate-300/20 text-slate-200 border border-slate-300/50 font-bold font-mono text-xs">
                            🥈 2
                          </span>
                        );
                      } else if (entry.rank === 3) {
                        rankBadge = (
                          <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-amber-700/20 text-amber-500 border border-amber-700/50 font-bold font-mono text-xs">
                            🥉 3
                          </span>
                        );
                      }

                      return (
                        <tr
                          key={entry.rank}
                          className={`hover:bg-zinc-800/40 transition ${
                            isBooyah ? 'bg-amber-950/10' : ''
                          }`}
                        >
                          <td className="py-3 px-4 text-center">{rankBadge}</td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <span
                                className={`font-bold ${
                                  isBooyah ? 'text-amber-300' : 'text-zinc-100'
                                }`}
                              >
                                {entry.teamOrPlayerName}
                              </span>
                              {isBooyah && (
                                <span className="text-[10px] font-extrabold uppercase bg-amber-500/20 text-amber-400 px-1.5 py-0.5 rounded border border-amber-500/40">
                                  BOOYAH
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="py-3 px-4 font-mono text-zinc-400">
                            {entry.freeFireUid}
                          </td>
                          <td className="py-3 px-4 text-center font-mono text-rose-400 font-bold">
                            {entry.kills}
                          </td>
                          <td className="py-3 px-4 text-center font-mono text-zinc-300">
                            {entry.killPoints}
                          </td>
                          <td className="py-3 px-4 text-center font-mono text-zinc-300">
                            {entry.placementPoints}
                          </td>
                          <td className="py-3 px-4 text-center font-mono text-red-400">
                            {entry.deductions > 0 ? `-${entry.deductions}` : '0'}
                          </td>
                          <td className="py-3 px-4 text-center font-mono font-extrabold text-sm text-emerald-400">
                            {entry.totalPoints}
                          </td>
                          <td className="py-3 px-4 text-right">
                            {entry.prizeWonInr && entry.prizeWonInr > 0 ? (
                              <span className="font-['Teko'] text-lg font-bold text-amber-400">
                                ₹{entry.prizeWonInr}
                              </span>
                            ) : (
                              <span className="text-zinc-600">—</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-8 text-center text-xs text-zinc-400">
              Standings data is being audited by the match referee. Check back shortly.
            </div>
          )}
        </div>
      )}
    </div>
  );
};
