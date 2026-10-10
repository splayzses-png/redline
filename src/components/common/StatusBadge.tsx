import React from 'react';
import type { TournamentStatus, BookingStatus, PrizeSettlementStatus } from '../../types';

interface StatusBadgeProps {
  status: TournamentStatus | BookingStatus | PrizeSettlementStatus | string;
  size?: 'sm' | 'md' | 'lg';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'sm' }) => {
  const getBadgeConfig = () => {
    switch (status) {
      // Tournament statuses
      case 'registration_open':
        return { label: 'REGISTRATION OPEN', bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' };
      case 'check_in':
        return { label: 'CHECK-IN OPEN', bg: 'bg-amber-500/15 text-amber-400 border-amber-500/40 animate-pulse' };
      case 'live':
        return { label: 'MATCH LIVE', bg: 'bg-rose-500/20 text-rose-400 border-rose-500/40 font-bold' };
      case 'provisional_results':
        return { label: 'PROVISIONAL SCORES', bg: 'bg-sky-500/15 text-sky-400 border-sky-500/30' };
      case 'finalized':
        return { label: 'FINALIZED', bg: 'bg-indigo-500/15 text-indigo-400 border-indigo-500/30' };
      case 'registration_closed':
        return { label: 'REGISTRATION CLOSED', bg: 'bg-zinc-800 text-zinc-400 border-zinc-700' };
      case 'published':
        return { label: 'UPCOMING', bg: 'bg-blue-500/10 text-blue-400 border-blue-500/30' };
      case 'draft':
        return { label: 'DRAFT (STAFF ONLY)', bg: 'bg-zinc-800/80 text-zinc-400 border-dashed border-zinc-600' };
      case 'cancelled':
        return { label: 'CANCELLED', bg: 'bg-red-950/40 text-red-400 border-red-800/40' };

      // Booking statuses
      case 'reserved':
        return { label: 'HELD (5M)', bg: 'bg-amber-500/20 text-amber-300 border-amber-500/50' };
      case 'confirmed':
        return { label: 'CONFIRMED', bg: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' };
      case 'checked_in':
        return { label: 'CHECKED IN', bg: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40' };
      case 'completed':
        return { label: 'COMPLETED', bg: 'bg-zinc-800 text-zinc-400 border-zinc-700' };

      // Prize statuses
      case 'settled':
        return { label: 'PAID / SETTLED', bg: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40' };
      case 'approved':
        return { label: 'APPROVED', bg: 'bg-sky-500/20 text-sky-400 border-sky-500/40' };
      case 'pending_review':
        return { label: 'PENDING AUDIT', bg: 'bg-amber-500/20 text-amber-400 border-amber-500/40' };

      default:
        return { label: status.toUpperCase().replace('_', ' '), bg: 'bg-zinc-800 text-zinc-300 border-zinc-700' };
    }
  };

  const { label, bg } = getBadgeConfig();
  const sizeClasses =
    size === 'sm'
      ? 'px-2 py-0.5 text-xs'
      : size === 'md'
      ? 'px-2.5 py-1 text-xs'
      : 'px-3 py-1.5 text-sm';

  return (
    <span
      className={`inline-flex items-center tracking-wider font-semibold uppercase rounded border ${sizeClasses} ${bg}`}
    >
      {label}
    </span>
  );
};
