import React from 'react';
import { BookOpen, ShieldAlert, Smartphone, CheckCircle, AlertTriangle } from 'lucide-react';

export const Rules: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="border-b border-zinc-800 pb-6 space-y-2">
        <div className="flex items-center gap-2 text-rose-500 text-xs font-bold uppercase tracking-wider">
          <BookOpen className="w-4 h-4" />
          <span>Esports Governance</span>
        </div>
        <h1 className="font-['Teko'] text-4xl sm:text-5xl font-bold tracking-wide text-white uppercase">
          Official Rulebook & Fair Play
        </h1>
        <p className="text-zinc-400 text-sm">
          All participants must read and adhere to the official REDLINE tournament regulations before registering.
        </p>
      </div>

      {/* CORE REGULATIONS */}
      <div className="space-y-6 text-xs text-zinc-300 leading-relaxed">
        {/* RULE 1 */}
        <div className="bg-zinc-900/80 border border-zinc-800 rounded-xl p-5 space-y-3">
          <div className="flex items-center gap-2 text-rose-400 font-bold uppercase text-sm">
            <Smartphone className="w-4 h-4" />
            <span>1. Device & Platform Regulations (Mobile Only)</span>
          </div>
          <p>
            All matches must be played on standard handheld Android or iOS smartphones and tablets. The use of PC emulators (BlueStacks, LDPlayer, Nox, Gameloop, etc.), mouse/keyboard adapters, rooted macro injectors, or modified APKs is strictly prohibited. Any player detected on an emulator will be immediately kicked and banned.
          </p>
        </div>

        {/* RULE 2 */}
        <div className="bg-zinc-900/80 border border-zinc-800 rounded-xl p-5 space-y-3">
          <div className="flex items-center gap-2 text-rose-400 font-bold uppercase text-sm">
            <CheckCircle className="w-4 h-4" />
            <span>2. Account Verification & Free Fire UID</span>
          </div>
          <p>
            Every participant must register their unique 8-12 digit Free Fire numeric UID and current In-Game Name (IGN). Free Fire accounts must have reached at least Level 35 to prevent smurfing. Only registered UIDs are permitted entry to the custom room.
          </p>
        </div>

        {/* RULE 3 */}
        <div className="bg-zinc-900/80 border border-zinc-800 rounded-xl p-5 space-y-3">
          <div className="flex items-center gap-2 text-rose-400 font-bold uppercase text-sm">
            <ShieldAlert className="w-4 h-4" />
            <span>3. Room Entry & Slot Etiquette</span>
          </div>
          <p>
            Custom Room ID and Password are confidential and provided only to registered players on their Booking Pass. Players MUST enter only their assigned slot number. Switching slots inside the lobby without referee approval will result in a lobby kick without refund or reassignment.
          </p>
        </div>

        {/* RULE 4 */}
        <div className="bg-zinc-900/80 border border-zinc-800 rounded-xl p-5 space-y-3">
          <div className="flex items-center gap-2 text-rose-400 font-bold uppercase text-sm">
            <AlertTriangle className="w-4 h-4" />
            <span>4. Teaming & Griefing Penalties</span>
          </div>
          <p>
            Teaming with opponents, intentionally dying to feed points, stream sniping, or verbal toxicity in all-chat will lead to an immediate match disqualification (0 points), prize forfeiture, and possible seasonal suspension.
          </p>
        </div>
      </div>
    </div>
  );
};
