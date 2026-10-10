import React, { useState, useEffect } from 'react';
import { redlineStore } from '../../services/store';
import { useAuth } from '../../context/AuthContext';
import type { Booking, BookingStatus } from '../../types';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Calendar, Search, Trash2 } from 'lucide-react';

export const AdminBookings: React.FC = () => {
  const { currentUser } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const update = () => setBookings(redlineStore.getBookings());
    update();
    return redlineStore.subscribe(update);
  }, []);

  if (!currentUser) return null;

  const filtered = bookings.filter(
    (b) =>
      b.tournamentTitle.toLowerCase().includes(search.toLowerCase()) ||
      b.playerIgn.toLowerCase().includes(search.toLowerCase()) ||
      b.playerUid.includes(search)
  );

  const handleStatusChange = (b: Booking, newStatus: BookingStatus) => {
    b.status = newStatus;
    redlineStore.saveTournament(redlineStore.getTournament(b.tournamentId)!, currentUser);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-4">
        <div>
          <h2 className="font-['Teko'] text-3xl font-bold uppercase text-white tracking-wider">
            Global Bookings Directory
          </h2>
          <p className="text-zinc-400 text-xs">
            Review all player slot reservations, hold timestamps, and match check-in statuses across all tournaments.
          </p>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search IGN or FF UID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-zinc-200 focus:outline-none focus:border-rose-500"
          />
        </div>
      </div>

      <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-950 border-b border-zinc-800 text-[10px] font-bold uppercase tracking-wider text-zinc-400">
              <tr>
                <th className="py-3.5 px-4">Booking Ref</th>
                <th className="py-3.5 px-4">Tournament</th>
                <th className="py-3.5 px-4 text-center">Slot</th>
                <th className="py-3.5 px-4">Player IGN & UID</th>
                <th className="py-3.5 px-4">Reserved At</th>
                <th className="py-3.5 px-4 text-right">Status Override</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/80 font-medium">
              {filtered.map((b) => (
                <tr key={b.id} className="hover:bg-zinc-850 transition">
                  <td className="py-3 px-4 font-mono text-zinc-400">{b.id}</td>
                  <td className="py-3 px-4 font-bold text-zinc-100">{b.tournamentTitle}</td>
                  <td className="py-3 px-4 text-center font-mono font-bold text-rose-400">
                    #{b.slotNumber.toString().padStart(2, '0')}
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-bold text-zinc-200 block">{b.playerIgn}</span>
                    <span className="text-[10px] font-mono text-zinc-500">UID: {b.playerUid}</span>
                  </td>
                  <td className="py-3 px-4 text-zinc-400 font-mono text-[11px]">
                    {new Date(b.reservedAt).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <select
                      value={b.status}
                      onChange={(e) => handleStatusChange(b, e.target.value as BookingStatus)}
                      className="bg-zinc-950 border border-zinc-800 rounded-lg px-2.5 py-1 text-[11px] font-bold uppercase text-zinc-300 focus:outline-none focus:border-rose-500"
                    >
                      <option value="reserved">Reserved</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="checked_in">Checked In</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                      <option value="waitlisted">Waitlisted</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
