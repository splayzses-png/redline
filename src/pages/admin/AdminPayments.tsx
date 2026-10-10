import React from 'react';
import { getFeatureFlags } from '../../config/featureFlags';
import { Lock, ShieldAlert, CheckCircle, Wallet, Info } from 'lucide-react';

export const AdminPayments: React.FC = () => {
  const flags = getFeatureFlags();

  return (
    <div className="space-y-6">
      <div className="border-b border-zinc-800 pb-4">
        <h2 className="font-['Teko'] text-3xl font-bold uppercase text-white tracking-wider">
          Payment Gateway Operations (Gated)
        </h2>
        <p className="text-zinc-400 text-xs">
          Status of external payment gateways and banking settlement integrations.
        </p>
      </div>

      {/* GATED NOTICE CARD */}
      <div className="bg-zinc-900 border-2 border-zinc-800 rounded-2xl p-6 sm:p-8 space-y-5">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Lock className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-['Teko'] text-2xl font-bold uppercase text-white">
              Online Payment Gateway Inactive (Safe Launch Default)
            </h3>
            <span className="text-xs font-mono font-bold text-amber-400">
              PAYMENTS_ENABLED = false • CASH_WALLET_ENABLED = false
            </span>
          </div>
        </div>

        <p className="text-xs text-zinc-300 leading-relaxed max-w-2xl">
          By strict design and launch policy, REDLINE PAID SCRIMS launches with <strong>100% free tournaments</strong>. No automated cash deposit, payment gateway, in-app wallet, or withdrawal mechanism is active. This eliminates banking compliance friction, avoids gateway fees, and ensures zero real-money risk for players.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 text-xs">
          <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800 space-y-1">
            <span className="font-bold text-zinc-200 uppercase block">Free Scrims Mode</span>
            <span className="text-zinc-400 text-[11px] block">
              Entry fee is permanently ₹0 for all launch season scrims.
            </span>
          </div>
          <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800 space-y-1">
            <span className="font-bold text-zinc-200 uppercase block">Prize Settlements</span>
            <span className="text-zinc-400 text-[11px] block">
              Handled manually and recorded in the Prize Distribution Desk via UPI UTR.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
