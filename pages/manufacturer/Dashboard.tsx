import React from 'react';
import { Camera, Mail, Clock, TrendingUp, Factory, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Button } from '../../components/Button';
import { useStore } from '../../lib/store';
import { navigate } from '../../lib/router';

const timeAgo = (ts: number) => {
  const s = Math.max(1, Math.floor((Date.now() - ts) / 1000));
  if (s < 60) return `${s}s ago`;
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
};

const ManufacturerDashboard: React.FC = () => {
  const store = useStore();
  const openRfqs = store.rfqs.filter((r) => r.status === 'open').length;
  const quotedRfqs = store.rfqs.filter((r) => r.status === 'quoted').length;
  const pendingQuotes = store.quotes.filter((q) => {
    const r = store.rfqs.find((x) => x.id === q.rfqId);
    return r && r.status === 'quoted';
  }).length;

  const savings = store.orders.reduce((acc, o) => {
    const rfqQuotes = store.quotes.filter((q) => q.rfqId === o.rfqId);
    if (rfqQuotes.length < 2) return acc;
    const max = Math.max(...rfqQuotes.map((q) => q.totalPrice));
    return acc + Math.max(0, max - o.total);
  }, 0);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <div className="text-xs text-blue-400 font-semibold uppercase tracking-widest mb-2">Manufacturer workspace</div>
          <h1 className="text-3xl font-bold text-white">Procurement Overview</h1>
          <p className="text-slate-400 text-sm mt-1">Welcome back, {store.identity.manufacturer.contactName}.</p>
        </div>
        <Button onClick={() => navigate('/app/m/snap')}>
          <Camera size={16} className="mr-2" />
          Snap a part
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Open RFQs', val: openRfqs, color: 'text-blue-400', icon: Mail },
          { label: 'Pending Quotes', val: pendingQuotes, color: 'text-cyan-400', icon: Clock },
          { label: 'Orders', val: store.orders.length, color: 'text-violet-400', icon: Factory },
          { label: 'Est. Savings', val: `$${savings.toFixed(0)}`, color: 'text-green-400', icon: TrendingUp },
        ].map((s) => (
          <div key={s.label} className="glass-panel border border-white/5 p-5 rounded-xl">
            <div className="flex justify-between items-start mb-3">
              <span className="text-xs text-slate-400 font-medium">{s.label}</span>
              <s.icon size={14} className="text-slate-500" />
            </div>
            <div className={`text-2xl font-bold ${s.color}`}>{s.val}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-panel border border-white/5 rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-white">Recent RFQs</h2>
            <button onClick={() => navigate('/app/m/rfqs')} className="text-xs text-blue-400 hover:text-blue-300">View all</button>
          </div>
          <div className="divide-y divide-slate-800/60">
            {store.rfqs.slice(0, 6).map((r) => {
              const qs = store.quotes.filter((q) => q.rfqId === r.id);
              return (
                <button
                  key={r.id}
                  onClick={() => navigate(`/app/m/rfqs/${r.id}`)}
                  className="w-full px-5 py-4 flex items-center justify-between hover:bg-white/5 transition-colors text-left"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400">
                      <Factory size={16} />
                    </div>
                    <div>
                      <div className="text-sm text-white font-medium">{r.part.name}</div>
                      <div className="text-xs text-slate-500">{r.id} &middot; qty {r.quantity} &middot; {timeAgo(r.createdAt)}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-xs px-2 py-1 rounded border border-blue-500/20 bg-blue-500/10 text-blue-300">
                      {qs.length} quote{qs.length === 1 ? '' : 's'}
                    </span>
                    <ArrowRight size={14} className="text-slate-600" />
                  </div>
                </button>
              );
            })}
            {store.rfqs.length === 0 && (
              <div className="px-5 py-12 text-center text-slate-500 text-sm">
                No RFQs yet &mdash; snap a part to get your first quotes rolling in.
              </div>
            )}
          </div>
        </div>

        <div className="glass-panel border border-white/5 rounded-xl p-6">
          <h2 className="text-sm font-semibold text-white mb-4">How it works</h2>
          <ol className="space-y-4">
            {[
              'Snap a photo of the part you need.',
              'Gemini identifies the part and suggests SKUs.',
              'Confirm the RFQ and we broadcast it to suppliers.',
              'Compare quotes ranked by price, lead time, and stock.',
            ].map((step, i) => (
              <li key={i} className="flex items-start space-x-3">
                <div className="w-6 h-6 rounded-full bg-blue-500/20 border border-blue-500/40 text-blue-400 text-xs font-bold flex items-center justify-center shrink-0">{i + 1}</div>
                <span className="text-sm text-slate-300">{step}</span>
              </li>
            ))}
          </ol>
          <div className="mt-6 pt-6 border-t border-slate-800">
            <div className="flex items-start space-x-2 text-xs text-slate-400">
              <CheckCircle2 size={14} className="text-green-400 shrink-0 mt-0.5" />
              <span>Network of 6+ major distributors &amp; 200 regional suppliers.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManufacturerDashboard;
