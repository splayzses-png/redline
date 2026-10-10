import React from 'react';
import { Shield } from 'lucide-react';

export const Privacy: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="border-b border-zinc-800 pb-6 space-y-2">
        <div className="flex items-center gap-2 text-rose-500 text-xs font-bold uppercase tracking-wider">
          <Shield className="w-4 h-4" />
          <span>User Data Protection</span>
        </div>
        <h1 className="font-['Teko'] text-4xl sm:text-5xl font-bold tracking-wide text-white uppercase">
          Privacy Policy
        </h1>
        <p className="text-zinc-400 text-sm">
          Last updated: October 2026 • In compliance with Indian IT Rules and Google Play Developer Policies.
        </p>
      </div>

      <div className="space-y-6 text-xs text-zinc-300 leading-relaxed bg-zinc-900/60 border border-zinc-800 p-6 rounded-2xl">
        <section className="space-y-2">
          <h2 className="text-sm font-bold text-white uppercase">1. Information We Collect</h2>
          <p>
            REDLINE PAID SCRIMS collects minimal information necessary to conduct esports tournaments:
          </p>
          <ul className="list-disc list-inside space-y-1 text-zinc-400">
            <li>Account credentials (email, optional mobile phone number for verification)</li>
            <li>In-game player identity (Free Fire numeric UID and In-Game Name)</li>
            <li>Booking records, match scores, and ranking history</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-bold text-white uppercase">2. Use of Data</h2>
          <p>
            Your Free Fire UID and IGN are displayed publicly on tournament rosters and leaderboards to enable transparent competition. We never sell or rent your personal contact information to third parties.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-bold text-white uppercase">3. Security and Storage</h2>
          <p>
            All application data is securely hosted with Google Cloud Firestore in the Mumbai region (asia-south1) and secured by zero-trust security rules.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-bold text-white uppercase">4. Data Deletion Requests</h2>
          <p>
            Players may request permanent deletion of their account and associated data by opening a ticket at our Support Desk.
          </p>
        </section>
      </div>
    </div>
  );
};
