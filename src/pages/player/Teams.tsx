import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { redlineStore } from '../../services/store';
import type { Team } from '../../types';
import { Users, Plus, Shield, Hash, ChevronRight, UserPlus, CheckCircle, AlertCircle } from 'lucide-react';

interface TeamsProps {
  onNavigate: (path: string) => void;
}

export const Teams: React.FC<TeamsProps> = ({ onNavigate }) => {
  const { currentUser } = useAuth();
  const [teams, setTeams] = useState<Team[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [name, setName] = useState('');
  const [tag, setTag] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!currentUser) return;
    const update = () => {
      setTeams(redlineStore.getTeams(currentUser.uid));
    };
    update();
    return redlineStore.subscribe(update);
  }, [currentUser]);

  if (!currentUser) return null;

  const handleCreateTeam = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!name.trim() || !tag.trim()) {
      setErrorMsg('Please enter both team name and squad tag.');
      return;
    }

    const created = redlineStore.createTeam(name.trim(), tag.trim(), currentUser);
    setShowCreateModal(false);
    setName('');
    setTag('');
    onNavigate(`/dashboard/teams/${created.id}`);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-6">
        <div>
          <h1 className="font-['Teko'] text-4xl sm:text-5xl font-bold uppercase text-white tracking-wide">
            Squad & Clan Rosters
          </h1>
          <p className="text-zinc-400 text-xs">
            Manage your Free Fire competitive team, invite teammates, and register squads for tournaments.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowCreateModal(true)}
          className="px-5 py-2.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs uppercase tracking-wider transition shadow-lg shadow-rose-900/40 flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Create Squad</span>
        </button>
      </div>

      {teams.length === 0 ? (
        <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-12 text-center text-xs text-zinc-400 space-y-4">
          <Users className="w-10 h-10 text-zinc-600 mx-auto" />
          <h3 className="text-base font-bold text-zinc-200">No Squad Registered Yet</h3>
          <p className="max-w-md mx-auto">
            Create your competitive Free Fire squad to easily lock 4-player team slots in daily scrims and Clash Squad knockouts.
          </p>
          <button
            type="button"
            onClick={() => setShowCreateModal(true)}
            className="px-5 py-2.5 rounded-lg bg-rose-600 text-white font-bold text-xs uppercase"
          >
            Create Your Clan
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {teams.map((t) => {
            const isCaptain = t.captainUid === currentUser.uid;

            return (
              <div
                key={t.id}
                onClick={() => onNavigate(`/dashboard/teams/${t.id}`)}
                className="bg-zinc-900/80 border border-zinc-800 hover:border-zinc-700 p-6 rounded-2xl space-y-4 cursor-pointer transition group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center font-mono font-bold text-rose-500 text-sm">
                      {t.tag}
                    </div>
                    <div>
                      <h3 className="font-['Teko'] text-2xl font-bold text-white uppercase group-hover:text-rose-400 transition">
                        {t.name}
                      </h3>
                      <span className="text-[10px] text-zinc-500 font-mono">
                        Captain: {t.captainIgn}
                      </span>
                    </div>
                  </div>

                  {isCaptain && (
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-rose-600/20 text-rose-400 border border-rose-500/30">
                      Captain
                    </span>
                  )}
                </div>

                <div className="pt-2 border-t border-zinc-800/80 space-y-2">
                  <span className="text-[11px] font-bold uppercase text-zinc-400 block">
                    Active Roster ({t.members.length}/6):
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {t.members.map((m) => (
                      <span
                        key={m.uid}
                        className="text-xs bg-zinc-950 border border-zinc-800 px-2.5 py-1 rounded-lg text-zinc-300 font-mono"
                      >
                        {m.freeFireIgn}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <span className="text-xs text-rose-400 font-bold uppercase flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    <span>Manage Roster</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* CREATE TEAM MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 max-w-md w-full space-y-5">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="font-['Teko'] text-2xl font-bold uppercase text-white">
                Create Free Fire Squad
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

            <form onSubmit={handleCreateTeam} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-semibold text-zinc-300 uppercase block">Squad Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. TEAM SOUL RED"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2.5 bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-zinc-300 uppercase block">Tag (2-5 Chars)</label>
                <input
                  type="text"
                  required
                  maxLength={5}
                  placeholder="e.g. SOUL"
                  value={tag}
                  onChange={(e) => setTag(e.target.value.toUpperCase())}
                  className="w-full px-3 py-2.5 bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-rose-500 font-mono"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2">
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
                  Create Squad
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
