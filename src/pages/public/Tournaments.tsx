import React, { useState, useEffect } from 'react';
import { redlineStore } from '../../services/store';
import type { Tournament, GameMode, TournamentStatus } from '../../types';
import { StatusBadge } from '../../components/common/StatusBadge';
import {
  Trophy,
  Search,
  Filter,
  Calendar,
  Users,
  MapPin,
  ChevronRight,
  Shield,
} from 'lucide-react';

interface TournamentsProps {
  onNavigate: (path: string) => void;
}

export const Tournaments: React.FC<TournamentsProps> = ({ onNavigate }) => {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMode, setSelectedMode] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedMap, setSelectedMap] = useState<string>('all');

  useEffect(() => {
    const update = () => {
      const all = redlineStore.getTournaments();
      setTournaments(all.filter((t) => t.status !== 'draft'));
    };
    update();
    return redlineStore.subscribe(update);
  }, []);

  const filtered = tournaments.filter((t) => {
    const matchesSearch = t.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesMode = selectedMode === 'all' || t.gameMode === selectedMode;
    const matchesStatus = selectedStatus === 'all' || t.status === selectedStatus;
    const matchesMap = selectedMap === 'all' || t.map === selectedMap;
    return matchesSearch && matchesMode && matchesStatus && matchesMap;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* HEADER */}
      <div className="space-y-2 border-b border-zinc-800 pb-6">
        <div className="flex items-center gap-2 text-rose-500 text-xs font-bold uppercase tracking-wider">
          <Trophy className="w-4 h-4" />
          <span>India Free Fire Scrims Hub</span>
        </div>
        <h1 className="font-['Teko'] text-4xl sm:text-5xl font-bold tracking-wide text-white uppercase">
          Tournament Directory
        </h1>
        <p className="text-zinc-400 text-sm max-w-2xl">
          Browse daily Free Fire tournaments and custom room scrims. Select your game mode and reserve your team slot before capacity fills up.
        </p>
      </div>

      {/* FILTER & SEARCH BAR */}
      <div className="bg-zinc-900/80 border border-zinc-800 rounded-xl p-4 space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search tournament title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-sm text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-rose-500 transition"
            />
          </div>

          {/* Mode filter */}
          <div className="flex items-center gap-2">
            <select
              value={selectedMode}
              onChange={(e) => setSelectedMode(e.target.value)}
              aria-label="Filter by Game Mode"
              className="bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs font-bold uppercase text-zinc-300 focus:outline-none focus:border-rose-500"
            >
              <option value="all">All Modes</option>
              <option value="squad">Squad</option>
              <option value="duo">Duo</option>
              <option value="solo">Solo</option>
              <option value="clash_squad">Clash Squad</option>
            </select>

            {/* Status filter */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              aria-label="Filter by Tournament Status"
              className="bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs font-bold uppercase text-zinc-300 focus:outline-none focus:border-rose-500"
            >
              <option value="all">All Statuses</option>
              <option value="registration_open">Registration Open</option>
              <option value="check_in">Check-in Open</option>
              <option value="live">Live Matches</option>
              <option value="finalized">Completed</option>
            </select>

            {/* Map filter */}
            <select
              value={selectedMap}
              onChange={(e) => setSelectedMap(e.target.value)}
              aria-label="Filter by Map"
              className="bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs font-bold uppercase text-zinc-300 focus:outline-none focus:border-rose-500"
            >
              <option value="all">All Maps</option>
              <option value="Bermuda">Bermuda</option>
              <option value="Purgatory">Purgatory</option>
              <option value="Kalahari">Kalahari</option>
              <option value="Alpine">Alpine</option>
              <option value="NexTerra">NexTerra</option>
            </select>
          </div>
        </div>

        {/* Quick Tags */}
        <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-400 pt-1">
          <span className="font-medium text-zinc-500 flex items-center gap-1">
            <Filter className="w-3 h-3" /> Quick Filter:
          </span>
          <button
            type="button"
            onClick={() => {
              setSelectedMode('all');
              setSelectedStatus('registration_open');
            }}
            className="px-2.5 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-semibold text-[11px] transition"
          >
            Open For Registration
          </button>
          <button
            type="button"
            onClick={() => {
              setSelectedMode('squad');
              setSelectedStatus('all');
            }}
            className="px-2.5 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-semibold text-[11px] transition"
          >
            Squad Scrims
          </button>
          <button
            type="button"
            onClick={() => {
              setSelectedMode('duo');
              setSelectedStatus('all');
            }}
            className="px-2.5 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-semibold text-[11px] transition"
          >
            Duo Battles
          </button>
          <button
            type="button"
            onClick={() => {
              setSelectedMode('all');
              setSelectedStatus('all');
              setSelectedMap('all');
              setSearchTerm('');
            }}
            className="text-rose-400 hover:underline text-[11px] ml-auto font-semibold"
          >
            Reset Filters
          </button>
        </div>
      </div>

      {/* TOURNAMENT GRID */}
      {filtered.length === 0 ? (
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-12 text-center space-y-3">
          <Shield className="w-10 h-10 text-zinc-600 mx-auto" />
          <h3 className="text-base font-bold text-zinc-200">No tournaments match your criteria</h3>
          <p className="text-xs text-zinc-400">
            Try adjusting your filters or search keyword to view active Free Fire scrims.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((t) => {
            const dateStr = new Date(t.startTime).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
              day: 'numeric',
              month: 'short',
            });
            const percentFilled = Math.min(100, Math.round((t.filledSlots / t.totalSlots) * 100));

            return (
              <div
                key={t.id}
                onClick={() => onNavigate(`/tournaments/${t.slug}`)}
                className="group bg-zinc-900/90 border border-zinc-800 hover:border-rose-500/60 rounded-xl overflow-hidden shadow-lg transition-all cursor-pointer flex flex-col justify-between"
              >
                <div className="relative h-44 overflow-hidden bg-zinc-950">
                  <img
                    src={t.bannerUrl}
                    alt={t.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-70"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />
                  <div className="absolute top-3 left-3">
                    <StatusBadge status={t.status} size="sm" />
                  </div>
                  <div className="absolute top-3 right-3 bg-zinc-950/80 border border-zinc-700/60 px-2 py-0.5 rounded text-[11px] font-mono font-bold text-emerald-400">
                    FREE ENTRY
                  </div>
                  <div className="absolute bottom-3 left-3 right-3">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-rose-400 block">
                      {t.gameMode} • {t.matchFormat.replace(/_/g, ' ')}
                    </span>
                    <h3 className="font-['Teko'] text-2xl font-bold text-white tracking-wide leading-tight truncate">
                      {t.title}
                    </h3>
                  </div>
                </div>

                <div className="p-4 space-y-4 flex-1 flex flex-col justify-between">
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-zinc-950/60 p-2 rounded border border-zinc-800/80 flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-zinc-400" />
                      <span className="truncate text-zinc-200">{dateStr}</span>
                    </div>
                    <div className="bg-zinc-950/60 p-2 rounded border border-zinc-800/80 flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-rose-500" />
                      <span className="truncate text-zinc-200">{t.map}</span>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-zinc-400 flex items-center gap-1 font-medium">
                        <Users className="w-3 h-3" />
                        Slots
                      </span>
                      <span className="font-mono font-bold text-zinc-200">
                        {t.filledSlots} / {t.totalSlots}
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-rose-600 to-amber-500 rounded-full transition-all"
                        style={{ width: `${percentFilled}%` }}
                      />
                    </div>
                  </div>

                  <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-zinc-500 font-bold uppercase block">Prize Reward</span>
                      <span className="font-['Teko'] text-xl font-bold text-amber-400">
                        ₹{t.prizePoolInr} INR
                      </span>
                    </div>

                    <button
                      type="button"
                      className="px-3.5 py-1.5 rounded-lg bg-rose-600 group-hover:bg-rose-500 text-white text-xs font-bold uppercase tracking-wider transition flex items-center gap-1"
                    >
                      <span>Details</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
