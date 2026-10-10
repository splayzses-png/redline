import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { LifeBuoy, MessageSquare, HelpCircle, ChevronDown, ChevronUp, Send, CheckCircle } from 'lucide-react';

interface SupportProps {
  onNavigate: (path: string) => void;
}

export const Support: React.FC<SupportProps> = ({ onNavigate }) => {
  const { currentUser } = useAuth();
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: 'Where do I find my Custom Room ID and Password?',
      a: 'Once your registration is confirmed, your custom room credentials appear directly on your Booking Pass (and the tournament detail page) approximately 15-20 minutes before the scheduled match start time, after check-in begins.',
    },
    {
      q: 'Are these tournaments really free to join?',
      a: 'Yes, 100%! All daily scrims, squad battles, and weekly cups on REDLINE are free to enter during our public launch. There are no entry fees or hidden charges.',
    },
    {
      q: 'Can I play from a PC emulator (BlueStacks, LDPlayer)?',
      a: 'No. PC emulators are strictly banned. Only native Android and iOS mobile devices are permitted to participate.',
    },
    {
      q: 'How and when are prizes paid?',
      a: 'Match scores are audited by our referee team within 1-2 hours after the match concludes. Once finalized, prizes are recorded in the platform ledger, and our host transfers payouts directly to your UPI ID.',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <div className="border-b border-zinc-800 pb-6 space-y-2">
        <div className="flex items-center gap-2 text-rose-500 text-xs font-bold uppercase tracking-wider">
          <LifeBuoy className="w-4 h-4" />
          <span>Player Assistance Desk</span>
        </div>
        <h1 className="font-['Teko'] text-4xl sm:text-5xl font-bold tracking-wide text-white uppercase">
          Help & Support Center
        </h1>
        <p className="text-zinc-400 text-sm">
          Have an issue with your slot, match verification, or dispute? We are here to assist you.
        </p>
      </div>

      {/* DISPUTE / TICKET BANNER */}
      <div className="bg-gradient-to-r from-rose-950/40 via-zinc-900 to-zinc-900 border border-rose-900/30 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-2">
          <h3 className="font-['Teko'] text-2xl sm:text-3xl font-bold text-white uppercase">
            Have an Active Match Dispute or Question?
          </h3>
          <p className="text-xs text-zinc-300 max-w-xl">
            Submit a support ticket from your player dashboard with your match details or screenshot links. Our moderation team reviews all tickets in real time.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            if (currentUser) {
              onNavigate('/dashboard/support');
            } else {
              onNavigate('/login');
            }
          }}
          className="px-6 py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs uppercase tracking-wider transition shrink-0"
        >
          {currentUser ? 'Open Support Ticket' : 'Sign In to Submit Ticket'}
        </button>
      </div>

      {/* FAQS */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-zinc-200 font-bold uppercase text-sm">
          <HelpCircle className="w-4 h-4 text-rose-500" />
          <span>Frequently Asked Questions</span>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="bg-zinc-900/80 border border-zinc-800 rounded-xl overflow-hidden transition"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full text-left p-4 flex items-center justify-between gap-4 font-semibold text-xs text-zinc-200 hover:text-white"
                >
                  <span>{faq.q}</span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-rose-400 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-zinc-500 shrink-0" />
                  )}
                </button>
                {isOpen && (
                  <div className="px-4 pb-4 pt-1 text-xs text-zinc-400 border-t border-zinc-800/60 leading-relaxed">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
