import React, { useMemo, useState } from 'react';
import { Trophy, Factory, Truck, Search, Clock, CheckCircle2, PackageCheck, AlertCircle, DollarSign, ArrowRight, Package } from 'lucide-react';
import { useStore } from '../../lib/store';
import { navigate } from '../../lib/router';
import type { OrderStatus } from '../../lib/types';

const statusPillStyles: Record<OrderStatus, string> = {
  pending: 'border-slate-500/30 bg-slate-500/10 text-slate-300',
  confirmed: 'border-blue-500/30 bg-blue-500/10 text-blue-300',
  in_production: 'border-amber-500/30 bg-amber-500/10 text-amber-300',
  shipped: 'border-cyan-500/30 bg-cyan-500/10 text-cyan-300',
  delivered: 'border-green-500/30 bg-green-500/10 text-green-300',
  cancelled: 'border-red-500/30 bg-red-500/10 text-red-300',
};

const statusIcon: Record<OrderStatus, React.ComponentType<{ size?: number }>> = {
  pending: Clock,
  confirmed: CheckCircle2,
  in_production: Factory,
  shipped: Truck,
  delivered: PackageCheck,
  cancelled: AlertCircle,
};

const Wins: React.FC = () => {
  const store = useStore();
  const me = store.identity.supplier.companyName;
  const [q, setQ] = useState('');
  const [filter, setFilter] = useState<OrderStatus | 'all' | 'active'>('all');

  const wins = store.orders.filter((o) => o.supplier === me);

  const filtered = useMemo(() => {
    return wins.filter((o) => {
      if (filter === 'active' && (o.status === 'delivered' || o.status === 'cancelled')) return false;
      if (filter !== 'all' && filter !== 'active' && o.status !== filter) return false;
      if (q.trim()) {
        const needle = q.toLowerCase();
        return (
          o.id.toLowerCase().includes(needle) ||
          o.buyer.toLowerCase().includes(needle) ||
          o.lineItems.some((li) => li.description.toLowerCase().includes(needle))
        );
      }
      return true;
    });
  }, [wins, q, filter]);

  const revenue = wins.reduce((a, o) => a + o.total, 0);
  const active = wins.filter((o) => o.status !== 'delivered' && o.status !== 'cancelled').length;
  const outstandingInvoices = wins.filter((o) => o.invoiceStatus === 'invoiced').reduce((a, o) => a + o.total, 0);

  return (
    <div className="space-y-6">
      <div>
        <div className="text-xs text-cyan-400 font-semibold uppercase tracking-widest mb-2">Awarded orders</div>
        <h1 className="text-3xl font-bold text-white">Won orders</h1>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Total wins', val: wins.length, color: 'text-cyan-400', icon: Trophy },
          { label: 'Active', val: active, color: 'text-amber-400', icon: Factory },
          { label: 'Revenue', val: `$${revenue.toFixed(0)}`, color: 'text-green-400', icon: DollarSign },
          { label: 'Outstanding', val: `$${outstandingInvoices.toFixed(0)}`, color: 'text-violet-400', icon: DollarSign },
        ].map((s) => (
          <div key={s.label} className="glass-panel border border-white/5 p-4 rounded-xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-slate-400">{s.label}</span>
              <s.icon size={14} className="text-slate-500" />
            </div>
            <div className={`text-xl font-bold ${s.color}`}>{s.val}</div>
          </div>
        ))}
      </div>

      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search orders..."
            className="w-full bg-slate-800/50 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-white text-sm focus:outline-none focus:border-cyan-500"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {(['all', 'active', 'confirmed', 'in_production', 'shipped', 'delivered'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`text-xs whitespace-nowrap px-3 py-2 rounded-lg border transition-colors capitalize ${
                filter === f ? 'border-cyan-500/40 bg-cyan-500/10 text-cyan-300' : 'border-slate-700 bg-slate-800/30 text-slate-400 hover:text-white'
              }`}
            >
              {f.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {wins.length === 0 ? (
        <div className="glass-panel border border-white/5 rounded-2xl p-16 text-center">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-cyan-600/10 border border-cyan-500/20 flex items-center justify-center mb-6">
            <Trophy size={26} className="text-cyan-400" />
          </div>
          <h2 className="text-xl font-semibold text-white mb-2">No wins yet</h2>
          <p className="text-slate-400 text-sm max-w-md mx-auto">When a manufacturer accepts your quote, the order will show up here.</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="glass-panel border border-white/5 rounded-2xl p-12 text-center text-slate-500 text-sm">No orders match your filter.</div>
      ) : (
        <div className="glass-panel border border-white/5 rounded-2xl overflow-hidden divide-y divide-slate-800/60">
          {filtered.map((o) => {
            const Icon = statusIcon[o.status];
            return (
              <button
                key={o.id}
                onClick={() => navigate(`/app/s/orders/${o.id}`)}
                className="w-full px-5 py-4 flex items-center justify-between hover:bg-white/5 transition-colors text-left"
              >
                <div className="flex items-center space-x-3 min-w-0">
                  <div className="w-10 h-10 rounded-lg bg-green-500/10 border border-green-500/20 flex items-center justify-center text-green-400 shrink-0">
                    <Package size={16} />
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm text-white font-medium truncate">{o.lineItems[0]?.description ?? 'Order'}</div>
                    <div className="text-xs text-slate-500 truncate">{o.id} &middot; {o.buyer} &middot; ETA {o.eta}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-4 shrink-0">
                  <span className={`inline-flex items-center space-x-1.5 text-[10px] uppercase tracking-wider font-semibold px-2 py-1 rounded border ${statusPillStyles[o.status]}`}>
                    <Icon size={10} /><span>{o.status.replace('_', ' ')}</span>
                  </span>
                  <div className="text-right">
                    <div className="text-sm text-white font-bold font-mono">${o.total.toFixed(2)}</div>
                    <div className="text-[10px] text-slate-500 capitalize">{o.invoiceStatus}</div>
                  </div>
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

export default Wins;
