import React from 'react';
import { Camera, Factory, ArrowRight } from 'lucide-react';
import { Button } from '../../components/Button';
import { useStore } from '../../lib/store';
import { navigate } from '../../lib/router';

const timeAgo = (ts: number) => {
  const s = Math.max(1, Math.floor((Date.now() - ts) / 1000));
  if (s < 60) return `${s}s ago`;
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
};

const statusStyles = {
  open: 'border-blue-500/20 bg-blue-500/10 text-blue-300',
  quoted: 'border-cyan-500/20 bg-cyan-500/10 text-cyan-300',
  awarded: 'border-green-500/20 bg-green-500/10 text-green-300',
  closed: 'border-slate-500/20 bg-slate-500/10 text-slate-400',
};

const RFQs: React.FC = () => {
  const store = useStore();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs text-blue-400 font-semibold uppercase tracking-widest mb-2">All RFQs</div>
          <h1 className="text-3xl font-bold text-white">Request queue</h1>
        </div>
        <Button onClick={() => navigate('/app/m/snap')}>
          <Camera size={16} className="mr-2" /> New RFQ
        </Button>
      </div>

      {store.rfqs.length === 0 ? (
        <div className="glass-panel border border-white/5 rounded-2xl p-16 text-center">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center mb-6">
            <Camera size={26} className="text-blue-400" />
          </div>
          <h2 className="text-xl font-semibold text-white mb-2">No RFQs yet</h2>
          <p className="text-slate-400 text-sm mb-6 max-w-md mx-auto">Snap a photo of any MRO part and we&apos;ll turn it into an RFQ and collect live quotes from suppliers.</p>
          <Button onClick={() => navigate('/app/m/snap')}>Start Snap &amp; Source</Button>
        </div>
      ) : (
        <div className="glass-panel border border-white/5 rounded-2xl overflow-hidden">
          <div className="grid grid-cols-12 px-5 py-3 text-[10px] font-semibold uppercase tracking-widest text-slate-500 border-b border-slate-800 bg-slate-900/30">
            <div className="col-span-5">Part</div>
            <div className="col-span-2">Qty</div>
            <div className="col-span-2">Quotes</div>
            <div className="col-span-2">Status</div>
            <div className="col-span-1"></div>
          </div>
          <div className="divide-y divide-slate-800/60">
            {store.rfqs.map((r) => {
              const qs = store.quotes.filter((q) => q.rfqId === r.id);
              const best = qs.reduce<number | null>((acc, q) => (acc === null || q.totalPrice < acc ? q.totalPrice : acc), null);
              return (
                <button
                  key={r.id}
                  onClick={() => navigate(`/app/m/rfqs/${r.id}`)}
                  className="w-full grid grid-cols-12 px-5 py-4 items-center hover:bg-white/5 transition-colors text-left"
                >
                  <div className="col-span-5 flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400">
                      <Factory size={16} />
                    </div>
                    <div>
                      <div className="text-sm text-white font-medium">{r.part.name}</div>
                      <div className="text-xs text-slate-500">{r.id} &middot; {r.part.category} &middot; {timeAgo(r.createdAt)}</div>
                    </div>
                  </div>
                  <div className="col-span-2 text-sm text-slate-300">{r.quantity}</div>
                  <div className="col-span-2 text-sm">
                    <span className="text-white font-medium">{qs.length}</span>
                    {best !== null && <span className="text-slate-500 text-xs ml-2">best ${best.toFixed(2)}</span>}
                  </div>
                  <div className="col-span-2">
                    <span className={`text-[10px] uppercase tracking-wider font-semibold px-2 py-1 rounded border ${statusStyles[r.status]}`}>{r.status}</span>
                  </div>
                  <div className="col-span-1 text-right text-slate-600"><ArrowRight size={14} /></div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default RFQs;
