import React, { useState } from 'react';
import { Mail, ArrowLeft, CheckCircle, Flame } from 'lucide-react';

interface ForgotPasswordProps {
  onNavigate: (path: string) => void;
}

export const ForgotPassword: React.FC<ForgotPasswordProps> = ({ onNavigate }) => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 space-y-6">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-rose-600 to-red-800 flex items-center justify-center mx-auto shadow-lg shadow-rose-900/30">
          <Flame className="w-7 h-7 text-white animate-pulse" />
        </div>
        <h1 className="font-['Teko'] text-4xl font-bold tracking-wide text-white uppercase">
          Reset Password
        </h1>
        <p className="text-zinc-400 text-xs">
          Enter your registered email address and we'll send you recovery instructions.
        </p>
      </div>

      <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl">
        {submitted ? (
          <div className="text-center space-y-4 py-4">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-white">Password Reset Link Dispatched</h3>
            <p className="text-xs text-zinc-400">
              We have dispatched a password reset link to <strong className="text-zinc-200">{email}</strong>. Please check your inbox and spam folders.
            </p>
            <button
              type="button"
              onClick={() => onNavigate('/login')}
              className="px-6 py-2.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs uppercase"
            >
              Return to Sign In
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="space-y-1.5">
              <label className="font-semibold text-zinc-300 uppercase tracking-wider block">
                Registered Email
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

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs uppercase tracking-wider transition shadow-lg shadow-rose-900/30 cursor-pointer"
            >
              Send Reset Instructions
            </button>
          </form>
        )}

        <div className="text-center pt-2">
          <button
            type="button"
            onClick={() => onNavigate('/login')}
            className="text-xs text-zinc-400 hover:text-white flex items-center justify-center gap-1.5 mx-auto"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Sign In</span>
          </button>
        </div>
      </div>
    </div>
  );
};
