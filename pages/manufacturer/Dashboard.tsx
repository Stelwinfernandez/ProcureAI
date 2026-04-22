import React from 'react';
import { Camera, ShoppingCart, Clock, TrendingUp, Factory, ArrowRight, Package, Sparkles, AlertTriangle, Boxes } from 'lucide-react';
import { Button } from '../../components/Button';
import { ModuleHeader, Stat, Card } from '../../components/app/ModulePage';
import { useStore } from '../../lib/store';
import { navigate } from '../../lib/router';

const timeAgo = (ts: number) => {
  const s = Math.max(1, Math.floor((Date.now() - ts) / 1000));
  if (s < 60) return `${s}s ago`;
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
};

const Dashboard: React.FC = () => {
  const store = useStore();
  const openRfqs = store.rfqs.filter((r) => r.status === 'open' || r.status === 'quoted').length;
  const activeOrders = store.orders.filter((o) => o.status !== 'delivered' && o.status !== 'cancelled').length;
  const totalSpend = store.orders.reduce((a, o) => a + o.total, 0);
  const savings = store.orders.reduce((acc, o) => {
    const rfqQuotes = store.quotes.filter((q) => q.rfqId === o.rfqId);
    if (rfqQuotes.length < 2) return acc;
    const max = Math.max(...rfqQuotes.map((q) => q.totalPrice));
    return acc + Math.max(0, max - o.total);
  }, 0);

  const shortcuts = [
    { label: 'Snap & Source', icon: Camera, color: 'from-teal-500/20 to-emerald-500/20 border-teal-500/30 text-teal-300', path: '/app/m/snap' },
    { label: 'Ask AI Agent', icon: Sparkles, color: 'from-violet-500/20 to-fuchsia-500/20 border-violet-500/30 text-violet-300', path: '/app/m/agent' },
    { label: 'Smart Crib', icon: Boxes, color: 'from-blue-500/20 to-cyan-500/20 border-blue-500/30 text-cyan-300', path: '/app/m/crib' },
    { label: 'Risk Monitor', icon: AlertTriangle, color: 'from-red-500/20 to-orange-500/20 border-red-500/30 text-red-300', path: '/app/m/risk' },
  ];

  return (
    <div className="space-y-6">
      <ModuleHeader
        icon={Factory}
        title="Procurement Overview"
        subtitle={`Welcome back, ${store.identity.manufacturer.contactName}. Here is what's happening across your plant.`}
        actions={
          <Button onClick={() => navigate('/app/m/snap')}>
            <Camera size={14} className="mr-2" /> New RFQ
          </Button>
        }
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Stat label="Open RFQs" value={openRfqs} color="text-blue-400" icon={ShoppingCart} />
        <Stat label="Active orders" value={activeOrders} color="text-cyan-400" icon={Clock} />
        <Stat label="Spend to date" value={`$${totalSpend.toFixed(0)}`} color="text-white" icon={Factory} />
        <Stat label="Realized savings" value={`$${savings.toFixed(0)}`} color="text-emerald-400" icon={TrendingUp} />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {shortcuts.map((s) => (
          <button key={s.label} onClick={() => navigate(s.path)}
            className={`bg-gradient-to-br ${s.color} border rounded-xl p-5 text-left hover:brightness-110 transition-all`}>
            <s.icon size={20} className="mb-3" />
            <div className="text-sm font-semibold text-white">{s.label}</div>
            <div className="text-xs text-slate-400 mt-0.5 flex items-center"><span>Open</span><ArrowRight size={10} className="ml-1" /></div>
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2" title="Recent RFQs" actions={<button onClick={() => navigate('/app/m/rfqs')} className="text-xs text-teal-300 hover:text-teal-200">View all</button>}>
          <div className="divide-y divide-slate-800/60 -mx-5">
            {store.rfqs.slice(0, 6).map((r) => {
              const qs = store.quotes.filter((q) => q.rfqId === r.id);
              return (
                <button key={r.id} onClick={() => navigate(`/app/m/rfqs/${r.id}`)}
                  className="w-full px-5 py-3 flex items-center justify-between hover:bg-white/5 transition-colors text-left">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400">
                      <Package size={16} />
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
              <div className="px-5 py-10 text-center text-slate-500 text-sm">No RFQs yet — snap a part to get your first quotes.</div>
            )}
          </div>
        </Card>

        <Card title="Workflow">
          <ol className="space-y-3">
            {['Snap or describe', 'AI identifies & drafts RFQ', 'Broadcast to suppliers', 'Compare & award', '3-way match & pay'].map((step, i) => (
              <li key={i} className="flex items-start space-x-3">
                <div className="w-6 h-6 rounded-full bg-teal-500/20 border border-teal-500/40 text-teal-300 text-xs font-bold flex items-center justify-center shrink-0">{i + 1}</div>
                <span className="text-sm text-slate-300">{step}</span>
              </li>
            ))}
          </ol>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
