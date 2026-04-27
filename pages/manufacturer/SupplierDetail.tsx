import React, { useMemo } from 'react';
import { ArrowLeft, ShieldCheck, MapPin, Award, Star, Factory, Package, Clock, TrendingUp, DollarSign, CheckCircle2 } from 'lucide-react';
import { allScorecards, scorecardFor, useStore } from '../../lib/store';
import { navigate } from '../../lib/router';

interface Props { supplierId: string; }

const colorMap: Record<string, string> = {
  blue: 'from-blue-500 to-blue-700',
  cyan: 'from-cyan-500 to-cyan-700',
  red: 'from-rose-500 to-rose-700',
  emerald: 'from-emerald-500 to-emerald-700',
  violet: 'from-violet-500 to-violet-700',
  amber: 'from-amber-500 to-amber-700',
};

const Bar: React.FC<{ label: string; value: number; suffix?: string; color?: string }> = ({ label, value, suffix = '%', color = 'bg-blue-500' }) => (
  <div>
    <div className="flex items-center justify-between text-xs mb-1.5">
      <span className="text-slate-400">{label}</span>
      <span className="text-white font-mono font-semibold">{Math.round(value)}{suffix}</span>
    </div>
    <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
      <div className={`h-full ${color} transition-all`} style={{ width: `${Math.max(0, Math.min(100, value))}%` }} />
    </div>
  </div>
);

const SupplierDetail: React.FC<Props> = ({ supplierId }) => {
  const store = useStore();
  const supplier = store.suppliers.find((s) => s.id === supplierId);

  if (!supplier) {
    return (
      <div className="glass-panel border border-white/5 rounded-2xl p-16 text-center">
        <h2 className="text-xl font-semibold text-white mb-2">Supplier not found</h2>
        <button className="text-blue-400 text-sm hover:underline" onClick={() => navigate('/app/m/suppliers')}>Back to network</button>
      </div>
    );
  }

  const card = useMemo(() => scorecardFor(supplier, store), [supplier, store]);
  const orders = store.orders.filter((o) => o.supplier === supplier.name);
  const quotes = store.quotes.filter((q) => q.supplier === supplier.name).slice(0, 8);
  const overallRank = useMemo(() => {
    const ranked = allScorecards(store).sort((a, b) => b.qualityScore - a.qualityScore);
    return ranked.findIndex((r) => r.supplier.id === supplier.id) + 1;
  }, [store, supplier]);

  return (
    <div className="space-y-6">
      <button onClick={() => navigate('/app/m/suppliers')} className="text-xs text-slate-500 hover:text-white flex items-center space-x-1">
        <ArrowLeft size={12} /><span>Supplier network</span>
      </button>

      <div className="glass-panel border border-white/5 rounded-2xl p-6">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
          <div className="flex items-start space-x-5">
            <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${colorMap[supplier.color] ?? colorMap.blue} flex items-center justify-center text-white font-bold text-3xl shrink-0`}>
              {supplier.logoLetter}
            </div>
            <div>
              <div className="flex items-center space-x-2 flex-wrap">
                <h1 className="text-2xl font-bold text-white">{supplier.name}</h1>
                {supplier.verified && (
                  <span className="inline-flex items-center space-x-1 text-[10px] font-semibold uppercase tracking-wider text-blue-300 bg-blue-500/10 border border-blue-500/30 px-2 py-0.5 rounded">
                    <ShieldCheck size={10} /><span>Verified</span>
                  </span>
                )}
              </div>
              <div className="text-sm text-slate-400 mt-1">{supplier.tag}</div>
              <div className="flex items-center space-x-3 text-xs text-slate-500 mt-2">
                <div className="flex items-center space-x-1"><MapPin size={11} /><span>{supplier.region}</span></div>
                <span>&bull;</span>
                <span>Partner since {new Date(supplier.joinedAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short' })}</span>
              </div>
              <div className="flex flex-wrap gap-1.5 mt-3">
                {supplier.categories.map((c) => (
                  <span key={c} className="text-[10px] bg-slate-800/70 border border-slate-700 text-slate-300 px-2 py-0.5 rounded">{c}</span>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-col items-start md:items-end space-y-2">
            <div className="flex items-center space-x-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star key={i} size={18} className={i <= Math.round(card.qualityScore) ? 'text-amber-400 fill-amber-400' : 'text-slate-700'} />
              ))}
              <span className="text-xl font-bold text-white ml-2">{card.qualityScore.toFixed(1)}</span>
            </div>
            <div className="text-xs text-slate-500">Rank #{overallRank} of {store.suppliers.length}</div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mt-5 pt-5 border-t border-slate-800">
          {supplier.certifications.map((c) => (
            <span key={c} className="inline-flex items-center space-x-1.5 text-[10px] font-semibold uppercase tracking-wider text-amber-300 bg-amber-500/10 border border-amber-500/30 px-2 py-1 rounded">
              <Award size={10} /><span>{c}</span>
            </span>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-4 gap-3">
        {[
          { label: 'Quotes submitted', val: card.quotesSubmitted, icon: Factory, color: 'text-blue-400' },
          { label: 'Orders won', val: card.ordersWon, icon: CheckCircle2, color: 'text-green-400' },
          { label: 'Revenue', val: `$${card.revenue.toFixed(0)}`, icon: DollarSign, color: 'text-violet-400' },
          { label: 'Active orders', val: card.activeOrders, icon: Package, color: 'text-amber-400' },
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

      <div className="grid lg:grid-cols-2 gap-4">
        <div className="glass-panel border border-white/5 rounded-xl p-5">
          <h2 className="text-sm font-semibold text-white mb-4">Performance scorecard</h2>
          <div className="space-y-4">
            <Bar label="On-time delivery" value={card.onTimeRate * 100} color="bg-green-500" />
            <Bar label="Win rate" value={card.winRate * 100} color="bg-blue-500" />
            <Bar label="Price competitiveness" value={card.priceCompetitivenessPct * 100} color="bg-cyan-500" />
            <Bar label="Quality" value={(card.qualityScore / 5) * 100} color="bg-amber-500" />
          </div>
          <div className="mt-5 pt-5 border-t border-slate-800 grid grid-cols-2 gap-3 text-xs">
            <div>
              <div className="text-slate-500 mb-1 flex items-center space-x-1"><Clock size={11} /><span>Avg response</span></div>
              <div className="text-white font-semibold">{card.avgResponseMinutes.toFixed(1)} min</div>
            </div>
            <div>
              <div className="text-slate-500 mb-1 flex items-center space-x-1"><TrendingUp size={11} /><span>Avg lead time</span></div>
              <div className="text-white font-semibold">{card.avgLeadDays.toFixed(1)} days</div>
            </div>
          </div>
        </div>

        <div className="glass-panel border border-white/5 rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-white">Recent quotes</h2>
            <span className="text-xs text-slate-500">{quotes.length}</span>
          </div>
          {quotes.length === 0 ? (
            <div className="px-5 py-10 text-center text-slate-500 text-sm">No quotes from this supplier yet.</div>
          ) : (
            <div className="divide-y divide-slate-800/60 max-h-80 overflow-y-auto">
              {quotes.map((q) => {
                const rfq = store.rfqs.find((r) => r.id === q.rfqId);
                return (
                  <button
                    key={q.id}
                    onClick={() => navigate(`/app/m/rfqs/${q.rfqId}`)}
                    className="w-full px-5 py-3 flex items-center justify-between hover:bg-white/5 text-left"
                  >
                    <div className="min-w-0">
                      <div className="text-sm text-white font-medium truncate">{rfq?.part.name ?? 'Part'}</div>
                      <div className="text-xs text-slate-500">{q.rfqId} &middot; {q.sku}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-white font-mono">${q.totalPrice.toFixed(2)}</div>
                      <div className="text-[10px] text-slate-500">{q.leadTimeDays}d lead</div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <div className="glass-panel border border-white/5 rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-white">Order history</h2>
          <span className="text-xs text-slate-500">{orders.length} orders</span>
        </div>
        {orders.length === 0 ? (
          <div className="px-5 py-10 text-center text-slate-500 text-sm">No orders placed with this supplier yet.</div>
        ) : (
          <div className="divide-y divide-slate-800/60">
            {orders.map((o) => (
              <button
                key={o.id}
                onClick={() => navigate(`/app/m/orders/${o.id}`)}
                className="w-full px-5 py-4 flex items-center justify-between hover:bg-white/5 text-left"
              >
                <div>
                  <div className="text-sm text-white font-medium">{o.lineItems[0]?.description ?? 'Order'}</div>
                  <div className="text-xs text-slate-500">{o.id} &middot; placed {new Date(o.placedAt).toLocaleDateString()}</div>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-[10px] uppercase tracking-wider font-semibold px-2 py-1 rounded border border-slate-700 bg-slate-800/50 text-slate-300 capitalize">
                    {o.status.replace('_', ' ')}
                  </span>
                  <div className="text-right">
                    <div className="text-sm text-white font-mono font-bold">${o.total.toFixed(2)}</div>
                    <div className="text-[10px] text-slate-500">ETA {o.eta}</div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SupplierDetail;
