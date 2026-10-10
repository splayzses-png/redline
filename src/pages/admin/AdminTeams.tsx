import React, { useState, useEffect } from 'react';
import { redlineStore } from '../../services/store';
import type { Team } from '../../types';
import { Users, Shield, Hash } from 'lucide-react';

export const AdminTeams: React.FC = () => {
  const [teams, setTeams] = useState<Team[]>([]);

  useEffect(() => {
    const update = () => setTeams(redlineStore.getTeams());
    update();
    return redlineStore.subscribe(update);
  }, []);

  return (
    <div className="space-y-6">
      <div className="border-b border-zinc-800 pb-4">
        <h2 className="font-['Teko'] text-3xl font-bold uppercase text-white tracking-wider">
          Clan & Squad Registry
        </h2>
        <p className="text-zinc-400 text-xs">
          Audit competitive esports rosters, squad tags, and member Free Fire accounts.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {teams.map((t) => (
          <div key={t.id} className="bg-zinc-900/80 border border-zinc-800 p-6 rounded-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center font-mono font-bold text-rose-400 text-sm">
                  {t.tag}
                </div>
                <div>
                  <h3 className="font-['Teko'] text-2xl font-bold text-white uppercase">{t.name}</h3>
                  <span className="text-[10px] text-zinc-500 font-mono">Captain: {t.captainIgn}</span>
                </div>
              </div>

              <span className="text-xs font-mono text-zinc-400 font-bold bg-zinc-950 px-2 py-1 rounded border border-zinc-800">
                {t.members.length} / 6
              </span>
            </div>

            <div className="space-y-1.5 pt-2 border-t border-zinc-800">
              <span className="text-[10px] uppercase font-bold text-zinc-500 block">Roster Lineup:</span>
              <div className="divide-y divide-zinc-800/60 text-xs">
                {t.members.map((m) => (
                  <div key={m.uid} className="py-1.5 flex items-center justify-between">
                    <span className="font-bold text-zinc-200">{m.freeFireIgn}</span>
                    <span className="font-mono text-zinc-500 text-[11px]">UID: {m.freeFireUid}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
