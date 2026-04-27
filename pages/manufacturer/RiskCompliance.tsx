import React, { useMemo } from 'react';
import { ShieldCheck, AlertTriangle, Award, Globe, ShieldAlert } from 'lucide-react';
import { ModuleHeader, Stat, Card } from '../../components/app/ModulePage';
import { useStore, allScorecards } from '../../lib/store';

const riskFor = (onTime: number, active: number, revenue: number): { level: 'Low' | 'Medium' | 'High'; reason: string } => {
  if (onTime < 0.7) return { level: 'High', reason: 'On-time delivery below 70%' };
  if (active > 5 && onTime < 0.85) return { level: 'Medium', reason: 'Concentrated active orders' };
  if (revenue > 50000 && onTime < 0.95) return { level: 'Medium', reason: 'High spend, variable delivery' };
  return { level: 'Low', reason: 'Within acceptable thresholds' };
};

const riskStyles: Record<string, string> = {
  Low: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300',
  Medium: 'border-amber-500/30 bg-amber-500/10 text-amber-300',
  High: 'border-red-500/30 bg-red-500/10 text-red-300',
};

const RiskCompliance: React.FC = () => {
  const store = useStore();
  const cards = useMemo(() => allScorecards(store), [store]);

  const rows = cards.map((c) => ({ card: c, risk: riskFor(c.onTimeRate, c.activeOrders, c.revenue) }));
  const high = rows.filter((r) => r.risk.level === 'High').length;
  const medium = rows.filter((r) => r.risk.level === 'Medium').length;
  const totalCerts = cards.reduce((a, c) => a + c.supplier.certifications.length, 0);
  const verified = cards.filter((c) => c.supplier.verified).length;

  return (
    <div className="space-y-6">
      <ModuleHeader
        icon={ShieldAlert}
        title="Risk & Compliance"
        subtitle="Supplier risk signals, certifications, and concentration monitoring."
        iconBg="from-red-500/20 to-orange-500/20 border-red-500/30"
        iconColor="text-red-300"
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Stat label="High-risk suppliers" value={high} color="text-red-400" icon={AlertTriangle} />
        <Stat label="Medium-risk" value={medium} color="text-amber-400" icon={AlertTriangle} />
        <Stat label="Verified" value={`${verified}/${cards.length}`} color="text-emerald-400" icon={ShieldCheck} />
        <Stat label="Certifications" value={totalCerts} color="text-blue-400" icon={Award} />
      </div>

      <Card title="Supplier risk register">
        <div className="divide-y divide-slate-800/60 -mx-5">
          {rows.map(({ card, risk }) => (
            <div key={card.supplier.id} className="px-5 py-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br from-${card.supplier.color}-500 to-${card.supplier.color}-700 flex items-center justify-center text-white font-bold`}>
                  {card.supplier.logoLetter}
                </div>
                <div>
                  <div className="text-sm text-white font-medium">{card.supplier.name}</div>
                  <div className="text-xs text-slate-500">{card.supplier.region} &middot; {card.supplier.certifications.length} cert{card.supplier.certifications.length === 1 ? '' : 's'}</div>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-right hidden md:block">
                  <div className="text-[10px] text-slate-500 uppercase">On-time</div>
                  <div className="text-sm text-white">{Math.round(card.onTimeRate * 100)}%</div>
                </div>
                <div className="text-right hidden md:block">
                  <div className="text-[10px] text-slate-500 uppercase">Active</div>
                  <div className="text-sm text-white">{card.activeOrders}</div>
                </div>
                <div className="text-right">
                  <span className={`text-[10px] uppercase tracking-wider font-semibold px-2 py-1 rounded border ${riskStyles[risk.level]}`}>
                    {risk.level} risk
                  </span>
                  <div className="text-[10px] text-slate-500 mt-1 max-w-[180px]">{risk.reason}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        <Card title="Certifications on file">
          <div className="space-y-2">
            {cards.map((c) => (
              <div key={c.supplier.id} className="flex items-center justify-between py-2 border-b border-slate-800/60 last:border-0">
                <span className="text-sm text-slate-300">{c.supplier.name}</span>
                <div className="flex flex-wrap gap-1 justify-end">
                  {c.supplier.certifications.map((cert) => (
                    <span key={cert} className="text-[10px] font-semibold uppercase tracking-wider text-amber-300 bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded">
                      {cert}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Geographic distribution">
          <div className="space-y-2">
            {(() => {
              const regions = new Map<string, number>();
              cards.forEach((c) => regions.set(c.supplier.region, (regions.get(c.supplier.region) ?? 0) + 1));
              return Array.from(regions.entries()).map(([r, n]) => (
                <div key={r} className="flex items-center justify-between py-2">
                  <div className="flex items-center space-x-2">
                    <Globe size={12} className="text-slate-500" />
                    <span className="text-sm text-slate-300">{r}</span>
                  </div>
                  <span className="text-sm text-white font-mono">{n}</span>
                </div>
              ));
            })()}
          </div>
          <div className="mt-4 pt-4 border-t border-slate-800 text-xs text-slate-500">
            Source diversification reduces tariff and logistics shock exposure.
          </div>
        </Card>
      </div>
    </div>
  );
};

export default RiskCompliance;
