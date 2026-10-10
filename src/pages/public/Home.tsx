import React, { useEffect, useState } from 'react';
import { redlineStore } from '../../services/store';
import type { Tournament } from '../../types';
import { StatusBadge } from '../../components/common/StatusBadge';
import {
  Flame,
  Trophy,
  Users,
  MapPin,
  Calendar,
  ShieldCheck,
  ChevronRight,
  Crosshair,
  Award,
  Zap,
} from 'lucide-react';

interface HomeProps {
  onNavigate: (path: string) => void;
}

export const Home: React.FC<HomeProps> = ({ onNavigate }) => {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);

  useEffect(() => {
    const update = () => {
      const all = redlineStore.getTournaments();
      // Show non-draft tournaments on home
      setTournaments(all.filter((t) => t.status !== 'draft'));
    };
    update();
    return redlineStore.subscribe(update);
  }, []);

  const openTournaments = tournaments.filter(
    (t) => t.status === 'registration_open' || t.status === 'check_in' || t.status === 'live'
  );

  return (
    <div className="space-y-16 pb-16">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#13080c] via-[#0a0b0e] to-[#0a0b0e] pt-12 pb-20 border-b border-zinc-800/80">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(225,29,72,0.25),rgba(255,255,255,0))] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs font-bold tracking-wide uppercase shadow-lg shadow-rose-950/40">
              <Flame className="w-4 h-4 text-rose-500 animate-pulse" />
              <span>Free Fire Competitive India • Free Launch Season</span>
            </div>

            <h1 className="font-['Teko'] text-5xl sm:text-7xl lg:text-8xl font-bold tracking-wide text-white uppercase leading-[0.9]">
              LOCK YOUR SLOT. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 via-red-500 to-amber-500">
                DOMINATE THE LOBBY.
              </span>
            </h1>

            <p className="text-zinc-300 text-base sm:text-lg leading-relaxed max-w-2xl font-normal">
              High-tier daily Free Fire Battle Royale & Clash Squad scrims. Guaranteed mobile-only lobbies, instant slot locks, custom room passwords, and verified leaderboards.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                type="button"
                onClick={() => onNavigate('/tournaments')}
                className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-rose-600 to-red-700 hover:from-rose-500 hover:to-red-600 text-white font-bold text-sm tracking-wide uppercase shadow-xl shadow-rose-900/40 transition flex items-center gap-2 group cursor-pointer"
              >
                <span>Join Free Scrims</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                type="button"
                onClick={() => onNavigate('/results')}
                className="px-5 py-3.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-700 font-bold text-sm tracking-wide uppercase transition flex items-center gap-2 cursor-pointer"
              >
                <Trophy className="w-4 h-4 text-amber-400" />
                <span>View Leaderboards</span>
              </button>
            </div>

            {/* QUICK STATS */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-zinc-800/80 max-w-lg">
              <div>
                <span className="block font-['Teko'] text-3xl font-bold text-white tracking-wider">
                  ₹0
                </span>
                <span className="text-xs text-zinc-400 font-medium uppercase">Entry Fee (Always Free)</span>
              </div>
              <div>
                <span className="block font-['Teko'] text-3xl font-bold text-rose-500 tracking-wider">
                  100%
                </span>
                <span className="text-xs text-zinc-400 font-medium uppercase">Mobile Only</span>
              </div>
              <div>
                <span className="block font-['Teko'] text-3xl font-bold text-emerald-400 tracking-wider">
                  INSTANT
                </span>
                <span className="text-xs text-zinc-400 font-medium uppercase">Slot Reservation</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED / UPCOMING TOURNAMENTS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-zinc-800 pb-4">
          <div>
            <div className="flex items-center gap-2 text-rose-500 text-xs font-bold uppercase tracking-wider">
              <Crosshair className="w-4 h-4" />
              <span>Competitive Schedule</span>
            </div>
            <h2 className="font-['Teko'] text-3xl sm:text-4xl font-bold tracking-wide text-white uppercase">
              Featured Scrims & Tournaments
            </h2>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('/tournaments')}
            className="text-xs font-bold text-rose-400 hover:text-rose-300 uppercase tracking-wider flex items-center gap-1"
          >
            <span>View All Tournaments ({tournaments.length})</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {openTournaments.map((t) => {
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
                className="group bg-gradient-to-b from-zinc-900 to-zinc-950 border border-zinc-800 hover:border-rose-500/60 rounded-xl overflow-hidden shadow-lg transition-all cursor-pointer flex flex-col justify-between"
              >
                {/* Banner / Header */}
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
                  <div className="absolute top-3 right-3 bg-zinc-950/80 backdrop-blur-md border border-zinc-700/60 px-2 py-0.5 rounded text-[11px] font-mono font-bold text-emerald-400">
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

                {/* Body Details */}
                <div className="p-4 space-y-4 flex-1 flex flex-col justify-between">
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-zinc-950/60 p-2 rounded border border-zinc-800/80 flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-zinc-400" />
                      <span className="truncate text-zinc-200">{dateStr}</span>
                    </div>
                    <div className="bg-zinc-950/60 p-2 rounded border border-zinc-800/80 flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-rose-500" />
                      <span className="truncate text-zinc-200">Map: {t.map}</span>
                    </div>
                  </div>

                  {/* Slot progress */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-zinc-400 flex items-center gap-1 font-medium">
                        <Users className="w-3 h-3" />
                        Slots Filled
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

                  {/* Prize pool & action */}
                  <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-zinc-500 font-bold uppercase block">Prize Reward</span>
                      <span className="font-['Teko'] text-xl font-bold text-amber-400">
                        ₹{t.prizePoolInr} INR
                      </span>
                    </div>

                    <button
                      type="button"
                      className="px-3 py-1.5 rounded-lg bg-rose-600 group-hover:bg-rose-500 text-white text-xs font-bold uppercase tracking-wider transition"
                    >
                      {t.status === 'registration_open' ? 'Pick Slot' : 'View Pass'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="bg-zinc-950 border-y border-zinc-800/80 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-rose-500 font-bold uppercase tracking-widest text-xs">Seamless Process</span>
            <h2 className="font-['Teko'] text-4xl sm:text-5xl font-bold text-white uppercase tracking-wide">
              How To Play In 4 Steps
            </h2>
            <p className="text-zinc-400 text-sm">
              Participating in REDLINE competitive Free Fire scrims is frictionless, free, and fully verified.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-zinc-900/60 border border-zinc-800 p-5 rounded-xl space-y-3 relative">
              <div className="w-9 h-9 rounded-lg bg-rose-600/20 text-rose-500 flex items-center justify-center font-bold font-mono text-sm border border-rose-500/30">
                01
              </div>
              <h3 className="text-base font-bold text-zinc-100">Set Up Profile</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Add your 8-10 digit Free Fire numeric UID and In-Game Name (IGN) so our system can verify your player identity.
              </p>
            </div>

            <div className="bg-zinc-900/60 border border-zinc-800 p-5 rounded-xl space-y-3 relative">
              <div className="w-9 h-9 rounded-lg bg-rose-600/20 text-rose-500 flex items-center justify-center font-bold font-mono text-sm border border-rose-500/30">
                02
              </div>
              <h3 className="text-base font-bold text-zinc-100">Reserve Your Slot</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Choose your squad slot from the live slot grid. Our reservation lock holds your slot for 5 minutes during confirmation.
              </p>
            </div>

            <div className="bg-zinc-900/60 border border-zinc-800 p-5 rounded-xl space-y-3 relative">
              <div className="w-9 h-9 rounded-lg bg-rose-600/20 text-rose-500 flex items-center justify-center font-bold font-mono text-sm border border-rose-500/30">
                03
              </div>
              <h3 className="text-base font-bold text-zinc-100">Check-In & Room ID</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Check-in 15 minutes before match start. Access confidential Room ID & Password securely on your booking pass.
              </p>
            </div>

            <div className="bg-zinc-900/60 border border-zinc-800 p-5 rounded-xl space-y-3 relative">
              <div className="w-9 h-9 rounded-lg bg-rose-600/20 text-rose-500 flex items-center justify-center font-bold font-mono text-sm border border-rose-500/30">
                04
              </div>
              <h3 className="text-base font-bold text-zinc-100">Compete & Claim</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Drop onto the map, score kills and Booyahs. Results are audited by hosts and published on the official leaderboard.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAIR PLAY PILLARS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-rose-950/40 via-zinc-900 to-zinc-900 border border-rose-900/30 rounded-2xl p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-xl">
            <div className="inline-flex items-center gap-1.5 text-rose-400 text-xs font-bold uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4" />
              <span>Fair Play Guarantee</span>
            </div>
            <h2 className="font-['Teko'] text-3xl sm:text-4xl font-bold text-white uppercase tracking-wide">
              Strict Anti-Cheat & Mobile Discipline
            </h2>
            <p className="text-zinc-400 text-sm leading-relaxed">
              We uphold standard esports competitive integrity. PC emulators, third-party recoil hacks, teaming, or macro abuse will lead to an immediate ban and blacklist of your Free Fire UID.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <button
              type="button"
              onClick={() => onNavigate('/rules')}
              className="px-5 py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs uppercase tracking-wider transition"
            >
              Read Rulebook
            </button>
            <button
              type="button"
              onClick={() => onNavigate('/tournaments')}
              className="px-5 py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs uppercase tracking-wider transition"
            >
              Enter Next Scrim
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
