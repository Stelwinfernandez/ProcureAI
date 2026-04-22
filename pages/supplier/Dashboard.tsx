import React from 'react';
import { Inbox, CheckCircle2, DollarSign, Target, Factory, ArrowRight } from 'lucide-react';
import { Button } from '../../components/Button';
import { useStore } from '../../lib/store';
import { navigate } from '../../lib/router';

const SupplierDashboard: React.FC = () => {
  const store = useStore();
  const me = store.identity.supplier.companyName;
  const openRfqs = store.rfqs.filter((r) => r.status === 'open' || r.status === 'quoted');
  const myQuotes = store.quotes.filter((q) => q.supplier === me);
  const wins = store.orders.filter((o) => o.supplier === me);
  const revenue = wins.reduce((a, o) => a + o.total, 0);
  const winRate = myQuotes.length > 0 ? Math.round((wins.length / myQuotes.length) * 100) : 0;

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <div className="text-xs text-cyan-400 font-semibold uppercase tracking-widest mb-2">Supplier workspace</div>
          <h1 className="text-3xl font-bold text-white">Lead &amp; Quote Pipeline</h1>
          <p className="text-slate-400 text-sm mt-1">Welcome back, {store.identity.supplier.contactName} @ {me}.</p>
        </div>
        <Button variant="secondary" onClick={() => navigate('/app/s/inbox')}>
          <Inbox size={16} className="mr-2" /> Inbound RFQs ({openRfqs.length})
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Open RFQs', val: openRfqs.length, color: 'text-cyan-400', icon: Inbox },
          { label: 'My Quotes', val: myQuotes.length, color: 'text-blue-400', icon: Target },
          { label: 'Won Orders', val: wins.length, color: 'text-green-400', icon: CheckCircle2 },
          { label: 'Revenue', val: `$${revenue.toFixed(0)}`, color: 'text-violet-400', icon: DollarSign },
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
            <h2 className="text-sm font-semibold text-white">Latest Inbound RFQs</h2>
            <button onClick={() => navigate('/app/s/inbox')} className="text-xs text-cyan-400 hover:text-cyan-300">View all</button>
          </div>
          <div className="divide-y divide-slate-800/60">
            {openRfqs.slice(0, 6).map((r) => {
              const mine = store.quotes.find((q) => q.rfqId === r.id && q.supplier === me);
              return (
                <button key={r.id} onClick={() => navigate(`/app/s/inbox/${r.id}`)} className="w-full px-5 py-4 flex items-center justify-between hover:bg-white/5 transition-colors text-left">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400">
                      <Factory size={16} />
                    </div>
                    <div>
                      <div className="text-sm text-white font-medium">{r.part.name}</div>
                      <div className="text-xs text-slate-500">{r.id} &middot; {r.buyer} &middot; qty {r.quantity}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    {mine ? (
                      <span className="text-[10px] uppercase tracking-wider font-semibold px-2 py-1 rounded border border-cyan-500/30 bg-cyan-500/10 text-cyan-300">Quoted</span>
                    ) : (
                      <span className="text-[10px] uppercase tracking-wider font-semibold px-2 py-1 rounded border border-blue-500/30 bg-blue-500/10 text-blue-300">Open</span>
                    )}
                    <ArrowRight size={14} className="text-slate-600" />
                  </div>
                </button>
              );
            })}
            {openRfqs.length === 0 && (
              <div className="px-5 py-12 text-center text-slate-500 text-sm">No open RFQs right now. New requests appear here in real time.</div>
            )}
          </div>
        </div>

        <div className="glass-panel border border-white/5 rounded-xl p-6">
          <h2 className="text-sm font-semibold text-white mb-4">Performance</h2>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                <span>Win rate</span><span>{winRate}%</span>
              </div>
              <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-cyan-500 to-green-500" style={{ width: `${winRate}%` }}></div>
              </div>
            </div>
            <div className="text-xs text-slate-400 space-y-2 pt-4 border-t border-slate-800">
              <div className="flex items-center justify-between"><span>Quotes submitted</span><span className="text-white">{myQuotes.length}</span></div>
              <div className="flex items-center justify-between"><span>Orders won</span><span className="text-white">{wins.length}</span></div>
              <div className="flex items-center justify-between"><span>Revenue</span><span className="text-white font-mono">${revenue.toFixed(2)}</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupplierDashboard;
