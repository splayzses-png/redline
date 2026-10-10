import React, { useState, useEffect } from 'react';
import { redlineStore } from '../../services/store';
import { useAuth } from '../../context/AuthContext';
import type { Tournament, TournamentSlot, Booking, TournamentRoom } from '../../types';
import { StatusBadge } from '../../components/common/StatusBadge';
import { SlotMatrix } from '../../components/tournament/SlotMatrix';
import { RoomCredentialsCard } from '../../components/tournament/RoomCredentialsCard';
import {
  Calendar,
  MapPin,
  Trophy,
  Users,
  ShieldAlert,
  Clock,
  CheckCircle,
  AlertTriangle,
  ArrowLeft,
  Flame,
  Award,
} from 'lucide-react';

interface TournamentDetailProps {
  slug: string;
  onNavigate: (path: string) => void;
}

export const TournamentDetail: React.FC<TournamentDetailProps> = ({ slug, onNavigate }) => {
  const { currentUser } = useAuth();
  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [slots, setSlots] = useState<TournamentSlot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);
  const [userBooking, setUserBooking] = useState<Booking | null>(null);
  const [roomData, setRoomData] = useState<TournamentRoom | null>(null);
  const [activeTab, setActiveTab] = useState<'slots' | 'prizes' | 'scoring' | 'rules'>('slots');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [pendingBookingId, setPendingBookingId] = useState<string | null>(null);

  useEffect(() => {
    const update = () => {
      const tourney = redlineStore.getTournament(slug);
      if (tourney) {
        setTournament(tourney);
        const tourneySlots = redlineStore.getTournamentSlots(tourney.id);
        setSlots(tourneySlots);

        if (currentUser) {
          const bookings = redlineStore.getBookings(currentUser.uid);
          const currentB = bookings.find(
            (b) =>
              b.tournamentId === tourney.id &&
              b.status !== 'cancelled' &&
              b.status !== 'rejected'
          );
          setUserBooking(currentB || null);

          // Check room credentials
          const roomCheck = redlineStore.getRoomCredentials(tourney.id, currentUser);
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
  }, [slug, currentUser]);

  if (!tournament) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-xl font-bold text-white">Tournament not found</h2>
        <button
          type="button"
          onClick={() => onNavigate('/tournaments')}
          className="text-sm text-rose-400 hover:underline flex items-center justify-center gap-1 mx-auto"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Tournaments
        </button>
      </div>
    );
  }

  const handleReserve = () => {
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!currentUser) {
      onNavigate('/login');
      return;
    }

    if (!currentUser.freeFireUid || !currentUser.freeFireIgn) {
      setErrorMsg('Please update your Free Fire UID and IGN in your Profile before registering.');
      return;
    }

    if (!selectedSlot) {
      setErrorMsg('Please click on an available slot number first.');
      return;
    }

    const res = redlineStore.reserveSlot(tournament.id, selectedSlot, currentUser);
    if (!res.success) {
      setErrorMsg(res.error || 'Failed to reserve slot');
    } else if (res.booking) {
      setPendingBookingId(res.booking.id);
      setSuccessMsg(`Slot #${selectedSlot} reserved! You have 5 minutes to confirm.`);
    }
  };

  const handleConfirm = () => {
    if (!pendingBookingId || !currentUser) return;
    const res = redlineStore.confirmBooking(pendingBookingId, currentUser.uid);
    if (!res.success) {
      setErrorMsg(res.error || 'Failed to confirm booking');
    } else {
      setSuccessMsg('Registration confirmed! Your slot is locked.');
      setPendingBookingId(null);
      setSelectedSlot(null);
    }
  };

  const startTimeStr = new Date(tournament.startTime).toLocaleString([], {
    dateStyle: 'medium',
    timeStyle: 'short',
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* BACK LINK */}
      <button
        type="button"
        onClick={() => onNavigate('/tournaments')}
        className="text-xs font-bold text-zinc-400 hover:text-white uppercase tracking-wider flex items-center gap-1.5 transition"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Tournaments</span>
      </button>

      {/* HEADER BANNER */}
      <div className="bg-gradient-to-r from-zinc-900 via-zinc-900 to-rose-950/40 border border-zinc-800 rounded-2xl p-6 sm:p-8 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge status={tournament.status} size="md" />
            <span className="bg-zinc-800 text-zinc-300 font-mono text-xs px-2.5 py-1 rounded font-bold uppercase">
              {tournament.gameMode}
            </span>
            <span className="bg-zinc-800 text-zinc-300 font-mono text-xs px-2.5 py-1 rounded font-bold uppercase">
              {tournament.matchFormat.replace(/_/g, ' ')}
            </span>
            <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs px-2.5 py-1 rounded font-bold uppercase">
              FREE ENTRY
            </span>
          </div>

          <div className="text-right">
            <span className="text-[10px] text-zinc-400 uppercase font-bold tracking-wider block">
              Prize Reward Pool
            </span>
            <span className="font-['Teko'] text-3xl sm:text-4xl font-bold text-amber-400 leading-none">
              ₹{tournament.prizePoolInr} INR
            </span>
          </div>
        </div>

        <div>
          <h1 className="font-['Teko'] text-4xl sm:text-6xl font-bold text-white uppercase tracking-wide leading-tight">
            {tournament.title}
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-300 mt-2 font-medium">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-rose-500" />
              <span>{startTimeStr}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-rose-500" />
              <span>Map: {tournament.map}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-amber-400" />
              <span>Check-in opens {tournament.checkInWindowMinutes}m prior</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Users className="w-4 h-4 text-emerald-400" />
              <span>
                {tournament.confirmedSlots} / {tournament.totalSlots} Slots Confirmed
              </span>
            </div>
          </div>
        </div>

        {/* ROOM CREDENTIALS CALLOUT (if participant) */}
        {userBooking && (
          <div className="pt-2">
            <RoomCredentialsCard
              room={roomData}
              isReleased={tournament.roomCredentialsReleased}
              userSlotNumber={userBooking.slotNumber}
            />
          </div>
        )}
      </div>

      {/* MESSAGES */}
      {errorMsg && (
        <div className="p-4 rounded-xl bg-red-950/40 border border-red-500/40 text-red-300 text-xs flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0 text-red-400" />
          <span>{errorMsg}</span>
        </div>
      )}
      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle className="w-4 h-4 shrink-0 text-emerald-400" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* PENDING HOLD CONFIRMATION BAR */}
      {pendingBookingId && (
        <div className="bg-amber-950/30 border-2 border-amber-500/50 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 animate-pulse">
          <div className="flex items-center gap-3">
            <Clock className="w-6 h-6 text-amber-400" />
            <div>
              <h4 className="text-sm font-bold text-amber-200 uppercase">
                Temporary Slot Hold Active (5 Minutes)
              </h4>
              <p className="text-xs text-amber-300/80">
                Click Confirm Registration to finalize and claim slot #{selectedSlot}.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleConfirm}
            className="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs uppercase tracking-wider transition"
          >
            Confirm Registration
          </button>
        </div>
      )}

      {/* NAVIGATION TABS */}
      <div className="flex border-b border-zinc-800 gap-2">
        <button
          type="button"
          onClick={() => setActiveTab('slots')}
          className={`px-4 py-2 text-xs font-bold uppercase tracking-wider border-b-2 transition ${
            activeTab === 'slots'
              ? 'border-rose-500 text-rose-400'
              : 'border-transparent text-zinc-400 hover:text-zinc-200'
          }`}
        >
          Slots Matrix ({slots.filter((s) => s.status === 'available').length} Open)
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('prizes')}
          className={`px-4 py-2 text-xs font-bold uppercase tracking-wider border-b-2 transition ${
            activeTab === 'prizes'
              ? 'border-rose-500 text-rose-400'
              : 'border-transparent text-zinc-400 hover:text-zinc-200'
          }`}
        >
          Prizes & Rewards
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('scoring')}
          className={`px-4 py-2 text-xs font-bold uppercase tracking-wider border-b-2 transition ${
            activeTab === 'scoring'
              ? 'border-rose-500 text-rose-400'
              : 'border-transparent text-zinc-400 hover:text-zinc-200'
          }`}
        >
          Points System
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('rules')}
          className={`px-4 py-2 text-xs font-bold uppercase tracking-wider border-b-2 transition ${
            activeTab === 'rules'
              ? 'border-rose-500 text-rose-400'
              : 'border-transparent text-zinc-400 hover:text-zinc-200'
          }`}
        >
          Rules & Regulations
        </button>
      </div>

      {/* TAB CONTENT: SLOTS */}
      {activeTab === 'slots' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-zinc-900/60 border border-zinc-800 p-4 rounded-xl">
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Select Your Squad Slot
              </h3>
              <p className="text-xs text-zinc-400">
                Pick an available green slot. Once picked, click Reserve Slot to secure your place.
              </p>
            </div>

            {tournament.status === 'registration_open' && !userBooking && (
              <button
                type="button"
                onClick={handleReserve}
                disabled={!selectedSlot}
                className={`px-6 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition ${
                  selectedSlot
                    ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-900/40'
                    : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                }`}
              >
                {selectedSlot ? `Reserve Slot #${selectedSlot}` : 'Select a Slot First'}
              </button>
            )}

            {userBooking && (
              <div className="text-xs font-bold text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 px-3 py-1.5 rounded-lg flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4" />
                <span>You are registered in Slot #{userBooking.slotNumber}</span>
              </div>
            )}
          </div>

          <SlotMatrix
            slots={slots}
            selectedSlot={selectedSlot}
            onSelectSlot={(slotNum) => setSelectedSlot(slotNum)}
          />
        </div>
      )}

      {/* TAB CONTENT: PRIZES */}
      {activeTab === 'prizes' && (
        <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-6 space-y-4">
          <div className="flex items-center gap-2 text-amber-400">
            <Trophy className="w-5 h-5" />
            <h3 className="font-['Teko'] text-2xl font-bold uppercase text-white">
              Prize Distribution Breakdown
            </h3>
          </div>
          <p className="text-xs text-zinc-400">
            Total Prize Reward of ₹{tournament.prizePoolInr} INR is distributed upon host verification and leaderboards finalization.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-2">
            {tournament.prizeBreakdown.map((p) => (
              <div
                key={p.rank}
                className="bg-zinc-950 border border-zinc-800 p-4 rounded-xl flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 flex items-center justify-center font-bold text-xs">
                    #{p.rank}
                  </div>
                  <div>
                    <span className="text-xs font-bold text-zinc-200 block">{p.label}</span>
                    <span className="text-[10px] text-zinc-500 uppercase">Rank Placement</span>
                  </div>
                </div>
                <span className="font-['Teko'] text-2xl font-bold text-amber-400">
                  ₹{p.amountInr}
                </span>
              </div>
            ))}
          </div>

          <div className="text-[11px] text-zinc-500 bg-zinc-950/60 p-3 rounded border border-zinc-800/80">
            * Note: Rewards are recorded in the platform prize ledger and settled out-of-band via UPI/bank transfer directly by the tournament administrator. No cash withdrawals or payment gateway deposits take place on the web platform.
          </div>
        </div>
      )}

      {/* TAB CONTENT: SCORING */}
      {activeTab === 'scoring' && (
        <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-6 space-y-6">
          <div className="flex items-center gap-2 text-rose-400">
            <Award className="w-5 h-5" />
            <h3 className="font-['Teko'] text-2xl font-bold uppercase text-white">
              Official Scoring System
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-zinc-950 border border-zinc-800 p-4 rounded-xl space-y-3">
              <h4 className="text-xs font-bold text-zinc-200 uppercase tracking-wider">
                Placement Points
              </h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {Object.entries(tournament.scoringRules.placementPoints).map(([rank, pts]) => (
                  <div
                    key={rank}
                    className="flex items-center justify-between p-2 rounded bg-zinc-900 border border-zinc-800"
                  >
                    <span className="text-zinc-400">Rank #{rank}</span>
                    <span className="font-mono font-bold text-emerald-400">{pts} pts</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-zinc-950 border border-zinc-800 p-4 rounded-xl space-y-2">
                <h4 className="text-xs font-bold text-zinc-200 uppercase tracking-wider">
                  Kill Multiplier
                </h4>
                <div className="flex items-center justify-between p-3 rounded bg-zinc-900 border border-zinc-800 text-xs">
                  <span className="text-zinc-300">Each Verified Kill</span>
                  <span className="font-mono font-bold text-rose-400">
                    +{tournament.scoringRules.killPoints} pt
                  </span>
                </div>
              </div>

              <div className="bg-zinc-950 border border-zinc-800 p-4 rounded-xl space-y-2 text-xs text-zinc-400">
                <h4 className="font-bold text-zinc-200 uppercase tracking-wider">
                  Tie-Breaker Rule
                </h4>
                <p>
                  In the event of equal total points: (1) Total match kills, (2) Highest single placement, (3) Final match damage dealt.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: RULES */}
      {activeTab === 'rules' && (
        <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-6 space-y-4 text-xs text-zinc-300 leading-relaxed">
          <div className="flex items-center gap-2 text-rose-500">
            <ShieldAlert className="w-5 h-5" />
            <h3 className="font-['Teko'] text-2xl font-bold uppercase text-white">
              Rules & Fair Play Guidelines
            </h3>
          </div>

          <div className="p-4 bg-zinc-950 rounded-lg border border-zinc-800 whitespace-pre-line text-zinc-300">
            {tournament.rules}
          </div>

          <div className="space-y-2 text-zinc-400">
            <h5 className="font-bold text-zinc-200 uppercase">Standard Disqualification Triggers:</h5>
            <ul className="list-disc list-inside space-y-1">
              <li>Joining custom room under an unverified Free Fire UID</li>
              <li>Switching slots inside the custom room</li>
              <li>Using PC emulator or rooted macro devices</li>
              <li>Teaming up with opponent squads</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};
