import React, { useMemo } from 'react';
import { Star, Award, ShieldCheck, Clock, TrendingUp, CheckCircle2, Target } from 'lucide-react';
import { scorecardFor, useStore } from '../../lib/store';

const Bar: React.FC<{ label: string; value: number; suffix?: string; color?: string }> = ({ label, value, suffix = '%', color = 'bg-cyan-500' }) => (
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

const Scorecard: React.FC = () => {
  const store = useStore();
  const me = store.identity.supplier.companyName;
  const supplier = useMemo(() => store.suppliers.find((s) => s.name === me), [store.suppliers, me]);

  if (!supplier) {
    return (
      <div className="glass-panel border border-white/5 rounded-2xl p-16 text-center">
        <h2 className="text-xl font-semibold text-white mb-2">Scorecard unavailable</h2>
        <p className="text-slate-400 text-sm">We couldn&apos;t find your supplier profile. Reset the demo to re-seed.</p>
      </div>
    );
  }

  const card = scorecardFor(supplier, store);
  const allCards = store.suppliers.map((s) => scorecardFor(s, store));
  const ranked = [...allCards].sort((a, b) => b.qualityScore - a.qualityScore);
  const rank = ranked.findIndex((r) => r.supplier.name === me) + 1;

  return (
    <div className="space-y-6">
      <div>
        <div className="text-xs text-cyan-400 font-semibold uppercase tracking-widest mb-2">Your performance</div>
        <h1 className="text-3xl font-bold text-white">Supplier scorecard</h1>
        <p className="text-slate-400 text-sm mt-1">How buyers see {supplier.name} on the ProcureAI network.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <div className="md:col-span-1 glass-panel border border-white/5 rounded-2xl p-6 text-center">
          <div className="inline-flex items-center space-x-1 mb-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <Star key={i} size={22} className={i <= Math.round(card.qualityScore) ? 'text-amber-400 fill-amber-400' : 'text-slate-700'} />
            ))}
          </div>
          <div className="text-4xl font-bold text-white">{card.qualityScore.toFixed(1)}</div>
          <div className="text-sm text-slate-400 mt-1">Overall quality score</div>
          <div className="mt-4 pt-4 border-t border-slate-800 text-xs text-slate-500">
            Rank <span className="text-white font-semibold">#{rank}</span> of {store.suppliers.length} in network
          </div>
        </div>

        <div className="md:col-span-2 glass-panel border border-white/5 rounded-2xl p-6">
          <h2 className="text-sm font-semibold text-white mb-5">Performance breakdown</h2>
          <div className="space-y-4">
            <Bar label="On-time delivery" value={card.onTimeRate * 100} color="bg-green-500" />
            <Bar label="Win rate" value={card.winRate * 100} color="bg-cyan-500" />
            <Bar label="Price competitiveness" value={card.priceCompetitivenessPct * 100} color="bg-blue-500" />
            <Bar label="Quality" value={(card.qualityScore / 5) * 100} color="bg-amber-500" />
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-4 gap-3">
        {[
          { label: 'Quotes submitted', val: card.quotesSubmitted, color: 'text-blue-400', icon: Target },
          { label: 'Orders won', val: card.ordersWon, color: 'text-green-400', icon: CheckCircle2 },
          { label: 'Avg response', val: `${card.avgResponseMinutes.toFixed(1)}m`, color: 'text-cyan-400', icon: Clock },
          { label: 'Avg lead time', val: `${card.avgLeadDays.toFixed(1)}d`, color: 'text-violet-400', icon: TrendingUp },
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

      <div className="glass-panel border border-white/5 rounded-2xl p-6">
        <h2 className="text-sm font-semibold text-white mb-5">Certifications &amp; categories</h2>
        <div className="flex flex-wrap gap-2 mb-5">
          {supplier.certifications.map((c) => (
            <span key={c} className="inline-flex items-center space-x-1.5 text-[10px] font-semibold uppercase tracking-wider text-amber-300 bg-amber-500/10 border border-amber-500/30 px-2 py-1 rounded">
              <Award size={10} /><span>{c}</span>
            </span>
          ))}
          {supplier.verified && (
            <span className="inline-flex items-center space-x-1.5 text-[10px] font-semibold uppercase tracking-wider text-blue-300 bg-blue-500/10 border border-blue-500/30 px-2 py-1 rounded">
              <ShieldCheck size={10} /><span>Verified</span>
            </span>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          {supplier.categories.map((c) => (
            <span key={c} className="text-xs bg-slate-800/70 border border-slate-700 text-slate-300 px-3 py-1 rounded">{c}</span>
          ))}
        </div>
      </div>

      <div className="glass-panel border border-white/5 rounded-2xl p-5">
        <h3 className="text-sm font-semibold text-white mb-3">Leaderboard</h3>
        <div className="space-y-2">
          {ranked.slice(0, 5).map((c, i) => (
            <div key={c.supplier.id} className={`flex items-center justify-between px-3 py-2 rounded-lg ${c.supplier.name === me ? 'bg-cyan-500/10 border border-cyan-500/30' : 'bg-slate-800/30'}`}>
              <div className="flex items-center space-x-3">
                <span className="text-xs font-mono text-slate-500 w-4">#{i + 1}</span>
                <span className={`text-sm font-medium ${c.supplier.name === me ? 'text-cyan-300' : 'text-slate-200'}`}>
                  {c.supplier.name}
                  {c.supplier.name === me && <span className="text-[10px] ml-2 text-cyan-500">you</span>}
                </span>
              </div>
              <div className="flex items-center space-x-1">
                <Star size={12} className="text-amber-400 fill-amber-400" />
                <span className="text-sm font-mono text-white">{c.qualityScore.toFixed(1)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Scorecard;
