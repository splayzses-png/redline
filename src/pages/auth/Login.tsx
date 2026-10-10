import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getFeatureFlags } from '../../config/featureFlags';
import { Flame, Mail, Lock, Phone, AlertCircle, ArrowRight, ShieldCheck } from 'lucide-react';

interface LoginProps {
  onNavigate: (path: string) => void;
}

export const Login: React.FC<LoginProps> = ({ onNavigate }) => {
  const { loginWithEmail, loginWithPhone, switchDemoRole } = useAuth();
  const flags = getFeatureFlags();

  const [authMode, setAuthMode] = useState<'email' | 'phone'>('email');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    if (authMode === 'email') {
      if (!email || !password) {
        setErrorMsg('Please enter both email and password.');
        setLoading(false);
        return;
      }
      const res = await loginWithEmail(email, password);
      if (!res.success) {
        setErrorMsg(res.error || 'Failed to sign in.');
      } else {
        onNavigate('/dashboard');
      }
    } else {
      const res = await loginWithPhone(phone, otp);
      if (!res.success) {
        setErrorMsg(res.error || 'Phone sign-in is currently unavailable.');
      } else {
        onNavigate('/dashboard');
      }
    }
    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 space-y-6">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-rose-600 to-red-800 flex items-center justify-center mx-auto shadow-lg shadow-rose-900/30">
          <Flame className="w-7 h-7 text-white animate-pulse" />
        </div>
        <h1 className="font-['Teko'] text-4xl font-bold tracking-wide text-white uppercase">
          Sign In to REDLINE
        </h1>
        <p className="text-zinc-400 text-xs">
          Access your tournament passes, squad rosters, and custom room credentials.
        </p>
      </div>

      <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl">
        {/* TAB SELECTOR */}
        <div className="grid grid-cols-2 gap-2 bg-zinc-950 p-1 rounded-xl border border-zinc-800 text-xs font-bold uppercase">
          <button
            type="button"
            onClick={() => {
              setAuthMode('email');
              setErrorMsg(null);
            }}
            className={`py-2 rounded-lg transition ${
              authMode === 'email' ? 'bg-rose-600 text-white' : 'text-zinc-400 hover:text-white'
            }`}
          >
            Email & Password
          </button>
          <button
            type="button"
            onClick={() => {
              setAuthMode('phone');
              setErrorMsg(null);
            }}
            className={`py-2 rounded-lg transition ${
              authMode === 'phone' ? 'bg-rose-600 text-white' : 'text-zinc-400 hover:text-white'
            }`}
          >
            Phone OTP
          </button>
        </div>

        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-red-950/40 border border-red-500/40 text-red-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {authMode === 'email' ? (
            <>
              <div className="space-y-1.5">
                <label className="font-semibold text-zinc-300 uppercase tracking-wider block">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    placeholder="player@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-rose-500 text-xs"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="font-semibold text-zinc-300 uppercase tracking-wider">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => onNavigate('/forgot-password')}
                    className="text-rose-400 hover:underline text-[11px]"
                  >
                    Forgot?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-rose-500 text-xs"
                  />
                </div>
              </div>
            </>
          ) : (
            <div className="space-y-3">
              {!flags.smsOtpEnabled && (
                <div className="p-3 bg-amber-950/30 border border-amber-800/40 rounded-xl text-[11px] text-amber-300 leading-relaxed">
                  Notice: SMS Phone OTP is held behind feature flag <code className="bg-zinc-950 px-1 py-0.5 rounded">SMS_OTP_ENABLED=false</code> by launch policy until SMS vendor billing is enabled by owner. Please use Email login.
                </div>
              )}
              <div className="space-y-1.5">
                <label className="font-semibold text-zinc-300 uppercase tracking-wider block">
                  Mobile Number (+91)
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    disabled={!flags.smsOtpEnabled}
                    placeholder="+91 98765 43210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-rose-500 text-xs disabled:opacity-50"
                  />
                </div>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs uppercase tracking-wider transition shadow-lg shadow-rose-900/30 flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* DEMO ACCOUNTS ONE-CLICK SELECTOR */}
        <div className="pt-4 border-t border-zinc-800/80 space-y-2">
          <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider block text-center">
            Or Click To Log In As Demo Account:
          </span>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => {
                switchDemoRole('player');
                onNavigate('/dashboard');
              }}
              className="p-2 rounded bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 text-[11px] font-bold uppercase text-center"
            >
              Player
            </button>
            <button
              type="button"
              onClick={() => {
                switchDemoRole('moderator');
                onNavigate('/admin');
              }}
              className="p-2 rounded bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 text-[11px] font-bold uppercase text-center"
            >
              Moderator
            </button>
            <button
              type="button"
              onClick={() => {
                switchDemoRole('owner');
                onNavigate('/admin');
              }}
              className="p-2 rounded bg-zinc-950 hover:bg-zinc-800 border border-rose-900/50 text-rose-400 text-[11px] font-bold uppercase text-center"
            >
              Owner
            </button>
          </div>
        </div>

        <div className="text-center pt-2 text-xs text-zinc-400">
          Don't have an account?{' '}
          <button
            type="button"
            onClick={() => onNavigate('/register')}
            className="font-bold text-rose-400 hover:underline"
          >
            Create Player Profile
          </button>
        </div>
      </div>
    </div>
  );
};
