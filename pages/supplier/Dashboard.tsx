import React from 'react';
import { Inbox, CheckCircle2, DollarSign, Target, Factory, ArrowRight, Package, Star, TrendingUp } from 'lucide-react';
import { Button } from '../../components/Button';
import { ModuleHeader, Stat, Card } from '../../components/app/ModulePage';
import { scorecardFor, useStore } from '../../lib/store';
import { navigate } from '../../lib/router';

const Dashboard: React.FC = () => {
  const store = useStore();
  const me = store.identity.supplier.companyName;
  const openRfqs = store.rfqs.filter((r) => r.status === 'open' || r.status === 'quoted');
  const myQuotes = store.quotes.filter((q) => q.supplier === me);
  const wins = store.orders.filter((o) => o.supplier === me);
  const revenue = wins.reduce((a, o) => a + o.total, 0);
  const supplier = store.suppliers.find((s) => s.name === me);
  const card = supplier ? scorecardFor(supplier, store) : null;
  const activeOrders = wins.filter((o) => o.status !== 'delivered' && o.status !== 'cancelled').length;

  return (
    <div className="space-y-6">
      <ModuleHeader
        icon={Factory}
        iconBg="from-cyan-500/20 to-blue-500/20 border-cyan-500/30"
        iconColor="text-cyan-300"
        title="Sales Pipeline"
        subtitle={`Welcome back, ${store.identity.supplier.contactName}. Live lead activity across the ProcureAI network.`}
        actions={
          <Button variant="secondary" onClick={() => navigate('/app/s/inbox')}>
            <Inbox size={14} className="mr-2" /> Inbound RFQs ({openRfqs.length})
          </Button>
        }
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Stat label="Open RFQs" value={openRfqs.length} color="text-cyan-400" icon={Inbox} />
        <Stat label="My quotes" value={myQuotes.length} color="text-blue-400" icon={Target} />
        <Stat label="Won orders" value={wins.length} color="text-emerald-400" icon={CheckCircle2} />
        <Stat label="Revenue" value={`$${revenue.toFixed(0)}`} color="text-violet-400" icon={DollarSign} />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2" title="Latest inbound RFQs" actions={<button onClick={() => navigate('/app/s/inbox')} className="text-xs text-cyan-300 hover:text-cyan-200">View all</button>}>
          <div className="divide-y divide-slate-800/60 -mx-5">
            {openRfqs.slice(0, 6).map((r) => {
              const mine = store.quotes.find((q) => q.rfqId === r.id && q.supplier === me);
              return (
                <button key={r.id} onClick={() => navigate(`/app/s/inbox/${r.id}`)}
                  className="w-full px-5 py-3 flex items-center justify-between hover:bg-white/5 transition-colors text-left">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400">
                      <Package size={16} />
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
              <div className="px-5 py-10 text-center text-slate-500 text-sm">No open RFQs. Snap one from the buyer side to populate.</div>
            )}
          </div>
        </Card>

        {card && (
          <Card title="Your scorecard" actions={<button onClick={() => navigate('/app/s/scorecard')} className="text-xs text-cyan-300 hover:text-cyan-200">Details</button>}>
            <div className="flex items-center space-x-1 mb-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star key={i} size={16} className={i <= Math.round(card.qualityScore) ? 'text-amber-400 fill-amber-400' : 'text-slate-700'} />
              ))}
              <span className="text-lg font-bold text-white ml-2">{card.qualityScore.toFixed(1)}</span>
            </div>
            <div className="space-y-2 pt-3 border-t border-slate-800 text-xs">
              <Row label="Win rate" value={`${Math.round(card.winRate * 100)}%`} />
              <Row label="On-time" value={`${Math.round(card.onTimeRate * 100)}%`} />
              <Row label="Active orders" value={`${activeOrders}`} />
              <Row label="Avg response" value={`${card.avgResponseMinutes.toFixed(1)}m`} icon={TrendingUp} />
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

const Row: React.FC<{ label: string; value: string; icon?: React.ComponentType<{ size?: number; className?: string }> }> = ({ label, value }) => (
  <div className="flex items-center justify-between">
    <span className="text-slate-400">{label}</span>
    <span className="text-white font-mono">{value}</span>
  </div>
);

export default Dashboard;
