import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { redlineStore } from '../../services/store';
import type { Booking } from '../../types';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Trophy, Calendar, ChevronRight, Hash, XCircle, KeyRound, AlertCircle } from 'lucide-react';

interface BookingsProps {
  onNavigate: (path: string) => void;
}

export const Bookings: React.FC<BookingsProps> = ({ onNavigate }) => {
  const { currentUser } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed' | 'cancelled'>('all');

  useEffect(() => {
    if (!currentUser) return;
    const update = () => {
      setBookings(redlineStore.getBookings(currentUser.uid));
    };
    update();
    return redlineStore.subscribe(update);
  }, [currentUser]);

  if (!currentUser) return null;

  const filtered = bookings.filter((b) => {
    if (filter === 'active') {
      return b.status === 'confirmed' || b.status === 'checked_in' || b.status === 'reserved';
    }
    if (filter === 'completed') return b.status === 'completed';
    if (filter === 'cancelled') return b.status === 'cancelled' || b.status === 'rejected';
    return true;
  });

  const handleCancel = (bookingId: string) => {
    if (window.confirm('Are you sure you want to cancel this slot registration?')) {
      redlineStore.cancelBooking(bookingId, currentUser);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-6">
        <div>
          <h1 className="font-['Teko'] text-4xl sm:text-5xl font-bold uppercase text-white tracking-wide">
            My Tournament Bookings
          </h1>
          <p className="text-zinc-400 text-xs">
            Review your slot passes, match check-in status, and custom room credentials.
          </p>
        </div>

        <button
          type="button"
          onClick={() => onNavigate('/tournaments')}
          className="px-5 py-2.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs uppercase tracking-wider transition shadow-lg shadow-rose-900/40"
        >
          Book Another Slot
        </button>
      </div>

      {/* FILTER TABS */}
      <div className="flex border-b border-zinc-800 gap-2">
        {(['all', 'active', 'completed', 'cancelled'] as const).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setFilter(tab)}
            className={`px-4 py-2 text-xs font-bold uppercase tracking-wider border-b-2 transition ${
              filter === tab
                ? 'border-rose-500 text-rose-400'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            {tab} ({
              bookings.filter((b) => {
                if (tab === 'active') {
                  return b.status === 'confirmed' || b.status === 'checked_in' || b.status === 'reserved';
                }
                if (tab === 'completed') return b.status === 'completed';
                if (tab === 'cancelled') return b.status === 'cancelled' || b.status === 'rejected';
                return true;
              }).length
            })
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-12 text-center text-xs text-zinc-400 space-y-3">
          <Trophy className="w-8 h-8 text-zinc-600 mx-auto" />
          <p>No bookings found under this filter.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((b) => {
            const timeStr = new Date(b.tournamentStartTime).toLocaleString([], {
              dateStyle: 'medium',
              timeStyle: 'short',
            });
            const canCancel = b.status === 'reserved' || b.status === 'confirmed';

            return (
              <div
                key={b.id}
                className="bg-zinc-900/80 border border-zinc-800 rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-zinc-700 transition"
              >
                <div className="space-y-2 truncate">
                  <div className="flex items-center gap-2">
                    <StatusBadge status={b.status} size="sm" />
                    <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-zinc-800 text-rose-400">
                      Slot #{b.slotNumber.toString().padStart(2, '0')}
                    </span>
                    <span className="text-[11px] text-zinc-500 font-mono">
                      Ref: {b.id}
                    </span>
                  </div>

                  <h3 className="font-['Teko'] text-2xl font-bold text-white uppercase tracking-wide truncate">
                    {b.tournamentTitle}
                  </h3>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-400">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-rose-500" />
                      {timeStr}
                    </span>
                    <span className="flex items-center gap-1.5 font-mono text-zinc-300">
                      <Hash className="w-3.5 h-3.5 text-zinc-500" />
                      IGN: {b.playerIgn} (UID: {b.playerUid})
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-zinc-800">
                  {canCancel && (
                    <button
                      type="button"
                      onClick={() => handleCancel(b.id)}
                      className="px-3 py-2 rounded-lg bg-zinc-950 hover:bg-zinc-800 text-zinc-400 hover:text-red-400 border border-zinc-800 text-xs font-semibold transition"
                      title="Cancel booking and free slot"
                    >
                      Cancel
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => onNavigate(`/dashboard/bookings/${b.id}`)}
                    className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs uppercase tracking-wider transition flex items-center gap-1.5"
                  >
                    <KeyRound className="w-3.5 h-3.5" />
                    <span>View Pass & Room</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
