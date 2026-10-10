import React, { useState, useEffect } from 'react';
import { redlineStore } from '../../services/store';
import { useAuth } from '../../context/AuthContext';
import type { UserProfile } from '../../types';
import { Users, Search, ShieldAlert, CheckCircle, Ban } from 'lucide-react';

export const AdminUsers: React.FC = () => {
  const { currentUser } = useAuth();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const update = () => setUsers(redlineStore.getUsers());
    update();
    return redlineStore.subscribe(update);
  }, []);

  if (!currentUser) return null;

  const isOwner = currentUser.role === 'owner';

  const filtered = users.filter(
    (u) =>
      u.displayName.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.freeFireUid.includes(search) ||
      u.freeFireIgn.toLowerCase().includes(search.toLowerCase())
  );

  const toggleBan = (user: UserProfile) => {
    const newStatus = user.status === 'banned' ? 'active' : 'banned';
    redlineStore.saveUser({ ...user, status: newStatus });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-4">
        <div>
          <h2 className="font-['Teko'] text-3xl font-bold uppercase text-white tracking-wider">
            Player Account Directory
          </h2>
          <p className="text-zinc-400 text-xs">
            Audit player Free Fire UIDs, in-game nicknames, roles, and enforce fair-play suspension/bans.
          </p>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search Player, IGN or UID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-zinc-200 focus:outline-none focus:border-rose-500"
          />
        </div>
      </div>

      <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-950 border-b border-zinc-800 text-[10px] font-bold uppercase tracking-wider text-zinc-400">
              <tr>
                <th className="py-3.5 px-4">Player</th>
                <th className="py-3.5 px-4">Free Fire UID</th>
                <th className="py-3.5 px-4">IGN</th>
                <th className="py-3.5 px-4">Role</th>
                <th className="py-3.5 px-4">Account Status</th>
                <th className="py-3.5 px-4 text-right">Moderation Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/80 font-medium">
              {filtered.map((u) => (
                <tr key={u.uid} className="hover:bg-zinc-850 transition">
                  <td className="py-3 px-4">
                    <span className="font-bold text-zinc-100 block">{u.displayName}</span>
                    <span className="text-[10px] text-zinc-500">{u.email}</span>
                  </td>
                  <td className="py-3 px-4 font-mono text-zinc-300 font-bold">{u.freeFireUid}</td>
                  <td className="py-3 px-4 font-mono text-zinc-200">{u.freeFireIgn}</td>
                  <td className="py-3 px-4">
                    <span className="font-mono uppercase text-[10px] font-bold px-2 py-0.5 rounded bg-zinc-800 text-zinc-300">
                      {u.role}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                        u.status === 'active'
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : 'bg-red-500/20 text-red-400'
                      }`}
                    >
                      {u.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    {u.uid !== currentUser.uid && isOwner && (
                      <button
                        type="button"
                        onClick={() => toggleBan(u)}
                        className={`px-3 py-1 rounded text-[11px] font-bold uppercase transition ${
                          u.status === 'banned'
                            ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-500/40'
                            : 'bg-red-950/60 text-red-400 border border-red-500/40 hover:bg-red-900'
                        }`}
                      >
                        {u.status === 'banned' ? 'Reactivate' : 'Ban UID'}
                      </button>
                    )}
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
