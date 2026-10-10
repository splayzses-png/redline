import React, { useState, useEffect } from 'react';
import { redlineStore } from '../../services/store';
import { useAuth } from '../../context/AuthContext';
import type { UserProfile, UserRole } from '../../types';
import { UserCheck, Shield, Key, AlertCircle } from 'lucide-react';

export const AdminModerators: React.FC = () => {
  const { currentUser } = useAuth();
  const [users, setUsers] = useState<UserProfile[]>([]);

  useEffect(() => {
    const update = () => setUsers(redlineStore.getUsers());
    update();
    return redlineStore.subscribe(update);
  }, []);

  if (!currentUser) return null;

  const isOwner = currentUser.role === 'owner';

  const handleRoleChange = (targetUser: UserProfile, newRole: UserRole) => {
    if (!isOwner) return;
    redlineStore.saveUser({ ...targetUser, role: newRole });
  };

  const staff = users.filter((u) => u.role === 'owner' || u.role === 'moderator');
  const players = users.filter((u) => u.role === 'player');

  return (
    <div className="space-y-6">
      <div className="border-b border-zinc-800 pb-4">
        <h2 className="font-['Teko'] text-3xl font-bold uppercase text-white tracking-wider">
          Role-Based Access Control (RBAC) Desk
        </h2>
        <p className="text-zinc-400 text-xs">
          Manage platform administrators and tournament referees. Roles are assigned exclusively via trusted administrative tooling.
        </p>
      </div>

      {!isOwner && (
        <div className="p-3.5 bg-amber-950/30 border border-amber-800/40 rounded-xl text-amber-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-amber-400" />
          <span>Notice: Only the Owner account can elevate or revoke staff roles.</span>
        </div>
      )}

      {/* CURRENT STAFF TABLE */}
      <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="p-4 bg-zinc-950 border-b border-zinc-800 flex items-center justify-between text-xs">
          <span className="font-bold text-white uppercase">Appointed Staff & Moderators</span>
          <span className="text-zinc-500 font-mono">{staff.length} staff members</span>
        </div>

        <div className="divide-y divide-zinc-800/80 text-xs font-medium">
          {staff.map((u) => (
            <div key={u.uid} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-zinc-100">{u.displayName}</span>
                  <span
                    className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                      u.role === 'owner'
                        ? 'bg-rose-600 text-white'
                        : 'bg-zinc-800 text-rose-400 border border-rose-900/40'
                    }`}
                  >
                    {u.role}
                  </span>
                </div>
                <span className="text-zinc-500 text-[11px] font-mono">
                  Email: {u.email} • FF UID: {u.freeFireUid}
                </span>
              </div>

              {isOwner && u.uid !== currentUser.uid && (
                <div className="flex items-center gap-2">
                  <select
                    value={u.role}
                    onChange={(e) => handleRoleChange(u, e.target.value as UserRole)}
                    className="bg-zinc-950 border border-zinc-800 rounded-lg px-2.5 py-1 text-xs font-bold uppercase text-zinc-200"
                  >
                    <option value="moderator">Moderator</option>
                    <option value="player">Demote to Player</option>
                  </select>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* PROMOTE PLAYERS SECTION */}
      {isOwner && (
        <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="p-4 bg-zinc-950 border-b border-zinc-800 text-xs font-bold text-white uppercase">
            Promote Registered Player to Moderator
          </div>

          <div className="divide-y divide-zinc-800/80 text-xs">
            {players.slice(0, 5).map((p) => (
              <div key={p.uid} className="p-4 flex items-center justify-between gap-3">
                <div>
                  <span className="font-bold text-zinc-200">{p.displayName}</span>
                  <span className="text-[11px] text-zinc-500 block font-mono">
                    IGN: {p.freeFireIgn} (UID: {p.freeFireUid})
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => handleRoleChange(p, 'moderator')}
                  className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-[11px] font-bold uppercase"
                >
                  Make Moderator
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
