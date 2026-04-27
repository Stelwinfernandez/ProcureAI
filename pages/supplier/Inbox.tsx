import React from 'react';
import { Factory, ArrowRight, Inbox as InboxIcon } from 'lucide-react';
import { useStore } from '../../lib/store';
import { navigate } from '../../lib/router';

const timeAgo = (ts: number) => {
  const s = Math.max(1, Math.floor((Date.now() - ts) / 1000));
  if (s < 60) return `${s}s ago`;
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  return `${Math.floor(s / 3600)}h ago`;
};

const Inbox: React.FC = () => {
  const store = useStore();
  const me = store.identity.supplier.companyName;
  const open = store.rfqs.filter((r) => r.status === 'open' || r.status === 'quoted');

  return (
    <div className="space-y-6">
      <div>
        <div className="text-xs text-cyan-400 font-semibold uppercase tracking-widest mb-2">Inbound RFQs</div>
        <h1 className="text-3xl font-bold text-white">Live lead inbox</h1>
        <p className="text-slate-400 text-sm mt-1">Pre-qualified RFQs from manufacturers. Respond fast to increase win rate.</p>
      </div>

      {open.length === 0 ? (
        <div className="glass-panel border border-white/5 rounded-2xl p-16 text-center">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-cyan-600/10 border border-cyan-500/20 flex items-center justify-center mb-6">
            <InboxIcon size={26} className="text-cyan-400" />
          </div>
          <h2 className="text-xl font-semibold text-white mb-2">No inbound RFQs yet</h2>
          <p className="text-slate-400 text-sm max-w-md mx-auto">
            Open the <button className="text-cyan-400 hover:underline" onClick={() => navigate('/app/m/snap')}>Manufacturer workspace</button> in another tab and snap a part. This inbox updates live.
          </p>
        </div>
      ) : (
        <div className="glass-panel border border-white/5 rounded-2xl overflow-hidden divide-y divide-slate-800/60">
          {open.map((r) => {
            const mine = store.quotes.find((q) => q.rfqId === r.id && q.supplier === me);
            const competing = store.quotes.filter((q) => q.rfqId === r.id).length;
            return (
              <button key={r.id} onClick={() => navigate(`/app/s/inbox/${r.id}`)} className="w-full px-5 py-4 flex items-center justify-between hover:bg-white/5 transition-colors text-left">
                <div className="flex items-center space-x-3 min-w-0">
                  <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 shrink-0">
                    <Factory size={16} />
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm text-white font-medium truncate">{r.part.name}</div>
                    <div className="text-xs text-slate-500 truncate">{r.id} &middot; {r.buyer} &middot; qty {r.quantity} &middot; {timeAgo(r.createdAt)}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3 shrink-0">
                  <span className={`text-[10px] uppercase tracking-wider font-semibold px-2 py-1 rounded border ${
                    r.urgency === 'emergency' ? 'border-red-500/40 bg-red-500/10 text-red-300' :
                    r.urgency === 'rush' ? 'border-amber-500/40 bg-amber-500/10 text-amber-300' :
                    'border-slate-600 bg-slate-700/30 text-slate-300'
                  }`}>{r.urgency}</span>
                  <span className="text-xs text-slate-500 hidden md:inline">{competing} quote{competing === 1 ? '' : 's'}</span>
                  {mine ? (
                    <span className="text-[10px] uppercase tracking-wider font-semibold px-2 py-1 rounded border border-cyan-500/30 bg-cyan-500/10 text-cyan-300">Quoted</span>
                  ) : (
                    <span className="text-[10px] uppercase tracking-wider font-semibold px-2 py-1 rounded border border-blue-500/30 bg-blue-500/10 text-blue-300">New</span>
                  )}
                  <ArrowRight size={14} className="text-slate-600" />
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Inbox;
