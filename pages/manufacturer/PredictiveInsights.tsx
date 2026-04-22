import React, { useMemo } from 'react';
import { Brain, TrendingUp, AlertTriangle, Calendar, Sparkles } from 'lucide-react';
import { ModuleHeader, Stat, Card } from '../../components/app/ModulePage';
import { useStore } from '../../lib/store';

const PredictiveInsights: React.FC = () => {
  const store = useStore();

  const forecasts = useMemo(() => [
    { category: 'Bearings', next30: 4250, change: +12, confidence: 0.91 },
    { category: 'Fasteners', next30: 1840, change: +3, confidence: 0.88 },
    { category: 'Sanitation', next30: 2100, change: -5, confidence: 0.82 },
    { category: 'Tools', next30: 3400, change: +22, confidence: 0.76 },
  ], []);

  const alerts = useMemo(() => [
    { level: 'high', title: 'Bearing demand spike likely', body: 'Historical pattern + current work order velocity suggests 22% uplift in bearing orders next week. Pre-position 30% buffer with Motion Industries.' },
    { level: 'medium', title: 'Supplier concentration risk', body: `${Math.round((store.orders.filter((o) => o.supplier === 'Fastenal').length / Math.max(1, store.orders.length)) * 100)}% of recent orders routed to Fastenal. Consider diversifying fasteners category.` },
    { level: 'low', title: 'Price compression on M10 hex screws', body: 'Average quoted price down 6% month-over-month across 3 suppliers. Good window for 6-month blanket order.' },
  ], [store.orders]);

  return (
    <div className="space-y-6">
      <ModuleHeader
        icon={Brain}
        title="Predictive Insights"
        subtitle="Demand forecasting and procurement signal detection across your plant."
        iconBg="from-fuchsia-500/20 to-pink-500/20 border-fuchsia-500/30"
        iconColor="text-fuchsia-300"
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Stat label="Forecast models" value="7" icon={Brain} color="text-fuchsia-400" />
        <Stat label="Active signals" value={alerts.length} icon={AlertTriangle} color="text-amber-400" sub="requires attention" />
        <Stat label="30d forecast spend" value={`$${forecasts.reduce((a, f) => a + f.next30, 0).toLocaleString()}`} icon={TrendingUp} color="text-white" />
        <Stat label="Model accuracy" value="92.4%" icon={Sparkles} color="text-emerald-400" sub="rolling 90 days" />
      </div>

      <Card title="30-day demand forecast by category">
        <div className="space-y-3">
          {forecasts.map((f) => (
            <div key={f.category} className="flex items-center justify-between py-2 border-b border-slate-800/60 last:border-0">
              <div>
                <div className="text-sm text-white font-medium">{f.category}</div>
                <div className="text-[10px] text-slate-500">Confidence {Math.round(f.confidence * 100)}%</div>
              </div>
              <div className="flex items-center space-x-6">
                <div className={`text-sm font-mono font-semibold ${f.change > 0 ? 'text-amber-300' : 'text-emerald-300'}`}>
                  {f.change > 0 ? '+' : ''}{f.change}%
                </div>
                <div className="text-right">
                  <div className="text-sm font-mono text-white">${f.next30.toLocaleString()}</div>
                  <div className="text-[10px] text-slate-500">projected spend</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card title="Signals & recommendations">
        <div className="space-y-3">
          {alerts.map((a, i) => (
            <div key={i} className="flex items-start space-x-3 p-3 rounded-lg bg-slate-800/30 border border-slate-800">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                a.level === 'high' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                a.level === 'medium' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                'bg-blue-500/10 text-blue-400 border border-blue-500/20'
              }`}><AlertTriangle size={14} /></div>
              <div className="flex-1">
                <div className="text-sm text-white font-medium flex items-center space-x-2">
                  <span>{a.title}</span>
                  <Calendar size={10} className="text-slate-500" />
                </div>
                <div className="text-xs text-slate-400 mt-1 leading-relaxed">{a.body}</div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default PredictiveInsights;
