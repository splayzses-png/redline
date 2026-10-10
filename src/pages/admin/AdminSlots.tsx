import React, { useState, useEffect } from 'react';
import { redlineStore } from '../../services/store';
import { useAuth } from '../../context/AuthContext';
import type { Tournament, TournamentSlot, UserProfile } from '../../types';
import { SlotMatrix } from '../../components/tournament/SlotMatrix';
import { Grid, Users, ShieldAlert, CheckCircle, AlertTriangle } from 'lucide-react';

export const AdminSlots: React.FC = () => {
  const { currentUser } = useAuth();
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [selectedTourneyId, setSelectedTourneyId] = useState<string>('');
  const [slots, setSlots] = useState<TournamentSlot[]>([]);
  const [assignSlotNum, setAssignSlotNum] = useState<number | null>(null);
  const [playerUidToAssign, setPlayerUidToAssign] = useState('');
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
      setSlots(redlineStore.getTournamentSlots(selectedTourneyId));
    }
  }, [selectedTourneyId]);

  if (!currentUser) return null;

  const currentTourney = tournaments.find((t) => t.id === selectedTourneyId);

  const handleAdminAction = (slotNumber: number, action: 'assign' | 'kick' | 'lock') => {
    setMsg(null);
    if (action === 'kick') {
      const targetSlot = slots.find((s) => s.slotNumber === slotNumber);
      if (targetSlot && targetSlot.bookingId) {
        const res = redlineStore.cancelBooking(targetSlot.bookingId, currentUser);
        if (res.success) {
          setMsg({ type: 'ok', text: `Slot #${slotNumber} vacated and released successfully.` });
          setSlots(redlineStore.getTournamentSlots(selectedTourneyId));
        }
      }
    } else if (action === 'assign') {
      setAssignSlotNum(slotNumber);
    }
  };

  const handleConfirmAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!assignSlotNum || !selectedTourneyId) return;

    const user = redlineStore.getUsers().find((u) => u.freeFireUid === playerUidToAssign.trim());
    if (!user) {
      setMsg({ type: 'err', text: `Player with Free Fire UID "${playerUidToAssign}" not found.` });
      return;
    }

    const res = redlineStore.reserveSlot(selectedTourneyId, assignSlotNum, user);
    if (res.success && res.booking) {
      redlineStore.confirmBooking(res.booking.id, user.uid);
      setMsg({ type: 'ok', text: `Slot #${assignSlotNum} assigned to ${user.freeFireIgn}!` });
      setAssignSlotNum(null);
      setPlayerUidToAssign('');
      setSlots(redlineStore.getTournamentSlots(selectedTourneyId));
    } else {
      setMsg({ type: 'err', text: res.error || 'Failed to assign slot' });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-4">
        <div>
          <h2 className="font-['Teko'] text-3xl font-bold uppercase text-white tracking-wider">
            Slot Operations Matrix
          </h2>
          <p className="text-zinc-400 text-xs">
            Monitor real-time slot occupancy, resolve collisions, and manually allocate or vacate squad positions.
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
                {t.title} ({t.confirmedSlots}/{t.totalSlots})
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

      {/* ASSIGN SLOT MODAL */}
      {assignSlotNum && (
        <div className="bg-zinc-900 border-2 border-rose-500/50 rounded-2xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-white uppercase">
              Manual Assignment for Slot #{assignSlotNum}
            </h4>
            <button
              type="button"
              onClick={() => setAssignSlotNum(null)}
              className="text-xs text-zinc-400 hover:text-white"
            >
              Cancel
            </button>
          </div>

          <form onSubmit={handleConfirmAssignment} className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              required
              placeholder="Enter Player Free Fire UID (e.g. 4829104829)"
              value={playerUidToAssign}
              onChange={(e) => setPlayerUidToAssign(e.target.value)}
              className="flex-1 px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-zinc-200 font-mono focus:outline-none focus:border-rose-500"
            />
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs uppercase"
            >
              Assign & Lock Slot
            </button>
          </form>
        </div>
      )}

      {currentTourney && (
        <SlotMatrix
          slots={slots}
          isAdminMode={true}
          onAdminAction={handleAdminAction}
        />
      )}
    </div>
  );
};
