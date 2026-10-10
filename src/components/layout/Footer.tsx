import React from 'react';
import { Flame, Shield, CheckCircle, Scale } from 'lucide-react';

interface FooterProps {
  onNavigate: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-[#07080a] border-t border-zinc-900 text-zinc-400 text-xs mt-auto">
      {/* COMPLIANCE & TRUST PILLARS */}
      <div className="border-b border-zinc-900/80 bg-zinc-950/40 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 shrink-0">
              <CheckCircle className="w-5 h-5" />
            </div>
            <div>
              <h5 className="font-bold text-zinc-200 text-sm">100% Free Tournament Launch</h5>
              <p className="text-zinc-500 text-xs mt-0.5 leading-relaxed">
                All daily scrims and cups are completely free to enter. No deposit, betting, or real-money wagering is accepted.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-rose-500/10 text-rose-400 shrink-0">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h5 className="font-bold text-zinc-200 text-sm">Anti-Cheat & Mobile Only</h5>
              <p className="text-zinc-500 text-xs mt-0.5 leading-relaxed">
                Zero-tolerance policy against PC emulators, modified APKs, or teaming. Verified Free Fire UIDs only.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400 shrink-0">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h5 className="font-bold text-zinc-200 text-sm">India Skill Gaming Compliance</h5>
              <p className="text-zinc-500 text-xs mt-0.5 leading-relaxed">
                Competitive esports tournaments based strictly on player hand-eye coordination and tactical skills.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN FOOTER */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* BRAND */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded bg-rose-600 flex items-center justify-center">
                <Flame className="w-5 h-5 text-white" />
              </div>
              <span className="font-['Teko'] text-2xl font-bold tracking-wider text-white">REDLINE PAID SCRIMS</span>
            </div>
            <p className="text-zinc-500 leading-relaxed text-xs">
              India-first Free Fire competitive tournament hosting platform. Built for grassroots clans and esports athletes.
            </p>
            <div className="text-[11px] font-mono text-zinc-600">
              Host: Mumbai (asia-south1) • Vercel Edge • Firebase
            </div>
          </div>

          {/* EXPLORE */}
          <div className="space-y-2">
            <h5 className="font-bold text-zinc-200 uppercase tracking-wider text-xs">Competitions</h5>
            <ul className="space-y-1.5">
              <li>
                <button onClick={() => onNavigate('/tournaments')} className="hover:text-rose-400 transition">
                  Browse Scrims & Tournaments
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/results')} className="hover:text-rose-400 transition">
                  Leaderboards & Match Results
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/rules')} className="hover:text-rose-400 transition">
                  Official Rulebook & Fair Play
                </button>
              </li>
            </ul>
          </div>

          {/* PLAYER & SUPPORT */}
          <div className="space-y-2">
            <h5 className="font-bold text-zinc-200 uppercase tracking-wider text-xs">Player Desk</h5>
            <ul className="space-y-1.5">
              <li>
                <button onClick={() => onNavigate('/dashboard')} className="hover:text-rose-400 transition">
                  Player Dashboard
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/dashboard/teams')} className="hover:text-rose-400 transition">
                  Squad & Clan Rosters
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/dashboard/wallet')} className="hover:text-rose-400 transition">
                  Prize History Ledger
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/support')} className="hover:text-rose-400 transition">
                  Help Desk & Match Disputes
                </button>
              </li>
            </ul>
          </div>

          {/* LEGAL & POLICIES */}
          <div className="space-y-2">
            <h5 className="font-bold text-zinc-200 uppercase tracking-wider text-xs">Legal & Policy</h5>
            <ul className="space-y-1.5">
              <li>
                <button onClick={() => onNavigate('/terms')} className="hover:text-rose-400 transition">
                  Terms of Service
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/privacy')} className="hover:text-rose-400 transition">
                  Privacy Policy (India)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/rules')} className="hover:text-rose-400 transition">
                  Dispute & Disqualification Policy
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* DISCLAIMER */}
        <div className="mt-8 pt-6 border-t border-zinc-900 text-[11px] text-zinc-600 space-y-2 text-center md:text-left">
          <p>
            DISCLAIMER: Free Fire is a registered trademark of Garena International. REDLINE PAID SCRIMS is an independent tournament platform and is not sponsored, endorsed, or affiliated with Garena.
          </p>
          <div className="flex flex-col md:flex-row items-center justify-between text-zinc-500 gap-2">
            <span>© 2026 REDLINE PAID SCRIMS. All rights reserved.</span>
            <span>Version 1.0.0-PROD • Free Scrims Launch Edition</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
