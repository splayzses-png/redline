import React from 'react';
import type { TournamentSlot } from '../../types';
import { Users, Clock, ShieldCheck, Lock } from 'lucide-react';

interface SlotMatrixProps {
  slots: TournamentSlot[];
  selectedSlot?: number | null;
  onSelectSlot?: (slotNumber: number) => void;
  isAdminMode?: boolean;
  onAdminAction?: (slotNumber: number, action: 'assign' | 'kick' | 'lock') => void;
}

export const SlotMatrix: React.FC<SlotMatrixProps> = ({
  slots,
  selectedSlot,
  onSelectSlot,
  isAdminMode = false,
  onAdminAction,
}) => {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-zinc-400 bg-zinc-900/60 p-3 rounded-lg border border-zinc-800">
        <span className="font-medium text-zinc-300">Slot Status Legend:</span>
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-emerald-500/20 border border-emerald-500/60 inline-block"></span>
            <span>Available</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-amber-500/20 border border-amber-500/60 inline-block animate-pulse"></span>
            <span>Hold (5m)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-rose-500/20 border border-rose-500/60 inline-block"></span>
            <span>Confirmed</span>
          </div>
          {isAdminMode && (
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-zinc-700 border border-zinc-600 inline-block"></span>
              <span>Locked</span>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {slots.map((slot) => {
          const isSelected = selectedSlot === slot.slotNumber;
          const isAvailable = slot.status === 'available';
          const isHeld = slot.status === 'held';
          const isConfirmed = slot.status === 'confirmed';
          const isLocked = slot.status === 'locked';

          let cardClasses = 'relative p-3 rounded-lg border transition-all text-left flex flex-col justify-between min-h-[90px]';

          if (isSelected) {
            cardClasses += ' bg-rose-950/40 border-rose-500 ring-2 ring-rose-500 shadow-lg shadow-rose-950/50';
          } else if (isAvailable) {
            cardClasses += ' bg-zinc-900/90 border-emerald-500/30 hover:border-emerald-500 hover:bg-emerald-950/10 cursor-pointer';
          } else if (isHeld) {
            cardClasses += ' bg-amber-950/20 border-amber-500/40 text-amber-300';
          } else if (isConfirmed) {
            cardClasses += ' bg-zinc-900/80 border-rose-900/40 text-zinc-300';
          } else {
            cardClasses += ' bg-zinc-950 border-zinc-800 opacity-60';
          }

          return (
            <div
              key={slot.slotNumber}
              onClick={() => {
                if (isAvailable && onSelectSlot) {
                  onSelectSlot(slot.slotNumber);
                }
              }}
              className={cardClasses}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300">
                  #{slot.slotNumber.toString().padStart(2, '0')}
                </span>

                {isAvailable && (
                  <span className="text-[10px] font-semibold text-emerald-400 uppercase tracking-wider">
                    FREE
                  </span>
                )}
                {isHeld && (
                  <span className="flex items-center gap-1 text-[10px] text-amber-400 font-mono">
                    <Clock className="w-3 h-3 animate-spin" />
                    HELD
                  </span>
                )}
                {isConfirmed && (
                  <span className="flex items-center gap-1 text-[10px] text-rose-400">
                    <ShieldCheck className="w-3 h-3" />
                    LOCKED
                  </span>
                )}
                {isLocked && (
                  <Lock className="w-3 h-3 text-zinc-500" />
                )}
              </div>

              <div className="mt-2 truncate">
                {isConfirmed ? (
                  <div>
                    <div className="text-xs font-semibold text-zinc-100 truncate">
                      {slot.teamName || slot.playerIgn || 'Confirmed Squad'}
                    </div>
                    {slot.playerUid && (
                      <div className="text-[10px] font-mono text-zinc-500 truncate">
                        UID: {slot.playerUid}
                      </div>
                    )}
                  </div>
                ) : isHeld ? (
                  <div className="text-[11px] text-amber-300/80">
                    Reserving hold...
                  </div>
                ) : (
                  <div className="text-xs text-zinc-500 flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    Click to pick
                  </div>
                )}
              </div>

              {isAdminMode && onAdminAction && (
                <div className="mt-2 pt-2 border-t border-zinc-800 flex gap-1 justify-end">
                  {isConfirmed && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onAdminAction(slot.slotNumber, 'kick');
                      }}
                      className="text-[10px] bg-red-950/60 hover:bg-red-900 text-red-300 px-1.5 py-0.5 rounded"
                      title="Kick participant & vacate slot"
                    >
                      Kick
                    </button>
                  )}
                  {isAvailable && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onAdminAction(slot.slotNumber, 'assign');
                      }}
                      className="text-[10px] bg-zinc-800 hover:bg-zinc-700 text-zinc-300 px-1.5 py-0.5 rounded"
                      title="Manually assign squad"
                    >
                      Assign
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
