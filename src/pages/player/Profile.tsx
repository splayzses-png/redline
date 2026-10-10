import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { User, Hash, Crosshair, Mail, Phone, ShieldCheck, CheckCircle, AlertCircle, Save } from 'lucide-react';

export const Profile: React.FC = () => {
  const { currentUser, updateProfile } = useAuth();

  const [displayName, setDisplayName] = useState(currentUser?.displayName || '');
  const [freeFireUid, setFreeFireUid] = useState(currentUser?.freeFireUid || '');
  const [freeFireIgn, setFreeFireIgn] = useState(currentUser?.freeFireIgn || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  if (!currentUser) return null;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg(null);
    setErrorMsg(null);

    const numericRegex = /^\d{8,12}$/;
    if (!numericRegex.test(freeFireUid.trim())) {
      setErrorMsg('Free Fire UID must be an 8 to 12 digit numeric identifier found in your in-game profile.');
      return;
    }

    setSaving(true);
    const ok = await updateProfile({
      displayName: displayName.trim(),
      freeFireUid: freeFireUid.trim(),
      freeFireIgn: freeFireIgn.trim(),
      phone: phone.trim() || undefined,
    });

    if (ok) {
      setSuccessMsg('Player credentials updated successfully!');
    } else {
      setErrorMsg('Failed to update profile.');
    }
    setSaving(false);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="border-b border-zinc-800 pb-6 space-y-1">
        <h1 className="font-['Teko'] text-4xl font-bold uppercase text-white tracking-wide">
          Player Profile & In-Game Credentials
        </h1>
        <p className="text-zinc-400 text-xs">
          Your Free Fire credentials are used by match referees to grant entry to custom rooms and verify kill points.
        </p>
      </div>

      {successMsg && (
        <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle className="w-4 h-4 shrink-0 text-emerald-400" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-3.5 rounded-xl bg-red-950/40 border border-red-500/40 text-red-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-6 sm:p-8 space-y-6 text-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="font-semibold text-zinc-300 uppercase tracking-wider block">
              Display Name
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-rose-500 text-xs"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-zinc-300 uppercase tracking-wider block">
              Account Email (Read-only)
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                disabled
                value={currentUser.email}
                className="w-full pl-9 pr-3 py-2.5 bg-zinc-950/50 border border-zinc-800/80 rounded-lg text-zinc-500 text-xs cursor-not-allowed"
              />
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-zinc-800 space-y-4">
          <div className="flex items-center gap-2 text-rose-400 font-bold uppercase text-xs">
            <ShieldCheck className="w-4 h-4" />
            <span>Free Fire In-Game Identity</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="font-semibold text-zinc-300 uppercase tracking-wider block">
                Free Fire Numeric UID
              </label>
              <div className="relative">
                <Hash className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder="8-12 digits"
                  value={freeFireUid}
                  onChange={(e) => setFreeFireUid(e.target.value.replace(/\D/g, ''))}
                  className="w-full pl-9 pr-3 py-2.5 bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-200 font-mono text-xs focus:outline-none focus:border-rose-500"
                />
              </div>
              <span className="text-[10px] text-zinc-500 block">
                Must match your profile numeric UID in Free Fire.
              </span>
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
                  placeholder="e.g. RL・SNIPER"
                  value={freeFireIgn}
                  onChange={(e) => setFreeFireIgn(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-200 text-xs focus:outline-none focus:border-rose-500"
                />
              </div>
              <span className="text-[10px] text-zinc-500 block">
                Your visible username inside Free Fire.
              </span>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-zinc-800 space-y-4">
          <div className="space-y-1.5">
            <label className="font-semibold text-zinc-300 uppercase tracking-wider block">
              Contact Phone (+91)
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="tel"
                placeholder="+91 98765 43210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-200 text-xs focus:outline-none focus:border-rose-500"
              />
            </div>
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs uppercase tracking-wider transition flex items-center gap-2 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving...' : 'Save Changes'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
