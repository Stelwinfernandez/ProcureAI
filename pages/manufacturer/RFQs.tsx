import React, { useMemo, useState } from 'react';
import { Camera, Plus, Sparkles, ShoppingCart, Factory, ArrowRight, Package } from 'lucide-react';
import { useStore } from '../../lib/store';
import { navigate } from '../../lib/router';

const timeAgo = (ts: number) => {
  const s = Math.max(1, Math.floor((Date.now() - ts) / 1000));
  if (s < 60) return `${s}s ago`;
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
};

const statusStyles: Record<string, string> = {
  open: 'border-blue-500/30 bg-blue-500/10 text-blue-300',
  quoted: 'border-cyan-500/30 bg-cyan-500/10 text-cyan-300',
  awarded: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300',
  closed: 'border-slate-500/30 bg-slate-500/10 text-slate-400',
};

const RFQs: React.FC = () => {
  const store = useStore();
  const [tab, setTab] = useState<'open' | 'history'>('open');

  const open = useMemo(() => store.rfqs.filter((r) => r.status === 'open' || r.status === 'quoted'), [store.rfqs]);
  const history = useMemo(() => store.rfqs.filter((r) => r.status === 'awarded' || r.status === 'closed'), [store.rfqs]);
  const list = tab === 'open' ? open : history;

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
        <div className="flex items-start space-x-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-500/20 to-emerald-500/20 border border-teal-500/30 flex items-center justify-center">
            <ShoppingCart size={20} className="text-teal-300" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Strategic RFQ Tracker</h1>
            <p className="text-slate-400 text-sm mt-1">Formal structured parts requests with side-by-side comparison.</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => navigate('/app/m/snap')}
            className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl border border-slate-700 hover:border-teal-500/40 bg-slate-900/60 hover:bg-slate-900 text-sm font-medium text-white transition-all"
          >
            <Camera size={14} className="text-teal-300" />
            <span>Snap &amp; Source</span>
          </button>
          <button
            onClick={() => navigate('/app/m/rfq/new')}
            className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl border border-slate-700 hover:border-blue-500/40 bg-slate-900/60 hover:bg-slate-900 text-sm font-medium text-white transition-all"
          >
            <Plus size={14} className="text-blue-300" />
            <span>Structured RFQ</span>
          </button>
          <button
            onClick={() => navigate('/app/m/agent')}
            className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 via-violet-600 to-fuchsia-600 hover:from-blue-500 hover:to-fuchsia-500 text-sm font-semibold text-white shadow-[0_0_25px_rgba(139,92,246,0.35)] transition-all"
          >
            <Sparkles size={14} />
            <span>AI Agent</span>
          </button>
        </div>
      </div>

      <div className="border-b border-slate-800 flex space-x-6">
        <button
          onClick={() => setTab('open')}
          className={`relative py-3 text-sm font-medium transition-colors ${tab === 'open' ? 'text-white' : 'text-slate-500 hover:text-slate-300'}`}
        >
          Open Requests ({open.length})
          {tab === 'open' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-teal-400"></div>}
        </button>
        <button
          onClick={() => setTab('history')}
          className={`relative py-3 text-sm font-medium transition-colors ${tab === 'history' ? 'text-white' : 'text-slate-500 hover:text-slate-300'}`}
        >
          History / Awarded ({history.length})
          {tab === 'history' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-teal-400"></div>}
        </button>
      </div>

      {list.length === 0 ? (
        <div className="glass-panel border border-white/5 rounded-2xl p-20 text-center">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-slate-800/60 flex items-center justify-center mb-4">
            <Package size={24} className="text-slate-500" />
          </div>
          <div className="text-slate-400 text-sm">{tab === 'open' ? 'No open RFQs found.' : 'No awarded RFQs yet.'}</div>
          {tab === 'open' && (
            <button onClick={() => navigate('/app/m/snap')} className="mt-6 text-sm text-teal-300 hover:text-teal-200">
              Start with Snap &amp; Source &rarr;
            </button>
          )}
        </div>
      ) : (
        <div className="glass-panel border border-white/5 rounded-2xl overflow-hidden">
          <div className="grid grid-cols-12 px-5 py-3 text-[10px] font-semibold uppercase tracking-widest text-slate-500 border-b border-slate-800 bg-slate-900/40">
            <div className="col-span-5">Part</div>
            <div className="col-span-2">Qty</div>
            <div className="col-span-2">Quotes</div>
            <div className="col-span-2">Status</div>
            <div className="col-span-1"></div>
          </div>
          <div className="divide-y divide-slate-800/60">
            {list.map((r) => {
              const qs = store.quotes.filter((q) => q.rfqId === r.id);
              const best = qs.reduce<number | null>((acc, q) => (acc === null || q.totalPrice < acc ? q.totalPrice : acc), null);
              return (
                <button
                  key={r.id}
                  onClick={() => navigate(`/app/m/rfqs/${r.id}`)}
                  className="w-full grid grid-cols-12 px-5 py-4 items-center hover:bg-white/5 transition-colors text-left"
                >
                  <div className="col-span-5 flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400">
                      <Factory size={16} />
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm text-white font-medium truncate">{r.part.name}</div>
                      <div className="text-xs text-slate-500">{r.id} &middot; {r.part.category} &middot; {timeAgo(r.createdAt)}</div>
                    </div>
                  </div>
                  <div className="col-span-2 text-sm text-slate-300">{r.quantity}</div>
                  <div className="col-span-2 text-sm">
                    <span className="text-white font-medium">{qs.length}</span>
                    {best !== null && <span className="text-slate-500 text-xs ml-2">best ${best.toFixed(2)}</span>}
                  </div>
                  <div className="col-span-2">
                    <span className={`text-[10px] uppercase tracking-wider font-semibold px-2 py-1 rounded border ${statusStyles[r.status]}`}>{r.status}</span>
                  </div>
                  <div className="col-span-1 text-right text-slate-600"><ArrowRight size={14} /></div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default RFQs;
