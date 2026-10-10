import React, { useState } from 'react';
import type { TournamentRoom } from '../../types';
import { KeyRound, Copy, Check, ShieldAlert, Sparkles, AlertTriangle } from 'lucide-react';

interface RoomCredentialsCardProps {
  room?: TournamentRoom | null;
  isReleased: boolean;
  userSlotNumber?: number;
}

export const RoomCredentialsCard: React.FC<RoomCredentialsCardProps> = ({
  room,
  isReleased,
  userSlotNumber,
}) => {
  const [copiedField, setCopiedField] = useState<'id' | 'pass' | null>(null);

  const handleCopy = (text: string, field: 'id' | 'pass') => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  if (!isReleased || !room) {
    return (
      <div className="bg-zinc-900/90 border border-zinc-800 rounded-xl p-6 text-center space-y-3">
        <div className="inline-flex p-3 rounded-full bg-zinc-800 text-zinc-400">
          <KeyRound className="w-6 h-6 animate-pulse" />
        </div>
        <h4 className="text-base font-semibold text-zinc-100">Custom Room Details Confidential</h4>
        <p className="text-sm text-zinc-400 max-w-md mx-auto">
          Room ID & Password will be released here 15-20 minutes before match start once check-in commences.
          Only confirmed participants can view credentials.
        </p>
        <div className="inline-flex items-center gap-2 text-xs text-amber-400 bg-amber-950/30 border border-amber-800/40 px-3 py-1.5 rounded-full">
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>Never share room credentials outside your squad roster</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-zinc-900 via-zinc-900/95 to-rose-950/20 border-2 border-rose-500/50 rounded-xl p-6 shadow-2xl space-y-5">
      <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-rose-500/20 rounded-lg text-rose-400">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-base font-bold text-zinc-100 tracking-wide uppercase">
              Free Fire Custom Room Pass
            </h4>
            <p className="text-xs text-emerald-400 font-medium">● Credentials Live & Verified by Host</p>
          </div>
        </div>
        {userSlotNumber && (
          <div className="text-right">
            <span className="text-[10px] text-zinc-400 uppercase tracking-wider block">Assigned Slot</span>
            <span className="text-lg font-mono font-extrabold text-rose-400">
              #{userSlotNumber.toString().padStart(2, '0')}
            </span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* ROOM ID */}
        <div className="bg-zinc-950/80 border border-zinc-800 rounded-lg p-3.5 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider block">
              Custom Room ID
            </span>
            <span className="text-xl font-mono font-bold text-zinc-100 tracking-wider">
              {room.roomId}
            </span>
          </div>
          <button
            type="button"
            onClick={() => handleCopy(room.roomId, 'id')}
            className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-200 transition"
          >
            {copiedField === 'id' ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>

        {/* ROOM PASSWORD */}
        <div className="bg-zinc-950/80 border border-zinc-800 rounded-lg p-3.5 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider block">
              Room Password
            </span>
            <span className="text-xl font-mono font-bold text-rose-400 tracking-wider">
              {room.roomPassword}
            </span>
          </div>
          <button
            type="button"
            onClick={() => handleCopy(room.roomPassword, 'pass')}
            className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-200 transition"
          >
            {copiedField === 'pass' ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
      </div>

      {room.customInstructions && (
        <div className="bg-zinc-950/60 border border-zinc-800/80 rounded-lg p-3 text-xs text-zinc-300 flex items-start gap-2.5">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-amber-300">Host Instructions: </span>
            {room.customInstructions}
          </div>
        </div>
      )}
    </div>
  );
};
