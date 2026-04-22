import React, { useMemo, useState } from 'react';
import { Search, ShieldCheck, Star, TrendingUp, Clock, MapPin, Award, ArrowRight } from 'lucide-react';
import { allScorecards, useStore } from '../../lib/store';
import { navigate } from '../../lib/router';

const colorMap: Record<string, string> = {
  blue: 'from-blue-500 to-blue-700',
  cyan: 'from-cyan-500 to-cyan-700',
  red: 'from-rose-500 to-rose-700',
  emerald: 'from-emerald-500 to-emerald-700',
  violet: 'from-violet-500 to-violet-700',
  amber: 'from-amber-500 to-amber-700',
};

const StarRow: React.FC<{ value: number }> = ({ value }) => (
  <div className="flex items-center space-x-0.5">
    {[1, 2, 3, 4, 5].map((i) => (
      <Star key={i} size={12} className={i <= Math.round(value) ? 'text-amber-400 fill-amber-400' : 'text-slate-700'} />
    ))}
    <span className="text-xs text-slate-400 ml-2">{value.toFixed(1)}</span>
  </div>
);

const Suppliers: React.FC = () => {
  const store = useStore();
  const [q, setQ] = useState('');
  const [cat, setCat] = useState<string>('All');

  const cards = useMemo(() => allScorecards(store), [store]);

  const categories = useMemo(() => {
    const set = new Set<string>();
    store.suppliers.forEach((s) => s.categories.forEach((c) => set.add(c)));
    return ['All', ...Array.from(set).sort()];
  }, [store.suppliers]);

  const filtered = cards.filter((c) => {
    const matchQ = q.trim() === '' || c.supplier.name.toLowerCase().includes(q.toLowerCase()) || c.supplier.tag.toLowerCase().includes(q.toLowerCase());
    const matchC = cat === 'All' || c.supplier.categories.includes(cat);
    return matchQ && matchC;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <div className="text-xs text-blue-400 font-semibold uppercase tracking-widest mb-2">Supplier network</div>
          <h1 className="text-3xl font-bold text-white">Verified suppliers</h1>
          <p className="text-slate-400 text-sm mt-1">{store.suppliers.length} distributors &middot; {cards.reduce((a, c) => a + c.ordersWon, 0)} completed orders</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search suppliers..."
            className="w-full bg-slate-800/50 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={`text-xs whitespace-nowrap px-3 py-2 rounded-lg border transition-colors ${
                cat === c ? 'border-blue-500/40 bg-blue-500/10 text-blue-300' : 'border-slate-700 bg-slate-800/30 text-slate-400 hover:text-white'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((c) => (
          <button
            key={c.supplier.id}
            onClick={() => navigate(`/app/m/suppliers/${c.supplier.id}`)}
            className="glass-panel border border-white/5 hover:border-blue-500/40 rounded-xl p-5 text-left transition-all duration-300 hover:-translate-y-0.5"
          >
            <div className="flex items-start space-x-4 mb-4">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colorMap[c.supplier.color] ?? colorMap.blue} flex items-center justify-center text-white font-bold text-lg shrink-0`}>
                {c.supplier.logoLetter}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-1.5">
                  <h3 className="text-white font-semibold truncate">{c.supplier.name}</h3>
                  {c.supplier.verified && <ShieldCheck size={13} className="text-blue-400 shrink-0" />}
                </div>
                <div className="text-xs text-slate-500">{c.supplier.tag}</div>
                <div className="flex items-center space-x-2 text-[10px] text-slate-500 mt-1">
                  <MapPin size={10} /><span>{c.supplier.region}</span>
                </div>
              </div>
            </div>

            <StarRow value={c.qualityScore} />

            <div className="grid grid-cols-3 gap-2 mt-4 text-center">
              <div className="bg-slate-800/40 rounded p-2">
                <div className="text-[10px] text-slate-500 uppercase">Win rate</div>
                <div className="text-sm font-semibold text-white">{Math.round(c.winRate * 100)}%</div>
              </div>
              <div className="bg-slate-800/40 rounded p-2">
                <div className="text-[10px] text-slate-500 uppercase">On-time</div>
                <div className="text-sm font-semibold text-green-400">{Math.round(c.onTimeRate * 100)}%</div>
              </div>
              <div className="bg-slate-800/40 rounded p-2">
                <div className="text-[10px] text-slate-500 uppercase">Lead</div>
                <div className="text-sm font-semibold text-white">{c.avgLeadDays.toFixed(1)}d</div>
              </div>
            </div>

            <div className="flex flex-wrap gap-1.5 mt-4">
              {c.supplier.categories.slice(0, 3).map((cat) => (
                <span key={cat} className="text-[10px] bg-slate-800/70 border border-slate-700 text-slate-400 px-2 py-0.5 rounded">
                  {cat}
                </span>
              ))}
              {c.supplier.categories.length > 3 && (
                <span className="text-[10px] text-slate-500 px-2 py-0.5">+{c.supplier.categories.length - 3}</span>
              )}
            </div>

            <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-800 text-xs">
              <div className="flex items-center space-x-3 text-slate-500">
                <div className="flex items-center space-x-1"><TrendingUp size={11} /><span>${c.revenue.toFixed(0)}</span></div>
                <div className="flex items-center space-x-1"><Clock size={11} /><span>{c.avgResponseMinutes.toFixed(0)}m</span></div>
              </div>
              <div className="flex items-center space-x-1 text-blue-400 font-medium">
                <span>View</span><ArrowRight size={12} />
              </div>
            </div>
          </button>
        ))}

        {filtered.length === 0 && (
          <div className="md:col-span-2 xl:col-span-3 text-center py-16 text-slate-500 text-sm">
            No suppliers match your filter.
          </div>
        )}
      </div>

      <div className="glass-panel border border-white/5 rounded-xl p-5">
        <div className="flex items-center space-x-2 text-xs text-slate-400">
          <Award size={14} className="text-amber-400" />
          <span>Scorecards are computed live from quote responses, award rates, and delivered order outcomes.</span>
        </div>
      </div>
    </div>
  );
};

export default Suppliers;
