import React from 'react';
import { Scale } from 'lucide-react';

export const Terms: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="border-b border-zinc-800 pb-6 space-y-2">
        <div className="flex items-center gap-2 text-rose-500 text-xs font-bold uppercase tracking-wider">
          <Scale className="w-4 h-4" />
          <span>Platform Agreement</span>
        </div>
        <h1 className="font-['Teko'] text-4xl sm:text-5xl font-bold tracking-wide text-white uppercase">
          Terms of Service
        </h1>
        <p className="text-zinc-400 text-sm">
          Effective October 2026 • Governing use of REDLINE PAID SCRIMS platform.
        </p>
      </div>

      <div className="space-y-6 text-xs text-zinc-300 leading-relaxed bg-zinc-900/60 border border-zinc-800 p-6 rounded-2xl">
        <section className="space-y-2">
          <h2 className="text-sm font-bold text-white uppercase">1. Skill-Based Competition in India</h2>
          <p>
            Competitive esports tournaments hosted on REDLINE depend predominantly on the skills, strategies, reflexes, and athletic coordination of participants. As recognized by Indian judicial precedent, competitions of skill are exempt from betting and gambling prohibitions.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-bold text-white uppercase">2. 100% Free Public Launch Edition</h2>
          <p>
            All tournaments in this release are entirely free of any entry fees or deposits. No cash deposit, staking, or real-money wagering is supported or enabled on the web application.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-bold text-white uppercase">3. Eligibility and Age</h2>
          <p>
            You must be at least 18 years of age or have obtained parental/guardian consent to register and participate in REDLINE tournaments.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-bold text-white uppercase">4. Tournament Operations and Prize Settlement</h2>
          <p>
            Match referee decisions are final. Rewards and prize ledger balances are settled directly and manually by the tournament organizer (via UPI/IMPS) after match audit completion.
          </p>
        </section>
      </div>
    </div>
  );
};
