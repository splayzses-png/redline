import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { redlineStore } from '../../services/store';
import type { Team, UserProfile } from '../../types';
import { Users, ArrowLeft, UserPlus, Hash, Shield, CheckCircle, AlertCircle, Trash2 } from 'lucide-react';

interface TeamDetailProps {
  teamId: string;
  onNavigate: (path: string) => void;
}

export const TeamDetail: React.FC<TeamDetailProps> = ({ teamId, onNavigate }) => {
  const { currentUser } = useAuth();
  const [team, setTeam] = useState<Team | null>(null);
  const [inviteUid, setInviteUid] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    const update = () => {
      const t = redlineStore.getTeam(teamId);
      setTeam(t || null);
    };
    update();
    return redlineStore.subscribe(update);
  }, [teamId]);

  if (!team || !currentUser) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h3 className="text-lg font-bold text-white">Squad Not Found</h3>
        <button
          type="button"
          onClick={() => onNavigate('/dashboard/teams')}
          className="text-xs text-rose-400 hover:underline flex items-center justify-center gap-1 mx-auto"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Teams
        </button>
      </div>
    );
  }

  const isCaptain = team.captainUid === currentUser.uid;

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    const targetUser = redlineStore.getUsers().find((u) => u.freeFireUid === inviteUid.trim());
    if (!targetUser) {
      setErrorMsg(`No player found with Free Fire UID "${inviteUid.trim()}". Make sure they have registered.`);
      return;
    }

    const res = redlineStore.addTeamMember(team.id, targetUser);
    if (!res.success) {
      setErrorMsg(res.error || 'Failed to add member.');
    } else {
      setSuccessMsg(`Player ${targetUser.freeFireIgn} successfully added to the squad roster!`);
      setInviteUid('');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <button
        type="button"
        onClick={() => onNavigate('/dashboard/teams')}
        className="text-xs font-bold text-zinc-400 hover:text-white uppercase tracking-wider flex items-center gap-1.5 transition"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Squads</span>
      </button>

      {/* TEAM BANNER */}
      <div className="bg-gradient-to-r from-zinc-900 via-zinc-900 to-rose-950/40 border border-zinc-800 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-zinc-800 border-2 border-rose-500/50 flex items-center justify-center font-mono font-bold text-rose-400 text-2xl shadow-lg">
            {team.tag}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-['Teko'] text-3xl sm:text-4xl font-bold uppercase text-white tracking-wide leading-none">
                {team.name}
              </h1>
              {isCaptain && (
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-rose-600/20 text-rose-400 border border-rose-500/30">
                  You are Captain
                </span>
              )}
            </div>
            <p className="text-xs text-zinc-400 mt-1">
              Official Roster • Max 6 Players (4 Main + 2 Substitutes)
            </p>
          </div>
        </div>

        <div className="text-right">
          <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider block">
            Roster Capacity
          </span>
          <span className="font-mono text-xl font-bold text-zinc-200">
            {team.members.length} / 6 Players
          </span>
        </div>
      </div>

      {errorMsg && (
        <div className="p-3.5 rounded-xl bg-red-950/40 border border-red-500/40 text-red-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
          <span>{errorMsg}</span>
        </div>
      )}

      {successMsg && (
        <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle className="w-4 h-4 shrink-0 text-emerald-400" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* ADD MEMBER FORM (CAPTAIN ONLY) */}
      {isCaptain && team.members.length < 6 && (
        <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center gap-2 text-rose-400 font-bold uppercase text-xs">
            <UserPlus className="w-4 h-4" />
            <span>Add Teammate to Roster</span>
          </div>

          <form onSubmit={handleAddMember} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Hash className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                placeholder="Enter teammate's registered Free Fire numeric UID (e.g. 4829104829)"
                value={inviteUid}
                onChange={(e) => setInviteUid(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-200 text-xs placeholder-zinc-500 focus:outline-none focus:border-rose-500 font-mono"
              />
            </div>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs uppercase tracking-wider transition shrink-0"
            >
              Add to Roster
            </button>
          </form>
          <span className="text-[11px] text-zinc-500 block">
            Tip: For testing, you can add demo player UID: <code className="bg-zinc-950 px-1 py-0.5 rounded text-zinc-300">4829104829</code>
          </span>
        </div>
      )}

      {/* ROSTER TABLE */}
      <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="p-4 bg-zinc-950 border-b border-zinc-800 flex items-center justify-between">
          <h3 className="font-['Teko'] text-xl font-bold uppercase text-white tracking-wider">
            Verified Lineup
          </h3>
          <span className="text-xs text-zinc-500">
            {team.members.length} members
          </span>
        </div>

        <div className="divide-y divide-zinc-800/80">
          {team.members.map((member, index) => (
            <div
              key={member.uid}
              className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs hover:bg-zinc-850 transition"
            >
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs font-bold text-zinc-500 w-6">
                  0{index + 1}
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-zinc-100 text-sm">{member.freeFireIgn}</span>
                    {member.role === 'captain' && (
                      <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-rose-600/20 text-rose-400 border border-rose-500/30">
                        Captain
                      </span>
                    )}
                  </div>
                  <span className="text-zinc-500 font-mono text-[11px]">
                    FF UID: {member.freeFireUid} • Name: {member.displayName}
                  </span>
                </div>
              </div>

              <div className="text-[11px] text-zinc-500">
                Joined: {new Date(member.joinedAt).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
