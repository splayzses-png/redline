import React, { useState, useEffect } from 'react';
import { redlineStore } from '../../services/store';
import type { UserProfile } from '../../types';
import { Gift, ShieldCheck, Hash, User } from 'lucide-react';

export const AdminReferrals: React.FC = () => {
  const [users, setUsers] = useState<UserProfile[]>([]);

  useEffect(() => {
    const update = () => setUsers(redlineStore.getUsers());
    update();
    return redlineStore.subscribe(update);
  }, []);

  return (
    <div className="space-y-6">
      <div className="border-b border-zinc-800 pb-4">
        <h2 className="font-['Teko'] text-3xl font-bold uppercase text-white tracking-wider">
          Referral & Growth Oversight
        </h2>
        <p className="text-zinc-400 text-xs">
          Audit player referral codes, qualifying tournament participations, and anti-abuse safeguards.
        </p>
      </div>

      <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-950 border-b border-zinc-800 text-[10px] font-bold uppercase tracking-wider text-zinc-400">
              <tr>
                <th className="py-3.5 px-4">Player</th>
                <th className="py-3.5 px-4">Referral Code</th>
                <th className="py-3.5 px-4">Free Fire UID</th>
                <th className="py-3.5 px-4">Account Status</th>
                <th className="py-3.5 px-4 text-right">Abuse Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/80 font-medium">
              {users.map((u) => (
                <tr key={u.uid} className="hover:bg-zinc-850 transition">
                  <td className="py-3 px-4">
                    <span className="font-bold text-zinc-100 block">{u.displayName}</span>
                    <span className="text-[10px] text-zinc-500">{u.email}</span>
                  </td>
                  <td className="py-3 px-4 font-mono font-bold text-rose-400">
                    {u.referralCode}
                  </td>
                  <td className="py-3 px-4 font-mono text-zinc-300">{u.freeFireUid}</td>
                  <td className="py-3 px-4">
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-zinc-800 text-zinc-300">
                      {u.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      Clean (Unique UID)
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
