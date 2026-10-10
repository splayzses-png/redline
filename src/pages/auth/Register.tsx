import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Flame, Mail, Lock, User, Hash, Crosshair, AlertCircle, ArrowRight, Check } from 'lucide-react';

interface RegisterProps {
  onNavigate: (path: string) => void;
}

export const Register: React.FC<RegisterProps> = ({ onNavigate }) => {
  const { registerWithEmail } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [freeFireUid, setFreeFireUid] = useState('');
  const [freeFireIgn, setFreeFireIgn] = useState('');
  const [agreedAge, setAgreedAge] = useState(false);
  const [agreedFairPlay, setAgreedFairPlay] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    // Validate Free Fire numeric UID
    const numericRegex = /^\d{8,12}$/;
    if (!numericRegex.test(freeFireUid.trim())) {
      setErrorMsg('Free Fire UID must be an 8 to 12 digit numeric identifier found in your in-game profile.');
      return;
    }

    if (!agreedAge || !agreedFairPlay) {
      setErrorMsg('You must agree to the age requirement and strict mobile-only fair play terms.');
      return;
    }

    setLoading(true);
    const res = await registerWithEmail(
      email,
      password,
      displayName,
      freeFireUid,
      freeFireIgn
    );

    if (!res.success) {
      setErrorMsg(res.error || 'Failed to register account.');
    } else {
      onNavigate('/dashboard');
    }
    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12 space-y-6">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-rose-600 to-red-800 flex items-center justify-center mx-auto shadow-lg shadow-rose-900/30">
          <Flame className="w-7 h-7 text-white animate-pulse" />
        </div>
        <h1 className="font-['Teko'] text-4xl font-bold tracking-wide text-white uppercase">
          Create Player Profile
        </h1>
        <p className="text-zinc-400 text-xs">
          Join free tournaments, register squad slots, and compete for verified leaderboard ranks.
        </p>
      </div>

      <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl">
        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-red-950/40 border border-red-500/40 text-red-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="space-y-1.5">
            <label className="font-semibold text-zinc-300 uppercase tracking-wider block">
              Display Name
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                placeholder="Rohit Sharma"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-rose-500 text-xs"
              />
            </div>
          </div>

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
            <label className="font-semibold text-zinc-300 uppercase tracking-wider block">
              Password
            </label>
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

          <div className="pt-2 border-t border-zinc-800 space-y-3">
            <span className="text-[10px] text-rose-400 font-bold uppercase tracking-wider block">
              Free Fire Game Credentials (Required for Room Entry)
            </span>

            <div className="space-y-1.5">
              <label className="font-semibold text-zinc-300 uppercase tracking-wider block">
                Free Fire Numeric UID (8-12 Digits)
              </label>
              <div className="relative">
                <Hash className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder="e.g. 1092847192"
                  value={freeFireUid}
                  onChange={(e) => setFreeFireUid(e.target.value.replace(/\D/g, ''))}
                  className="w-full pl-9 pr-3 py-2.5 bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-rose-500 text-xs font-mono"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-zinc-300 uppercase tracking-wider block">
                Free Fire In-Game Name (IGN)
              </label>
              <div className="relative">
                <Crosshair className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder="e.g. RL・SNIPER99"
                  value={freeFireIgn}
                  onChange={(e) => setFreeFireIgn(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-rose-500 text-xs"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t border-zinc-800 text-[11px] text-zinc-400">
            <label className="flex items-start gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={agreedAge}
                onChange={(e) => setAgreedAge(e.target.checked)}
                className="mt-0.5 rounded border-zinc-700 bg-zinc-950 text-rose-600 focus:ring-0"
              />
              <span>I confirm I am 18 years or older or have parental consent to compete.</span>
            </label>
            <label className="flex items-start gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={agreedFairPlay}
                onChange={(e) => setAgreedFairPlay(e.target.checked)}
                className="mt-0.5 rounded border-zinc-700 bg-zinc-950 text-rose-600 focus:ring-0"
              />
              <span>I will play on native mobile only (strictly no emulators/hacks).</span>
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs uppercase tracking-wider transition shadow-lg shadow-rose-900/30 flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>{loading ? 'Creating Account...' : 'Complete Registration'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center pt-2 text-xs text-zinc-400">
          Already have an account?{' '}
          <button
            type="button"
            onClick={() => onNavigate('/login')}
            className="font-bold text-rose-400 hover:underline"
          >
            Sign In
          </button>
        </div>
      </div>
    </div>
  );
};
