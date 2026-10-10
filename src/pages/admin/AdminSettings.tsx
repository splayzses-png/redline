import React, { useState, useEffect } from 'react';
import { getFeatureFlags, updateFeatureFlag, type FeatureFlags } from '../../config/featureFlags';
import { testConnection, isFirebaseConfigured } from '../../firebase/config';
import { redlineStore } from '../../services/store';
import { Sliders, ShieldCheck, Database, RefreshCw, AlertTriangle, CheckCircle, Info } from 'lucide-react';

export const AdminSettings: React.FC = () => {
  const [flags, setFlags] = useState<FeatureFlags>(getFeatureFlags());
  const [firebaseStatus, setFirebaseStatus] = useState<{ checked: boolean; success: boolean; message: string }>({
    checked: false,
    success: false,
    message: '',
  });
  const [testingFirebase, setTestingFirebase] = useState(false);

  const handleToggleFlag = <K extends keyof FeatureFlags>(key: K) => {
    const newVal = !flags[key];
    updateFeatureFlag(key, newVal as any);
    setFlags(getFeatureFlags());
  };

  const handleCheckFirebase = async () => {
    setTestingFirebase(true);
    const res = await testConnection();
    setFirebaseStatus({ checked: true, success: res.success, message: res.message });
    setTestingFirebase(false);
  };

  const handleResetStore = () => {
    if (window.confirm('Reset all store data back to clean initial demo seed fixtures?')) {
      redlineStore.resetToDefaults();
      window.location.reload();
    }
  };

  return (
    <div className="space-y-8">
      <div className="border-b border-zinc-800 pb-4">
        <h2 className="font-['Teko'] text-3xl font-bold uppercase text-white tracking-wider">
          Platform Settings & Feature Flags
        </h2>
        <p className="text-zinc-400 text-xs">
          Manage launch constraints, third-party notification adapters, and inspect live Firebase connectivity.
        </p>
      </div>

      {/* FIREBASE & RUNTIME DIAGNOSTICS */}
      <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-6 space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-rose-600/20 text-rose-500 border border-rose-500/30">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white uppercase">
                Firebase Firestore & Identity Engine
              </h3>
              <p className="text-xs text-zinc-400">
                Preferred Region: Mumbai (<code>asia-south1</code>) • Dual-mode live/sandbox adapter
              </p>
            </div>
          </div>

          <button
            type="button"
            disabled={testingFirebase}
            onClick={handleCheckFirebase}
            className="px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-bold uppercase transition flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${testingFirebase ? 'animate-spin' : ''}`} />
            <span>{testingFirebase ? 'Testing Connection...' : 'Test Firestore Ping'}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="bg-zinc-950 p-3.5 rounded-xl border border-zinc-800 space-y-1">
            <span className="text-[10px] text-zinc-500 font-bold uppercase block">Adapter Mode</span>
            <span className="font-bold text-emerald-400 font-mono">
              {isFirebaseConfigured ? 'Live Firebase Client Connected' : 'High-Fidelity Persistent Sandbox'}
            </span>
          </div>

          <div className="bg-zinc-950 p-3.5 rounded-xl border border-zinc-800 space-y-1">
            <span className="text-[10px] text-zinc-500 font-bold uppercase block">Security Rules</span>
            <span className="font-bold text-zinc-200 font-mono">
              firestore.rules (8 Pillars Hardened)
            </span>
          </div>

          <div className="bg-zinc-950 p-3.5 rounded-xl border border-zinc-800 space-y-1">
            <span className="text-[10px] text-zinc-500 font-bold uppercase block">Target Deployment</span>
            <span className="font-bold text-zinc-200 font-mono">
              Vercel Edge + Capacitor Android APK
            </span>
          </div>
        </div>

        {firebaseStatus.checked && (
          <div
            className={`p-3.5 rounded-xl border text-xs flex items-center gap-2 ${
              firebaseStatus.success
                ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                : 'bg-amber-950/40 border-amber-500/40 text-amber-300'
            }`}
          >
            {firebaseStatus.success ? (
              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <Info className="w-4 h-4 text-amber-400 shrink-0" />
            )}
            <span>{firebaseStatus.message}</span>
          </div>
        )}
      </div>

      {/* FEATURE FLAGS TABLE */}
      <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="p-4 bg-zinc-950 border-b border-zinc-800 flex items-center justify-between text-xs">
          <div>
            <h3 className="font-bold text-white uppercase">Launch Feature Flags</h3>
            <span className="text-zinc-500 text-[11px]">
              Toggles reflect environment variable configuration with local override capability.
            </span>
          </div>
        </div>

        <div className="divide-y divide-zinc-800/80 text-xs font-medium">
          {[
            {
              key: 'freeTournamentsEnabled' as const,
              label: 'Free Tournaments Enabled',
              desc: 'Allows users to register for tournaments without any entry fee.',
              isSafeLaunch: true,
            },
            {
              key: 'paidTournamentsEnabled' as const,
              label: 'Paid Tournaments Enabled',
              desc: 'Enables paid registration fees (Must remain disabled for free launch).',
              isSafeLaunch: false,
            },
            {
              key: 'paymentsEnabled' as const,
              label: 'Online Payment Gateway Active',
              desc: 'Connects third-party payment gateway for in-app collections.',
              isSafeLaunch: false,
            },
            {
              key: 'cashWalletEnabled' as const,
              label: 'Cash Wallet & Deposits',
              desc: 'Enables user cash deposits and balances.',
              isSafeLaunch: false,
            },
            {
              key: 'automatedPayoutsEnabled' as const,
              label: 'Automated Payouts',
              desc: 'Automates prize disbursement via banking APIs.',
              isSafeLaunch: false,
            },
            {
              key: 'smsOtpEnabled' as const,
              label: 'SMS Phone OTP Auth',
              desc: 'Enables live Firebase SMS authentication (Requires SMS credits).',
              isSafeLaunch: false,
            },
            {
              key: 'whatsappNotificationsEnabled' as const,
              label: 'WhatsApp Notification Dispatch',
              desc: 'Dispatches custom room alerts through WhatsApp Business API.',
              isSafeLaunch: false,
            },
            {
              key: 'inAppNotificationsEnabled' as const,
              label: 'In-App Notification Center',
              desc: 'Broadcasts room releases and match updates inside the app.',
              isSafeLaunch: true,
            },
            {
              key: 'referralsEnabled' as const,
              label: 'Referral Program Active',
              desc: 'Permits players to share codes and claim squad referral badges.',
              isSafeLaunch: true,
            },
            {
              key: 'publicRegistrationEnabled' as const,
              label: 'Public Account Registration',
              desc: 'Allows new players to create accounts without an invite code.',
              isSafeLaunch: true,
            },
          ].map((item) => {
            const isEnabled = flags[item.key];

            return (
              <div
                key={item.key}
                className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-zinc-850 transition"
              >
                <div className="space-y-0.5 max-w-xl">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-zinc-100">{item.label}</span>
                    <span className="font-mono text-[10px] text-zinc-500 bg-zinc-950 px-1.5 py-0.5 rounded border border-zinc-800">
                      {item.key}
                    </span>
                  </div>
                  <p className="text-zinc-400 text-[11px]">{item.desc}</p>
                </div>

                <button
                  type="button"
                  onClick={() => handleToggleFlag(item.key)}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold uppercase transition flex items-center gap-2 self-start sm:self-auto cursor-pointer ${
                    isEnabled
                      ? 'bg-emerald-600 text-white shadow'
                      : 'bg-zinc-800 text-zinc-400 hover:text-white'
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      isEnabled ? 'bg-white' : 'bg-zinc-500'
                    }`}
                  />
                  <span>{isEnabled ? 'ACTIVE' : 'DISABLED'}</span>
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* DANGEROUS ACTIONS / RESET */}
      <div className="bg-red-950/20 border border-red-900/40 rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h4 className="text-sm font-bold text-red-300 uppercase">
            Reset Data Fixtures to Clean State
          </h4>
          <p className="text-xs text-zinc-400">
            Resets all local store items back to clean initial development seed fixtures.
          </p>
        </div>

        <button
          type="button"
          onClick={handleResetStore}
          className="px-5 py-2.5 rounded-lg bg-red-950 hover:bg-red-900 text-red-300 border border-red-700/50 font-bold text-xs uppercase transition shrink-0 cursor-pointer"
        >
          Reset Store Defaults
        </button>
      </div>
    </div>
  );
};
