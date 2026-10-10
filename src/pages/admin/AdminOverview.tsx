import React, { useState, useEffect } from 'react';
import { redlineStore } from '../../services/store';
import { useAuth } from '../../context/AuthContext';
import type { Tournament, Booking, SupportTicket, PrizeRecord, AuditLog } from '../../types';
import { StatusBadge } from '../../components/common/StatusBadge';
import {
  Trophy,
  Users,
  KeyRound,
  LifeBuoy,
  Wallet,
  Clock,
  ArrowRight,
  ShieldCheck,
  CheckCircle,
  AlertTriangle,
} from 'lucide-react';

interface AdminOverviewProps {
  onSelectTab: (tab: string) => void;
}

export const AdminOverview: React.FC<AdminOverviewProps> = ({ onSelectTab }) => {
  const { currentUser } = useAuth();
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [prizes, setPrizes] = useState<PrizeRecord[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);

  useEffect(() => {
    const update = () => {
      setTournaments(redlineStore.getTournaments());
      setBookings(redlineStore.getBookings());
      setTickets(redlineStore.getTickets());
      setPrizes(redlineStore.getPrizes());
      setAuditLogs(redlineStore.getAuditLogs());
    };
    update();
    return redlineStore.subscribe(update);
  }, []);

  const openTickets = tickets.filter((t) => t.status === 'open' || t.status === 'in_progress');
  const pendingPrizes = prizes.filter((p) => p.status === 'pending_review' || p.status === 'approved');
  const activeTourneys = tournaments.filter(
    (t) => t.status === 'registration_open' || t.status === 'check_in' || t.status === 'live'
  );

  return (
    <div className="space-y-8">
      {/* METRIC TILES */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          onClick={() => onSelectTab('tournaments')}
          className="bg-zinc-900/90 border border-zinc-800 p-5 rounded-2xl space-y-2 cursor-pointer hover:border-zinc-700 transition"
        >
          <div className="flex items-center justify-between text-rose-500">
            <Trophy className="w-5 h-5" />
            <span className="text-[10px] font-bold uppercase bg-rose-950/60 text-rose-400 px-2 py-0.5 rounded">
              Active
            </span>
          </div>
          <span className="font-['Teko'] text-4xl font-bold text-white block">
            {activeTourneys.length} / {tournaments.length}
          </span>
          <span className="text-xs text-zinc-400 font-medium">Tournaments Running</span>
        </div>

        <div
          onClick={() => onSelectTab('bookings')}
          className="bg-zinc-900/90 border border-zinc-800 p-5 rounded-2xl space-y-2 cursor-pointer hover:border-zinc-700 transition"
        >
          <div className="flex items-center justify-between text-emerald-400">
            <Users className="w-5 h-5" />
            <span className="text-[10px] font-bold uppercase bg-emerald-950/60 text-emerald-400 px-2 py-0.5 rounded">
              Total
            </span>
          </div>
          <span className="font-['Teko'] text-4xl font-bold text-white block">
            {bookings.length}
          </span>
          <span className="text-xs text-zinc-400 font-medium">Player Slot Bookings</span>
        </div>

        <div
          onClick={() => onSelectTab('support')}
          className="bg-zinc-900/90 border border-zinc-800 p-5 rounded-2xl space-y-2 cursor-pointer hover:border-zinc-700 transition"
        >
          <div className="flex items-center justify-between text-amber-400">
            <LifeBuoy className="w-5 h-5" />
            <span className="text-[10px] font-bold uppercase bg-amber-950/60 text-amber-400 px-2 py-0.5 rounded">
              Queue
            </span>
          </div>
          <span className="font-['Teko'] text-4xl font-bold text-white block">
            {openTickets.length}
          </span>
          <span className="text-xs text-zinc-400 font-medium">Open Support & Disputes</span>
        </div>

        <div
          onClick={() => onSelectTab('prizes')}
          className="bg-zinc-900/90 border border-zinc-800 p-5 rounded-2xl space-y-2 cursor-pointer hover:border-zinc-700 transition"
        >
          <div className="flex items-center justify-between text-sky-400">
            <Wallet className="w-5 h-5" />
            <span className="text-[10px] font-bold uppercase bg-sky-950/60 text-sky-400 px-2 py-0.5 rounded">
              Ledger
            </span>
          </div>
          <span className="font-['Teko'] text-4xl font-bold text-white block">
            {pendingPrizes.length}
          </span>
          <span className="text-xs text-zinc-400 font-medium">Pending Settlements</span>
        </div>
      </div>

      {/* ACTIVE TOURNAMENT OPERATIONS DESK */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-['Teko'] text-2xl font-bold uppercase text-white tracking-wider">
            Active Scrims & Room Operations
          </h2>
          <button
            type="button"
            onClick={() => onSelectTab('tournaments')}
            className="text-xs font-bold text-rose-400 hover:underline uppercase"
          >
            Manage All Tournaments
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tournaments.slice(0, 4).map((t) => (
            <div
              key={t.id}
              className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-5 space-y-4 shadow-lg"
            >
              <div className="flex items-center justify-between">
                <StatusBadge status={t.status} size="sm" />
                <span className="text-xs font-mono font-bold text-zinc-400">
                  {t.map} • {t.gameMode.toUpperCase()}
                </span>
              </div>

              <div>
                <h3 className="font-['Teko'] text-2xl font-bold text-white uppercase truncate">
                  {t.title}
                </h3>
                <p className="text-xs text-zinc-400">
                  {t.confirmedSlots} / {t.totalSlots} Slots Confirmed • Prize: ₹{t.prizePoolInr}
                </p>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-zinc-800 text-xs">
                <span className="flex items-center gap-1.5 font-semibold">
                  {t.roomCredentialsReleased ? (
                    <span className="text-emerald-400 flex items-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5" /> Room Released
                    </span>
                  ) : (
                    <span className="text-amber-400 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> Room Confidential
                    </span>
                  )}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onSelectTab('room')}
                    className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-bold uppercase text-[11px]"
                  >
                    Room Pass
                  </button>
                  <button
                    type="button"
                    onClick={() => onSelectTab('results')}
                    className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold uppercase text-[11px]"
                  >
                    Scoring
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* RECENT OPERATIONAL AUDIT LOG */}
      <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="p-4 bg-zinc-950 border-b border-zinc-800 flex items-center justify-between">
          <h3 className="font-['Teko'] text-xl font-bold uppercase text-white tracking-wider">
            Operational Audit Trail (Recent Actions)
          </h3>
          <button
            type="button"
            onClick={() => onSelectTab('audit-log')}
            className="text-xs text-rose-400 hover:underline uppercase font-bold"
          >
            Full Audit Log
          </button>
        </div>

        <div className="divide-y divide-zinc-800/80 text-xs">
          {auditLogs.slice(0, 5).map((log) => (
            <div
              key={log.id}
              className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-zinc-850 transition"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-rose-400 font-mono text-[11px]">
                    {log.action}
                  </span>
                  <span className="text-zinc-500">•</span>
                  <span className="text-zinc-300 font-semibold">{log.actorDisplayName}</span>
                  <span className="text-[10px] uppercase bg-zinc-800 text-zinc-400 px-1 rounded">
                    {log.actorRole}
                  </span>
                </div>
                <p className="text-zinc-400 text-[11px]">{log.details}</p>
              </div>

              <span className="text-[10px] text-zinc-500 font-mono shrink-0">
                {new Date(log.timestamp).toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
