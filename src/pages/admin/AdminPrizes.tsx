import React, { useState, useEffect } from 'react';
import { redlineStore } from '../../services/store';
import { useAuth } from '../../context/AuthContext';
import type { PrizeRecord } from '../../types';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Wallet, CheckCircle, Clock, Check, AlertCircle, Hash } from 'lucide-react';

export const AdminPrizes: React.FC = () => {
  const { currentUser } = useAuth();
  const [prizes, setPrizes] = useState<PrizeRecord[]>([]);
  const [settlingPrizeId, setSettlingPrizeId] = useState<string | null>(null);
  const [paymentRef, setPaymentRef] = useState('');
  const [adminNotes, setAdminNotes] = useState('');
  const [msg, setMsg] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);

  useEffect(() => {
    const update = () => setPrizes(redlineStore.getPrizes());
    update();
    return redlineStore.subscribe(update);
  }, []);

  if (!currentUser) return null;

  const isOwner = currentUser.role === 'owner';

  const handleSettle = (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(null);

    if (!settlingPrizeId) return;
    if (!paymentRef.trim()) {
      setMsg({ type: 'err', text: 'Payment reference (UPI Transaction ID) is required.' });
      return;
    }

    const res = redlineStore.settlePrize(
      settlingPrizeId,
      paymentRef.trim(),
      adminNotes.trim(),
      currentUser
    );

    if (res.success) {
      setMsg({ type: 'ok', text: 'Prize record marked as settled and logged to audit trail!' });
      setSettlingPrizeId(null);
      setPaymentRef('');
      setAdminNotes('');
    } else {
      setMsg({ type: 'err', text: res.error || 'Failed to settle prize.' });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-4">
        <div>
          <h2 className="font-['Teko'] text-3xl font-bold uppercase text-white tracking-wider">
            Prize Distribution & Settlements
          </h2>
          <p className="text-zinc-400 text-xs">
            Audit tournament rewards and record manual out-of-band settlements (UPI/IMPS reference numbers).
          </p>
        </div>

        {!isOwner && (
          <span className="text-xs text-amber-400 bg-amber-950/40 border border-amber-800/40 px-3 py-1.5 rounded-lg">
            Note: Payout authorization is restricted to Owner role
          </span>
        )}
      </div>

      {msg && (
        <div
          className={`p-3.5 rounded-xl border text-xs flex items-center gap-2 ${
            msg.type === 'ok'
              ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
              : 'bg-red-950/40 border-red-500/40 text-red-300'
          }`}
        >
          {msg.type === 'ok' ? (
            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
          )}
          <span>{msg.text}</span>
        </div>
      )}

      {/* SETTLE MODAL */}
      {settlingPrizeId && (
        <div className="bg-zinc-900 border-2 border-emerald-500/40 rounded-2xl p-5 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-white uppercase flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              <span>Record Manual Payment Settlement</span>
            </h4>
            <button
              type="button"
              onClick={() => setSettlingPrizeId(null)}
              className="text-xs text-zinc-400 hover:text-white"
            >
              Cancel
            </button>
          </div>

          <form onSubmit={handleSettle} className="space-y-3 text-xs">
            <div className="space-y-1">
              <label className="font-semibold text-zinc-300 uppercase block">
                Payment Reference (e.g. UPI Ref # or IMPS UTR)
              </label>
              <input
                type="text"
                required
                placeholder="e.g. UPI Ref 928371829102 / GPay"
                value={paymentRef}
                onChange={(e) => setPaymentRef(e.target.value)}
                className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-200 font-mono text-xs focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-zinc-300 uppercase block">
                Internal Audit Note (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Paid to captain's verified PhonePe number"
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-200 text-xs focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setSettlingPrizeId(null)}
                className="px-4 py-2 rounded-lg bg-zinc-800 text-zinc-300 text-xs"
              >
                Dismiss
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase"
              >
                Confirm Settlement
              </button>
            </div>
          </form>
        </div>
      )}

      {/* PRIZES TABLE */}
      <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-950 border-b border-zinc-800 text-[10px] font-bold uppercase tracking-wider text-zinc-400">
              <tr>
                <th className="py-3.5 px-4">Winner / Player</th>
                <th className="py-3.5 px-4">Tournament Event</th>
                <th className="py-3.5 px-4 text-center">Rank</th>
                <th className="py-3.5 px-4">Amount</th>
                <th className="py-3.5 px-4">Status & Ref</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/80 font-medium">
              {prizes.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-zinc-500 text-xs">
                    No prize records generated yet. Finalize a tournament to create distribution records.
                  </td>
                </tr>
              ) : (
                prizes.map((p) => (
                  <tr key={p.id} className="hover:bg-zinc-850 transition">
                    <td className="py-3 px-4">
                      <div className="space-y-0.5">
                        <span className="font-bold text-zinc-100">{p.userDisplayName}</span>
                        <span className="text-[10px] text-zinc-500 font-mono block">
                          UID: {p.userId}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-zinc-300">{p.tournamentTitle}</td>
                    <td className="py-3 px-4 text-center font-mono font-bold text-amber-400">
                      #{p.rank}
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-emerald-400">
                      ₹{p.amountInr}
                    </td>
                    <td className="py-3 px-4">
                      <div className="space-y-1">
                        <StatusBadge status={p.status} size="sm" />
                        {p.manualPaymentReference && (
                          <span className="text-[10px] font-mono text-zinc-400 block truncate">
                            {p.manualPaymentReference}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right">
                      {p.status !== 'settled' ? (
                        <button
                          type="button"
                          disabled={!isOwner}
                          onClick={() => setSettlingPrizeId(p.id)}
                          className={`px-3 py-1.5 rounded-lg text-[11px] font-bold uppercase transition ${
                            isOwner
                              ? 'bg-emerald-600 hover:bg-emerald-500 text-white cursor-pointer'
                              : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                          }`}
                        >
                          Mark Settled
                        </button>
                      ) : (
                        <span className="text-emerald-400 font-semibold text-[11px] flex items-center justify-end gap-1">
                          <Check className="w-3.5 h-3.5" /> Settled
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
