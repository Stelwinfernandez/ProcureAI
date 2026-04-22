import React from 'react';
import { Trophy, Factory, Truck } from 'lucide-react';
import { useStore } from '../../lib/store';

const Wins: React.FC = () => {
  const store = useStore();
  const me = store.identity.supplier.companyName;
  const wins = store.orders.filter((o) => o.supplier === me);

  return (
    <div className="space-y-6">
      <div>
        <div className="text-xs text-cyan-400 font-semibold uppercase tracking-widest mb-2">Awarded orders</div>
        <h1 className="text-3xl font-bold text-white">Won orders</h1>
      </div>

      {wins.length === 0 ? (
        <div className="glass-panel border border-white/5 rounded-2xl p-16 text-center">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-cyan-600/10 border border-cyan-500/20 flex items-center justify-center mb-6">
            <Trophy size={26} className="text-cyan-400" />
          </div>
          <h2 className="text-xl font-semibold text-white mb-2">No wins yet</h2>
          <p className="text-slate-400 text-sm max-w-md mx-auto">When a manufacturer accepts your quote, the order will show up here.</p>
        </div>
      ) : (
        <div className="glass-panel border border-white/5 rounded-2xl overflow-hidden divide-y divide-slate-800/60">
          {wins.map((o) => {
            const rfq = store.rfqs.find((r) => r.id === o.rfqId);
            return (
              <div key={o.id} className="px-5 py-4 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-lg bg-green-500/10 border border-green-500/20 flex items-center justify-center text-green-400">
                    <Factory size={16} />
                  </div>
                  <div>
                    <div className="text-sm text-white font-medium">{rfq?.part.name ?? 'Part'}</div>
                    <div className="text-xs text-slate-500">{o.id} &middot; {rfq?.buyer ?? 'Buyer'} &middot; ETA {o.eta}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-6">
                  <div className="text-right">
                    <div className="text-[10px] text-slate-500 uppercase">Revenue</div>
                    <div className="text-sm text-white font-bold font-mono">${o.total.toFixed(2)}</div>
                  </div>
                  <div className="flex items-center space-x-2 text-xs text-amber-300 bg-amber-500/10 border border-amber-500/20 px-2 py-1 rounded">
                    <Truck size={12} /><span className="capitalize">{o.status.replace('_', ' ')}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Wins;
