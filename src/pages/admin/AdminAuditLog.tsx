import React, { useState, useEffect } from 'react';
import { redlineStore } from '../../services/store';
import type { AuditLog } from '../../types';
import { FileText, Shield, Search } from 'lucide-react';

export const AdminAuditLog: React.FC = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const update = () => setLogs(redlineStore.getAuditLogs());
    update();
    return redlineStore.subscribe(update);
  }, []);

  const filtered = logs.filter(
    (l) =>
      l.action.toLowerCase().includes(search.toLowerCase()) ||
      l.actorDisplayName.toLowerCase().includes(search.toLowerCase()) ||
      l.details.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-4">
        <div>
          <h2 className="font-['Teko'] text-3xl font-bold uppercase text-white tracking-wider">
            Operational Audit Trail
          </h2>
          <p className="text-zinc-400 text-xs">
            Append-only immutable record of all administrative actions, room credential reveals, and prize settlements.
          </p>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search action or actor..."
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
                <th className="py-3.5 px-4">Timestamp</th>
                <th className="py-3.5 px-4">Action</th>
                <th className="py-3.5 px-4">Actor</th>
                <th className="py-3.5 px-4">Target</th>
                <th className="py-3.5 px-4">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/80 font-medium">
              {filtered.map((log) => (
                <tr key={log.id} className="hover:bg-zinc-850 transition">
                  <td className="py-3 px-4 font-mono text-zinc-500 text-[11px] whitespace-nowrap">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-mono font-bold text-rose-400 bg-rose-950/40 px-2 py-0.5 rounded text-[11px] border border-rose-900/40">
                      {log.action}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-bold text-zinc-200 block">{log.actorDisplayName}</span>
                    <span className="text-[10px] uppercase text-zinc-500 font-mono">
                      {log.actorRole}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono text-zinc-400 text-[11px]">
                    {log.targetType} / {log.targetId}
                  </td>
                  <td className="py-3 px-4 text-zinc-300 text-[11px] max-w-xs truncate">
                    {log.details}
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
