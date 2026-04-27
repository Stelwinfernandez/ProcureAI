import React, { useMemo } from 'react';
import { PieChart, TrendingUp, TrendingDown, DollarSign, Factory, Clock } from 'lucide-react';
import { ModuleHeader, Stat, Card } from '../../components/app/ModulePage';
import { useStore } from '../../lib/store';

const CATEGORY_COLORS: Record<string, string> = {
  Bearings: 'bg-blue-500',
  Fasteners: 'bg-amber-500',
  Hydraulics: 'bg-violet-500',
  Pneumatics: 'bg-cyan-500',
  Electrical: 'bg-emerald-500',
  Safety: 'bg-red-500',
  Sanitation: 'bg-teal-500',
  'Power Transmission': 'bg-fuchsia-500',
  Tools: 'bg-orange-500',
};

const getColor = (c: string) => CATEGORY_COLORS[c] ?? 'bg-slate-500';

const SpendAnalytics: React.FC = () => {
  const store = useStore();

  const byCategory = useMemo(() => {
    const map = new Map<string, number>();
    store.orders.forEach((o) => {
      const rfq = store.rfqs.find((r) => r.id === o.rfqId);
      const cat = rfq?.part.category ?? 'Other';
      map.set(cat, (map.get(cat) ?? 0) + o.total);
    });
    return Array.from(map.entries()).sort((a, b) => b[1] - a[1]);
  }, [store.orders, store.rfqs]);

  const bySupplier = useMemo(() => {
    const map = new Map<string, { spend: number; orders: number }>();
    store.orders.forEach((o) => {
      const cur = map.get(o.supplier) ?? { spend: 0, orders: 0 };
      cur.spend += o.total;
      cur.orders += 1;
      map.set(o.supplier, cur);
    });
    return Array.from(map.entries()).sort((a, b) => b[1].spend - a[1].spend);
  }, [store.orders]);

  const totalSpend = store.orders.reduce((a, o) => a + o.total, 0);
  const totalQuotes = store.quotes.length;
  const savings = store.orders.reduce((acc, o) => {
    const rfqQuotes = store.quotes.filter((q) => q.rfqId === o.rfqId);
    if (rfqQuotes.length < 2) return acc;
    const max = Math.max(...rfqQuotes.map((q) => q.totalPrice));
    return acc + Math.max(0, max - o.total);
  }, 0);
  const avgOrder = store.orders.length ? totalSpend / store.orders.length : 0;
  const categoryTotal = byCategory.reduce((a, [, v]) => a + v, 0);

  return (
    <div className="space-y-6">
      <ModuleHeader
        icon={PieChart}
        title="Spend Analytics"
        subtitle="Category & supplier spend visibility across the MRO portfolio."
        iconBg="from-violet-500/20 to-fuchsia-500/20 border-violet-500/30"
        iconColor="text-violet-300"
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Stat label="Total spend" value={`$${totalSpend.toFixed(2)}`} color="text-white" icon={DollarSign} sub="across all POs" />
        <Stat label="Realized savings" value={`$${savings.toFixed(2)}`} color="text-emerald-400" icon={TrendingDown} sub="vs. highest quote" />
        <Stat label="Avg order value" value={`$${avgOrder.toFixed(2)}`} color="text-blue-400" icon={TrendingUp} />
        <Stat label="Quotes processed" value={totalQuotes} color="text-cyan-400" icon={Factory} />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card title="Spend by category">
          {byCategory.length === 0 ? (
            <div className="py-10 text-center text-slate-500 text-sm">No spend data yet. Award a quote to populate analytics.</div>
          ) : (
            <div className="space-y-3">
              {byCategory.map(([cat, amt]) => {
                const pct = categoryTotal > 0 ? (amt / categoryTotal) * 100 : 0;
                return (
                  <div key={cat}>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <div className="flex items-center space-x-2">
                        <span className={`w-2 h-2 rounded-full ${getColor(cat)}`}></span>
                        <span className="text-slate-300">{cat}</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className="text-slate-500">{pct.toFixed(1)}%</span>
                        <span className="text-white font-mono font-semibold">${amt.toFixed(2)}</span>
                      </div>
                    </div>
                    <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div className={`h-full ${getColor(cat)}`} style={{ width: `${pct}%` }}></div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>

        <Card title="Top suppliers">
          {bySupplier.length === 0 ? (
            <div className="py-10 text-center text-slate-500 text-sm">No supplier spend yet.</div>
          ) : (
            <div className="divide-y divide-slate-800/60 -mx-5">
              {bySupplier.map(([name, d], i) => (
                <div key={name} className="flex items-center justify-between px-5 py-3">
                  <div className="flex items-center space-x-3">
                    <span className="text-xs font-mono text-slate-500 w-5">#{i + 1}</span>
                    <div>
                      <div className="text-sm text-white font-medium">{name}</div>
                      <div className="text-[10px] text-slate-500">{d.orders} order{d.orders === 1 ? '' : 's'}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-white font-mono font-bold">${d.spend.toFixed(2)}</div>
                    <div className="text-[10px] text-slate-500">{totalSpend > 0 ? ((d.spend / totalSpend) * 100).toFixed(0) : 0}% of total</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      <Card title="Savings opportunities">
        <div className="space-y-3">
          <div className="flex items-start space-x-3 text-sm">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
              <TrendingDown size={14} />
            </div>
            <div>
              <div className="text-white font-medium">Realized savings: ${savings.toFixed(2)}</div>
              <div className="text-slate-500 text-xs">Difference between awarded and highest competing quote across {store.orders.length} order{store.orders.length === 1 ? '' : 's'}.</div>
            </div>
          </div>
          <div className="flex items-start space-x-3 text-sm">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
              <Clock size={14} />
            </div>
            <div>
              <div className="text-white font-medium">Lead time optimization</div>
              <div className="text-slate-500 text-xs">Consolidating rush orders into standard shipping could reduce expedite premiums by ~12%.</div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default SpendAnalytics;
