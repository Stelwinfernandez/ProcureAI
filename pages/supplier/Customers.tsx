import React, { useMemo } from 'react';
import { Users, Factory, TrendingUp, Clock } from 'lucide-react';
import { ModuleHeader, Stat, Card } from '../../components/app/ModulePage';
import { useStore } from '../../lib/store';

const Customers: React.FC = () => {
  const store = useStore();
  const me = store.identity.supplier.companyName;

  const customers = useMemo(() => {
    const map = new Map<string, { orders: number; spend: number; lastOrderAt: number; facility: string }>();
    store.orders.filter((o) => o.supplier === me).forEach((o) => {
      const cur = map.get(o.buyer) ?? { orders: 0, spend: 0, lastOrderAt: 0, facility: o.facility };
      cur.orders += 1;
      cur.spend += o.total;
      cur.lastOrderAt = Math.max(cur.lastOrderAt, o.placedAt);
      map.set(o.buyer, cur);
    });
    return Array.from(map.entries()).sort((a, b) => b[1].spend - a[1].spend);
  }, [store.orders, me]);

  const totalRevenue = customers.reduce((a, [, v]) => a + v.spend, 0);

  return (
    <div className="space-y-6">
      <ModuleHeader
        icon={Users}
        iconBg="from-cyan-500/20 to-blue-500/20 border-cyan-500/30"
        iconColor="text-cyan-300"
        title="Customers"
        subtitle="Manufacturers who have awarded orders to you on the network."
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Stat label="Active accounts" value={customers.length} color="text-cyan-400" icon={Users} />
        <Stat label="Total revenue" value={`$${totalRevenue.toFixed(0)}`} color="text-emerald-400" icon={TrendingUp} />
        <Stat label="Avg account" value={`$${customers.length ? (totalRevenue / customers.length).toFixed(0) : 0}`} color="text-blue-400" icon={Factory} />
        <Stat label="Response SLA" value="4h" color="text-violet-400" icon={Clock} />
      </div>

      <Card title="Top accounts">
        {customers.length === 0 ? (
          <div className="py-10 text-center text-slate-500 text-sm">No customer wins yet.</div>
        ) : (
          <div className="divide-y divide-slate-800/60 -mx-5">
            {customers.map(([name, d]) => (
              <div key={name} className="px-5 py-4 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                    <Factory size={16} />
                  </div>
                  <div>
                    <div className="text-sm text-white font-medium">{name}</div>
                    <div className="text-xs text-slate-500">{d.facility} &middot; last order {new Date(d.lastOrderAt).toLocaleDateString()}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-white font-mono font-bold">${d.spend.toFixed(2)}</div>
                  <div className="text-[10px] text-slate-500">{d.orders} order{d.orders === 1 ? '' : 's'}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};

export default Customers;
