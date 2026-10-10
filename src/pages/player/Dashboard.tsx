import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { redlineStore } from '../../services/store';
import type { Booking, Tournament } from '../../types';
import { StatusBadge } from '../../components/common/StatusBadge';
import {
  User,
  Hash,
  Crosshair,
  Trophy,
  Calendar,
  ChevronRight,
  ShieldCheck,
  Flame,
  Clock,
  KeyRound,
  Users,
} from 'lucide-react';

interface DashboardProps {
  onNavigate: (path: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const { currentUser } = useAuth();
  const [userBookings, setUserBookings] = useState<Booking[]>([]);
  const [upcomingTournament, setUpcomingTournament] = useState<Tournament | null>(null);

  useEffect(() => {
    if (!currentUser) return;
    const update = () => {
      const bks = redlineStore.getBookings(currentUser.uid);
      setUserBookings(bks);

      // Find active upcoming booking
      const active = bks.find(
        (b) => b.status === 'confirmed' || b.status === 'checked_in' || b.status === 'reserved'
      );
      if (active) {
        const t = redlineStore.getTournament(active.tournamentId);
        setUpcomingTournament(t || null);
      }
    };
    update();
    return redlineStore.subscribe(update);
  }, [currentUser]);

  if (!currentUser) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h3 className="text-lg font-bold text-white">Sign In Required</h3>
        <button
          type="button"
          onClick={() => onNavigate('/login')}
          className="px-6 py-2.5 rounded-lg bg-rose-600 text-white font-bold text-xs uppercase"
        >
          Sign In
        </button>
      </div>
    );
  }

  const activeBookings = userBookings.filter(
    (b) => b.status === 'confirmed' || b.status === 'checked_in' || b.status === 'reserved'
  );
  const prizes = redlineStore.getPrizes(currentUser.uid);
  const totalWon = prizes
    .filter((p) => p.status === 'settled')
    .reduce((sum, p) => sum + p.amountInr, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* PLAYER PASSPORT BANNER */}
      <div className="bg-gradient-to-r from-zinc-900 via-zinc-900 to-rose-950/40 border border-zinc-800 rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-rose-600 to-red-800 flex items-center justify-center text-white font-['Teko'] text-3xl font-bold shadow-lg shadow-rose-900/30">
            {currentUser.displayName.charAt(0).toUpperCase()}
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="font-['Teko'] text-3xl sm:text-4xl font-bold text-white uppercase tracking-wide leading-none">
                {currentUser.displayName}
              </h1>
              <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-zinc-800 text-rose-400 border border-zinc-700">
                {currentUser.role}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-400">
              <span className="flex items-center gap-1 font-mono text-zinc-300">
                <Hash className="w-3.5 h-3.5 text-rose-500" />
                UID: {currentUser.freeFireUid || 'Not set'}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 font-semibold text-zinc-300">
                <Crosshair className="w-3.5 h-3.5 text-amber-400" />
                IGN: {currentUser.freeFireIgn || 'Not set'}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => onNavigate('/dashboard/profile')}
            className="px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-bold uppercase transition"
          >
            Edit Profile
          </button>
          <button
            type="button"
            onClick={() => onNavigate('/tournaments')}
            className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold uppercase tracking-wider transition shadow-lg shadow-rose-900/40"
          >
            Join New Scrim
          </button>
        </div>
      </div>

      {/* QUICK STATS CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-zinc-900/80 border border-zinc-800 p-4 rounded-xl space-y-1">
          <span className="text-[10px] font-bold uppercase text-zinc-500">Active Bookings</span>
          <span className="font-['Teko'] text-3xl font-bold text-white block">
            {activeBookings.length}
          </span>
          <span className="text-[11px] text-zinc-400">Scheduled matches</span>
        </div>

        <div className="bg-zinc-900/80 border border-zinc-800 p-4 rounded-xl space-y-1">
          <span className="text-[10px] font-bold uppercase text-zinc-500">Settled Rewards</span>
          <span className="font-['Teko'] text-3xl font-bold text-amber-400 block">
            ₹{totalWon} INR
          </span>
          <span className="text-[11px] text-zinc-400">Total verified payouts</span>
        </div>

        <div className="bg-zinc-900/80 border border-zinc-800 p-4 rounded-xl space-y-1">
          <span className="text-[10px] font-bold uppercase text-zinc-500">Total Played</span>
          <span className="font-['Teko'] text-3xl font-bold text-emerald-400 block">
            {userBookings.length}
          </span>
          <span className="text-[11px] text-zinc-400">Career tournament entries</span>
        </div>

        <div className="bg-zinc-900/80 border border-zinc-800 p-4 rounded-xl space-y-1">
          <span className="text-[10px] font-bold uppercase text-zinc-500">Referral Code</span>
          <span className="font-['Teko'] text-2xl font-bold text-rose-400 block truncate">
            {currentUser.referralCode}
          </span>
          <button
            onClick={() => onNavigate('/dashboard/referrals')}
            className="text-[11px] text-zinc-400 hover:text-white underline"
          >
            Share & invite squads
          </button>
        </div>
      </div>

      {/* UPCOMING MATCH HIGHLIGHT */}
      {upcomingTournament && (
        <div className="bg-zinc-900 border-2 border-rose-500/40 rounded-2xl p-6 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-800 pb-3">
            <div className="flex items-center gap-2 text-rose-400 text-xs font-bold uppercase tracking-wider">
              <Clock className="w-4 h-4 animate-spin" />
              <span>Next Confirmed Match</span>
            </div>
            <StatusBadge status={upcomingTournament.status} />
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h3 className="font-['Teko'] text-2xl sm:text-3xl font-bold text-white uppercase tracking-wide">
                {upcomingTournament.title}
              </h3>
              <p className="text-xs text-zinc-400">
                {upcomingTournament.map} • {upcomingTournament.gameMode.toUpperCase()} • Check-in window opens {upcomingTournament.checkInWindowMinutes}m prior
              </p>
            </div>

            <button
              type="button"
              onClick={() => onNavigate(`/tournaments/${upcomingTournament.slug}`)}
              className="px-5 py-2.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs uppercase tracking-wider transition flex items-center gap-1.5 self-start sm:self-auto"
            >
              <KeyRound className="w-4 h-4" />
              <span>View Match Pass & Room ID</span>
            </button>
          </div>
        </div>
      )}

      {/* RECENT BOOKINGS LIST */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-['Teko'] text-2xl font-bold uppercase text-white tracking-wider">
            My Tournament Bookings
          </h2>
          <button
            type="button"
            onClick={() => onNavigate('/dashboard/bookings')}
            className="text-xs font-bold text-rose-400 hover:underline uppercase"
          >
            View All ({userBookings.length})
          </button>
        </div>

        {userBookings.length === 0 ? (
          <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-8 text-center text-xs text-zinc-400 space-y-3">
            <Trophy className="w-8 h-8 text-zinc-600 mx-auto" />
            <p>You haven't reserved any tournament slots yet.</p>
            <button
              type="button"
              onClick={() => onNavigate('/tournaments')}
              className="px-4 py-2 rounded-lg bg-rose-600 text-white font-bold uppercase"
            >
              Browse Open Scrims
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {userBookings.slice(0, 4).map((b) => (
              <div
                key={b.id}
                onClick={() => onNavigate(`/dashboard/bookings/${b.id}`)}
                className="bg-zinc-900/80 border border-zinc-800 hover:border-zinc-700 p-4 rounded-xl flex items-center justify-between gap-4 cursor-pointer transition group"
              >
                <div className="space-y-1 truncate">
                  <div className="flex items-center gap-2">
                    <StatusBadge status={b.status} size="sm" />
                    <span className="font-mono text-xs font-bold text-rose-400">
                      Slot #{b.slotNumber.toString().padStart(2, '0')}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-zinc-100 truncate group-hover:text-rose-400 transition">
                    {b.tournamentTitle}
                  </h4>
                  <p className="text-[11px] text-zinc-500 font-mono">
                    Player: {b.playerIgn} (UID: {b.playerUid})
                  </p>
                </div>

                <ChevronRight className="w-4 h-4 text-zinc-500 group-hover:translate-x-1 transition-transform shrink-0" />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
