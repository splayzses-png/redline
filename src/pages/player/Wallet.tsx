import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { redlineStore } from '../../services/store';
import type { PrizeRecord } from '../../types';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Trophy, ShieldCheck, Clock, CheckCircle, Info, Hash, AlertTriangle } from 'lucide-react';

export const Wallet: React.FC = () => {
  const { currentUser } = useAuth();
  const [prizes, setPrizes] = useState<PrizeRecord[]>([]);

  useEffect(() => {
    if (!currentUser) return;
    const update = () => {
      setPrizes(redlineStore.getPrizes(currentUser.uid));
    };
    update();
    return redlineStore.subscribe(update);
  }, [currentUser]);

  if (!currentUser) return null;

  const totalSettled = prizes
    .filter((p) => p.status === 'settled')
    .reduce((sum, p) => sum + p.amountInr, 0);

  const totalPending = prizes
    .filter((p) => p.status === 'pending_review' || p.status === 'approved')
    .reduce((sum, p) => sum + p.amountInr, 0);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* HEADER */}
      <div className="border-b border-zinc-800 pb-6 space-y-2">
        <div className="flex items-center gap-2 text-rose-500 text-xs font-bold uppercase tracking-wider">
          <Trophy className="w-4 h-4" />
          <span>Transparent Accounting</span>
        </div>
        <h1 className="font-['Teko'] text-4xl sm:text-5xl font-bold uppercase text-white tracking-wide">
          Prize & Reward Ledger
        </h1>
        <p className="text-zinc-400 text-xs max-w-2xl">
          An immutable read-only ledger of verified tournament placements and host settlements.
        </p>
      </div>

      {/* READ-ONLY COMPLIANCE NOTICE */}
      <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-5 flex items-start gap-3 text-xs text-zinc-300">
        <Info className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h4 className="font-bold text-white uppercase">
            Notice: Read-Only Ledger Policy (No In-App Deposit or Withdrawal)
          </h4>
          <p className="text-zinc-400 leading-relaxed">
            In accordance with Indian legal compliance and launch policy, REDLINE operates strictly on free tournament entries. This page is an audited record of prizes awarded. All settlements are transferred out-of-band directly to your UPI ID by the tournament organizer following match verification.
          </p>
        </div>
      </div>

      {/* METRIC TOTALS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-6 space-y-1">
          <span className="text-[10px] font-bold uppercase text-zinc-500">
            Total Settled & Paid Out
          </span>
          <span className="font-['Teko'] text-4xl sm:text-5xl font-bold text-emerald-400 block">
            ₹{totalSettled} INR
          </span>
          <span className="text-[11px] text-zinc-400">
            Transferred via direct UPI / Bank transfer
          </span>
        </div>

        <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-6 space-y-1">
          <span className="text-[10px] font-bold uppercase text-zinc-500">
            Pending Audit / In Review
          </span>
          <span className="font-['Teko'] text-4xl sm:text-5xl font-bold text-amber-400 block">
            ₹{totalPending} INR
          </span>
          <span className="text-[11px] text-zinc-400">
            Awaiting referee score confirmation
          </span>
        </div>
      </div>

      {/* PRIZE HISTORY TABLE */}
      <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="p-4 bg-zinc-950 border-b border-zinc-800 flex items-center justify-between">
          <h3 className="font-['Teko'] text-xl font-bold uppercase text-white tracking-wider">
            Settlement History & Ledger Records
          </h3>
          <span className="text-xs text-zinc-500">
            {prizes.length} records
          </span>
        </div>

        {prizes.length === 0 ? (
          <div className="p-12 text-center text-xs text-zinc-400 space-y-2">
            <Trophy className="w-8 h-8 text-zinc-600 mx-auto" />
            <p>No prize settlements recorded for your account yet.</p>
            <span className="text-zinc-500 text-[11px]">
              Compete in daily scrims and secure top 3 placements to earn tournament rewards!
            </span>
          </div>
        ) : (
          <div className="divide-y divide-zinc-800/80">
            {prizes.map((p) => {
              const isSettled = p.status === 'settled';

              return (
                <div
                  key={p.id}
                  className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs hover:bg-zinc-850 transition"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <StatusBadge status={p.status} size="sm" />
                      <span className="font-mono text-xs font-bold text-amber-400">
                        Rank #{p.rank} Placement
                      </span>
                    </div>

                    <h4 className="font-bold text-zinc-100 text-sm">
                      {p.tournamentTitle}
                    </h4>

                    {p.manualPaymentReference && (
                      <div className="flex items-center gap-1.5 text-zinc-400 font-mono text-[11px]">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Payout Ref: {p.manualPaymentReference}</span>
                      </div>
                    )}
                    {p.adminNotes && (
                      <span className="text-[11px] text-zinc-500 block">
                        Host Note: {p.adminNotes}
                      </span>
                    )}
                  </div>

                  <div className="text-left sm:text-right shrink-0">
                    <span className="text-[10px] text-zinc-500 uppercase font-bold block">
                      Amount Awarded
                    </span>
                    <span className="font-['Teko'] text-3xl font-bold text-amber-400">
                      ₹{p.amountInr}
                    </span>
                    <span className="text-[10px] text-zinc-500 block font-mono">
                      {new Date(p.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
