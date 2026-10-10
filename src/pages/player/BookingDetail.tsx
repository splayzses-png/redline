import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { redlineStore } from '../../services/store';
import type { Booking, Tournament, TournamentRoom } from '../../types';
import { StatusBadge } from '../../components/common/StatusBadge';
import { RoomCredentialsCard } from '../../components/tournament/RoomCredentialsCard';
import {
  Calendar,
  MapPin,
  Clock,
  Hash,
  ShieldCheck,
  CheckCircle,
  ArrowLeft,
  XCircle,
  AlertTriangle,
  QrCode,
} from 'lucide-react';

interface BookingDetailProps {
  bookingId: string;
  onNavigate: (path: string) => void;
}

export const BookingDetail: React.FC<BookingDetailProps> = ({ bookingId, onNavigate }) => {
  const { currentUser } = useAuth();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [roomData, setRoomData] = useState<TournamentRoom | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    const update = () => {
      const b = redlineStore.getBooking(bookingId);
      if (b) {
        setBooking(b);
        const t = redlineStore.getTournament(b.tournamentId);
        setTournament(t || null);

        if (currentUser) {
          const roomCheck = redlineStore.getRoomCredentials(b.tournamentId, currentUser);
          if (roomCheck.authorized && roomCheck.room) {
            setRoomData(roomCheck.room);
          } else {
            setRoomData(null);
          }
        }
      }
    };
    update();
    return redlineStore.subscribe(update);
  }, [bookingId, currentUser]);

  if (!booking || !tournament) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h3 className="text-lg font-bold text-white">Booking Pass Not Found</h3>
        <button
          type="button"
          onClick={() => onNavigate('/dashboard/bookings')}
          className="text-xs text-rose-400 hover:underline flex items-center justify-center gap-1 mx-auto"
        >
          <ArrowLeft className="w-4 h-4" /> Back to My Bookings
        </button>
      </div>
    );
  }

  const handleCheckIn = () => {
    if (!currentUser) return;
    setErrorMsg(null);
    setSuccessMsg(null);

    const res = redlineStore.checkInBooking(booking.id, currentUser.uid);
    if (!res.success) {
      setErrorMsg(res.error || 'Check-in failed');
    } else {
      setSuccessMsg('You are checked in! Room ID will appear below once released by host.');
    }
  };

  const handleCancel = () => {
    if (!currentUser) return;
    if (window.confirm('Are you sure you want to cancel this booking pass?')) {
      const res = redlineStore.cancelBooking(booking.id, currentUser);
      if (res.success) {
        onNavigate('/dashboard/bookings');
      } else {
        setErrorMsg(res.error || 'Failed to cancel booking');
      }
    }
  };

  const timeStr = new Date(booking.tournamentStartTime).toLocaleString([], {
    dateStyle: 'full',
    timeStyle: 'short',
  });

  const canCheckIn =
    booking.status === 'confirmed' &&
    (tournament.status === 'check_in' || tournament.status === 'live');

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* BACK BUTTON */}
      <button
        type="button"
        onClick={() => onNavigate('/dashboard/bookings')}
        className="text-xs font-bold text-zinc-400 hover:text-white uppercase tracking-wider flex items-center gap-1.5 transition"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Bookings</span>
      </button>

      {errorMsg && (
        <div className="p-3.5 rounded-xl bg-red-950/40 border border-red-500/40 text-red-300 text-xs flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0 text-red-400" />
          <span>{errorMsg}</span>
        </div>
      )}

      {successMsg && (
        <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle className="w-4 h-4 shrink-0 text-emerald-400" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* MATCHDAY PASS CARD */}
      <div className="bg-gradient-to-b from-zinc-900 via-zinc-900 to-zinc-950 border-2 border-zinc-800 rounded-3xl overflow-hidden shadow-2xl relative">
        <div className="p-6 sm:p-8 space-y-6">
          {/* TOP HEADER */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-800 pb-5">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 block">
                REDLINE OFFICIAL MATCH PASS
              </span>
              <h1 className="font-['Teko'] text-3xl sm:text-4xl font-bold uppercase text-white tracking-wide leading-none">
                {tournament.title}
              </h1>
            </div>

            <div className="flex items-center gap-2">
              <StatusBadge status={booking.status} size="md" />
            </div>
          </div>

          {/* PASS BODY */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="sm:col-span-2 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-zinc-950/70 p-3.5 rounded-xl border border-zinc-800/80">
                  <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider block">
                    Tournament Schedule
                  </span>
                  <span className="font-semibold text-zinc-200 mt-1 block">
                    {timeStr}
                  </span>
                </div>

                <div className="bg-zinc-950/70 p-3.5 rounded-xl border border-zinc-800/80">
                  <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider block">
                    Map & Mode
                  </span>
                  <span className="font-semibold text-zinc-200 mt-1 block">
                    {tournament.map} • {tournament.gameMode.toUpperCase()}
                  </span>
                </div>
              </div>

              <div className="bg-zinc-950/70 p-3.5 rounded-xl border border-zinc-800/80 space-y-2">
                <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider block">
                  Registered Player Profile
                </span>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-bold text-zinc-100 text-sm">
                    {booking.playerIgn}
                  </span>
                  <span className="font-mono text-zinc-400 bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800">
                    UID: {booking.playerUid}
                  </span>
                </div>
                {booking.teamName && (
                  <span className="text-rose-400 font-semibold block text-[11px]">
                    Clan / Team: {booking.teamName}
                  </span>
                )}
              </div>
            </div>

            {/* SLOT NUMBER EMBLEM */}
            <div className="bg-gradient-to-b from-rose-950/40 to-zinc-950 border border-rose-900/40 rounded-2xl p-5 flex flex-col items-center justify-center text-center space-y-2 shadow-inner">
              <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                Assigned Lobby Slot
              </span>
              <span className="font-['Teko'] text-6xl font-extrabold text-rose-500 leading-none">
                #{booking.slotNumber.toString().padStart(2, '0')}
              </span>
              <span className="text-[10px] text-zinc-500 font-mono">
                Booking ID: {booking.id}
              </span>
            </div>
          </div>

          {/* CHECK-IN ACTION CALLOUT */}
          {canCheckIn && (
            <div className="bg-amber-950/30 border-2 border-amber-500/50 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4 animate-pulse">
              <div className="flex items-center gap-3">
                <Clock className="w-6 h-6 text-amber-400" />
                <div>
                  <h4 className="text-sm font-bold text-amber-200 uppercase">
                    Check-In Window Is Now Open!
                  </h4>
                  <p className="text-xs text-amber-300/80">
                    Confirm your readiness to ensure your squad slot is not forfeited.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleCheckIn}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs uppercase tracking-wider transition shadow-lg"
              >
                Check In Now
              </button>
            </div>
          )}

          {booking.status === 'checked_in' && (
            <div className="p-3 bg-emerald-950/30 border border-emerald-500/40 rounded-xl text-xs text-emerald-300 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              <span>Checked in and ready. Join your assigned slot inside the Free Fire custom room.</span>
            </div>
          )}
        </div>

        {/* PERFORATED PASS DIVIDER */}
        <div className="border-t-2 border-dashed border-zinc-800 relative">
          <div className="absolute -left-3 -top-3 w-6 h-6 rounded-full bg-[#0a0b0e]" />
          <div className="absolute -right-3 -top-3 w-6 h-6 rounded-full bg-[#0a0b0e]" />
        </div>

        {/* BOTTOM SECTION: CONFIDENTIAL ROOM CREDENTIALS */}
        <div className="p-6 sm:p-8 bg-zinc-950 space-y-4">
          <RoomCredentialsCard
            room={roomData}
            isReleased={tournament.roomCredentialsReleased}
            userSlotNumber={booking.slotNumber}
          />

          {/* CANCEL REGISTRATION BUTTON */}
          {(booking.status === 'reserved' || booking.status === 'confirmed') && (
            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={handleCancel}
                className="text-xs text-zinc-500 hover:text-red-400 underline font-semibold transition"
              >
                Cancel Registration and Release Slot
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
