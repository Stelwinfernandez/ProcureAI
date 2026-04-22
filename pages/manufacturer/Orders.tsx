import React, { useMemo, useState } from 'react';
import { Package, Factory, Truck, Search, Clock, CheckCircle2, PackageCheck, AlertCircle, DollarSign } from 'lucide-react';
import { Button } from '../../components/Button';
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

const Orders: React.FC = () => {
  const store = useStore();
  const [q, setQ] = useState('');
  const [filter, setFilter] = useState<OrderStatus | 'all' | 'active'>('all');

  const filtered = useMemo(() => {
    return store.orders.filter((o) => {
      if (filter === 'active' && (o.status === 'delivered' || o.status === 'cancelled')) return false;
      if (filter !== 'all' && filter !== 'active' && o.status !== filter) return false;
      if (q.trim()) {
        const needle = q.toLowerCase();
        return (
          o.id.toLowerCase().includes(needle) ||
          o.supplier.toLowerCase().includes(needle) ||
          o.lineItems.some((li) => li.description.toLowerCase().includes(needle) || li.sku.toLowerCase().includes(needle))
        );
      }
      return true;
    });
  }, [store.orders, q, filter]);

  const counts = useMemo(() => {
    const acc: Record<string, number> = { all: store.orders.length, active: 0 };
    store.orders.forEach((o) => {
      if (o.status !== 'delivered' && o.status !== 'cancelled') acc.active++;
      acc[o.status] = (acc[o.status] ?? 0) + 1;
    });
    return acc;
  }, [store.orders]);

  const totalSpend = store.orders.reduce((a, o) => a + o.total, 0);
  const openInvoices = store.orders.filter((o) => o.invoiceStatus !== 'paid').length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <div className="text-xs text-blue-400 font-semibold uppercase tracking-widest mb-2">Purchase orders</div>
          <h1 className="text-3xl font-bold text-white">Orders</h1>
          <p className="text-slate-400 text-sm mt-1">Track every PO from award to delivery.</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Total POs', val: store.orders.length, color: 'text-blue-400', icon: Package },
          { label: 'Active', val: counts.active, color: 'text-amber-400', icon: Factory },
          { label: 'Delivered', val: counts.delivered ?? 0, color: 'text-green-400', icon: PackageCheck },
          { label: 'Open invoices', val: openInvoices, color: 'text-violet-400', icon: DollarSign },
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
            placeholder="Search by PO, supplier, SKU, or part..."
            className="w-full bg-slate-800/50 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {(['all', 'active', 'pending', 'confirmed', 'in_production', 'shipped', 'delivered'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`text-xs whitespace-nowrap px-3 py-2 rounded-lg border transition-colors capitalize ${
                filter === f ? 'border-blue-500/40 bg-blue-500/10 text-blue-300' : 'border-slate-700 bg-slate-800/30 text-slate-400 hover:text-white'
              }`}
            >
              {f.replace('_', ' ')} {counts[f] !== undefined && <span className="text-slate-500 ml-1">{counts[f]}</span>}
            </button>
          ))}
        </div>
      </div>

      {store.orders.length === 0 ? (
        <div className="glass-panel border border-white/5 rounded-2xl p-16 text-center">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-slate-800 flex items-center justify-center mb-6">
            <Package size={26} className="text-slate-400" />
          </div>
          <h2 className="text-xl font-semibold text-white mb-2">No orders yet</h2>
          <p className="text-slate-400 text-sm mb-6 max-w-md mx-auto">Accept a supplier quote to turn it into a PO.</p>
          <Button onClick={() => navigate('/app/m/rfqs')}>View RFQs</Button>
        </div>
      ) : filtered.length === 0 ? (
        <div className="glass-panel border border-white/5 rounded-2xl p-12 text-center text-slate-500 text-sm">No orders match your filter.</div>
      ) : (
        <div className="glass-panel border border-white/5 rounded-2xl overflow-hidden">
          <div className="grid grid-cols-12 px-5 py-3 text-[10px] font-semibold uppercase tracking-widest text-slate-500 border-b border-slate-800 bg-slate-900/30">
            <div className="col-span-4">Order</div>
            <div className="col-span-2">Supplier</div>
            <div className="col-span-2">ETA</div>
            <div className="col-span-2">Status</div>
            <div className="col-span-2 text-right">Total</div>
          </div>
          <div className="divide-y divide-slate-800/60">
            {filtered.map((o) => {
              const Icon = statusIcon[o.status];
              return (
                <button
                  key={o.id}
                  onClick={() => navigate(`/app/m/orders/${o.id}`)}
                  className="w-full grid grid-cols-12 px-5 py-4 items-center hover:bg-white/5 transition-colors text-left"
                >
                  <div className="col-span-4 flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400">
                      <Package size={16} />
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm text-white font-medium truncate">{o.lineItems[0]?.description ?? 'Order'}</div>
                      <div className="text-xs text-slate-500">{o.id} &middot; placed {new Date(o.placedAt).toLocaleDateString()}</div>
                    </div>
                  </div>
                  <div className="col-span-2 text-sm text-slate-300">{o.supplier}</div>
                  <div className="col-span-2 text-sm text-slate-400">{o.eta}</div>
                  <div className="col-span-2">
                    <span className={`inline-flex items-center space-x-1.5 text-[10px] uppercase tracking-wider font-semibold px-2 py-1 rounded border ${statusPillStyles[o.status]}`}>
                      <Icon size={10} />
                      <span>{o.status.replace('_', ' ')}</span>
                    </span>
                  </div>
                  <div className="col-span-2 text-right">
                    <div className="text-sm text-white font-mono font-bold">${o.total.toFixed(2)}</div>
                    <div className="text-[10px] text-slate-500 capitalize">{o.invoiceStatus}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;
