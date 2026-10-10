import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Users, Copy, Check, ShieldCheck, Gift, AlertTriangle, Share2 } from 'lucide-react';

export const Referrals: React.FC = () => {
  const { currentUser } = useAuth();
  const [copied, setCopied] = useState(false);

  if (!currentUser) return null;

  const referralUrl = `${window.location.origin}/register?ref=${currentUser.referralCode}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(referralUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="border-b border-zinc-800 pb-6 space-y-2">
        <div className="flex items-center gap-2 text-rose-500 text-xs font-bold uppercase tracking-wider">
          <Gift className="w-4 h-4" />
          <span>Squad Growth</span>
        </div>
        <h1 className="font-['Teko'] text-4xl sm:text-5xl font-bold uppercase text-white tracking-wide">
          Player Referral Program
        </h1>
        <p className="text-zinc-400 text-xs max-w-2xl">
          Invite Free Fire clans and esports friends to REDLINE. Earn verified platform badges and priority slot reservations.
        </p>
      </div>

      {/* REFERRAL LINK CARD */}
      <div className="bg-gradient-to-r from-zinc-900 via-zinc-900 to-rose-950/40 border border-zinc-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 block">
              Your Unique Referral Code
            </span>
            <span className="font-['Teko'] text-4xl font-bold text-rose-400 tracking-wider">
              {currentUser.referralCode}
            </span>
          </div>

          <button
            type="button"
            onClick={handleCopy}
            className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs uppercase tracking-wider transition flex items-center gap-2 self-start sm:self-auto cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-300" />
                <span>Link Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Copy Referral Link</span>
              </>
            )}
          </button>
        </div>

        <div className="bg-zinc-950/80 border border-zinc-800 rounded-xl p-3 text-xs text-zinc-300 font-mono truncate flex items-center justify-between gap-2">
          <span className="truncate">{referralUrl}</span>
        </div>
      </div>

      {/* ANTI-ABUSE & QUALIFICATION CRITERIA */}
      <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-6 space-y-4 text-xs text-zinc-300">
        <div className="flex items-center gap-2 text-amber-400 font-bold uppercase text-xs">
          <AlertTriangle className="w-4 h-4" />
          <span>Anti-Abuse Guidelines & Qualification Rules</span>
        </div>
        <ul className="list-disc list-inside space-y-2 text-zinc-400 leading-relaxed">
          <li>Referred players must possess a distinct, verified Free Fire UID (minimum Level 35 account).</li>
          <li>Self-referrals or multiple accounts from the same IP/device are detected by our audit engine and disqualified.</li>
          <li>A referral qualifies only after the invited player successfully completes at least one official tournament match.</li>
          <li>All referral perks and tier rewards are manually audited and settled by the platform owner.</li>
        </ul>
      </div>
    </div>
  );
};
