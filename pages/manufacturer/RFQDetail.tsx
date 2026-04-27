import React, { useMemo } from 'react';
import { ArrowLeft, Clock, Package, TrendingDown, CheckCircle2, Factory, Sparkles, ShieldCheck } from 'lucide-react';
import { Button } from '../../components/Button';
import { actions, useStore } from '../../lib/store';
import { navigate } from '../../lib/router';

interface Props { rfqId: string; }

const timeAgo = (ts: number) => {
  const s = Math.max(1, Math.floor((Date.now() - ts) / 1000));
  if (s < 60) return `${s}s ago`;
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  return `${Math.floor(s / 3600)}h ago`;
};

const RFQDetail: React.FC<Props> = ({ rfqId }) => {
  const store = useStore();
  const rfq = store.rfqs.find((r) => r.id === rfqId);
  const quotes = useMemo(
    () => store.quotes.filter((q) => q.rfqId === rfqId).sort((a, b) => a.totalPrice - b.totalPrice),
    [store.quotes, rfqId],
  );

  if (!rfq) {
    return (
      <div className="glass-panel border border-white/5 rounded-2xl p-16 text-center">
        <h2 className="text-xl font-semibold text-white mb-2">RFQ not found</h2>
        <p className="text-slate-400 text-sm mb-6">This request may have been reset or never existed.</p>
        <Button onClick={() => navigate('/app/m/rfqs')}>Back to RFQs</Button>
      </div>
    );
  }

  const bestPrice = quotes[0]?.totalPrice;
  const recommended = quotes[0];

  const accept = (quoteId: string) => {
    const order = actions.acceptQuote(quoteId);
    if (order) navigate(`/app/m/rfqs/${rfqId}`);
  };

  return (
    <div className="space-y-6">
      <button onClick={() => navigate('/app/m/rfqs')} className="text-xs text-slate-500 hover:text-white flex items-center space-x-1">
        <ArrowLeft size={12} /><span>All RFQs</span>
      </button>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-panel border border-white/5 rounded-2xl p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="text-[10px] font-mono uppercase tracking-widest text-blue-400 mb-1">{rfq.id}</div>
                <h1 className="text-2xl font-bold text-white">{rfq.part.name}</h1>
                <div className="text-sm text-slate-400 mt-1">{rfq.part.category} &middot; {rfq.facility} &middot; {timeAgo(rfq.createdAt)}</div>
              </div>
              <span className={`text-[10px] uppercase tracking-wider font-semibold px-2 py-1 rounded border ${
                rfq.status === 'awarded' ? 'bg-green-500/10 border-green-500/30 text-green-300' :
                rfq.status === 'quoted' ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-300' :
                'bg-blue-500/10 border-blue-500/30 text-blue-300'
              }`}>{rfq.status}</span>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {rfq.imageDataUrl && (
                <div className="rounded-xl overflow-hidden border border-slate-800 bg-black">
                  <img src={rfq.imageDataUrl} alt={rfq.part.name} className="w-full h-64 object-contain bg-slate-950" />
                </div>
              )}
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-slate-800/40 rounded p-3">
                    <div className="text-[10px] text-slate-500 uppercase">Quantity</div>
                    <div className="text-white font-semibold">{rfq.quantity}</div>
                  </div>
                  <div className="bg-slate-800/40 rounded p-3">
                    <div className="text-[10px] text-slate-500 uppercase">Needed by</div>
                    <div className="text-white font-semibold text-sm">{rfq.neededBy}</div>
                  </div>
                  <div className="bg-slate-800/40 rounded p-3">
                    <div className="text-[10px] text-slate-500 uppercase">Urgency</div>
                    <div className={`font-semibold text-sm capitalize ${rfq.urgency === 'emergency' ? 'text-red-400' : rfq.urgency === 'rush' ? 'text-amber-400' : 'text-blue-300'}`}>{rfq.urgency}</div>
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 uppercase mb-2">Likely SKUs</div>
                  <div className="flex flex-wrap gap-2">
                    {rfq.part.likelySkus.map((s) => (
                      <span key={s} className="text-xs font-mono bg-slate-800/70 border border-slate-700 text-slate-300 px-2 py-1 rounded">{s}</span>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 uppercase mb-2">Specs</div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {rfq.part.specs.map((s) => (
                      <div key={s.label} className="bg-slate-800/40 border border-slate-800 rounded px-3 py-2">
                        <div className="text-slate-500 text-[10px] uppercase">{s.label}</div>
                        <div className="text-slate-200">{s.value}</div>
                      </div>
                    ))}
                  </div>
                </div>
                {rfq.notes && (
                  <div>
                    <div className="text-[10px] text-slate-500 uppercase mb-1">Notes to suppliers</div>
                    <div className="text-sm text-slate-300 bg-slate-800/30 border border-slate-800 rounded p-3">{rfq.notes}</div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="glass-panel border border-white/5 rounded-2xl overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-white">Supplier Quotes</h2>
              {rfq.status === 'open' && (
                <div className="flex items-center space-x-2 text-xs text-cyan-300">
                  <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></span>
                  <span>Live &middot; waiting for responses</span>
                </div>
              )}
              {quotes.length > 0 && <div className="text-xs text-slate-500">{quotes.length} quote{quotes.length === 1 ? '' : 's'}</div>}
            </div>

            {quotes.length === 0 && (
              <div className="p-10 text-center">
                <div className="w-12 h-12 mx-auto rounded-full bg-slate-800/80 border border-slate-700 flex items-center justify-center mb-4">
                  <Clock size={18} className="text-slate-400 animate-pulse" />
                </div>
                <div className="text-sm text-white mb-1">Supplier quotes will stream in here</div>
                <div className="text-xs text-slate-500">Typical response window: 2&ndash;14 seconds in demo mode.</div>
              </div>
            )}

            <div className="divide-y divide-slate-800/60">
              {quotes.map((q, i) => {
                const isBest = i === 0;
                const awarded = rfq.awardedQuoteId === q.id;
                return (
                  <div key={q.id} className={`px-5 py-4 flex items-center justify-between ${awarded ? 'bg-green-500/5' : ''}`}>
                    <div className="flex items-center space-x-4">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isBest ? 'bg-green-500/10 border border-green-500/30 text-green-400' : 'bg-slate-800 text-slate-400'}`}>
                        <Factory size={16} />
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-white font-semibold">{q.supplier}</span>
                          {isBest && !awarded && <span className="text-[10px] font-bold uppercase tracking-wider text-green-400 bg-green-500/10 border border-green-500/30 px-2 py-0.5 rounded">Best price</span>}
                          {awarded && <span className="text-[10px] font-bold uppercase tracking-wider text-green-300 bg-green-500/20 border border-green-500/40 px-2 py-0.5 rounded">Awarded</span>}
                        </div>
                        <div className="text-xs text-slate-500">{q.supplierTag} &middot; {q.sku} &middot; {q.terms}</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-6">
                      <div className="text-right hidden md:block">
                        <div className="text-[10px] text-slate-500 uppercase">Lead</div>
                        <div className="text-sm text-white font-medium">{q.leadTimeDays}d</div>
                      </div>
                      <div className="text-right hidden md:block">
                        <div className="text-[10px] text-slate-500 uppercase">Stock</div>
                        <div className="text-sm text-white font-medium">{q.stockAvailable}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-[10px] text-slate-500 uppercase">Total</div>
                        <div className="text-sm text-white font-bold font-mono">${q.totalPrice.toFixed(2)}</div>
                        <div className="text-[10px] text-slate-500">${q.unitPrice.toFixed(2)}/ea</div>
                      </div>
                      {rfq.status !== 'awarded' && (
                        <Button size="sm" variant={isBest ? 'primary' : 'outline'} onClick={() => accept(q.id)}>Accept</Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {recommended && rfq.status !== 'awarded' && (
            <div className="glass-panel border border-blue-500/20 rounded-2xl p-5 bg-blue-500/5">
              <div className="flex items-center space-x-2 text-blue-400 text-xs font-semibold uppercase tracking-widest mb-3">
                <Sparkles size={14} /><span>AI Recommendation</span>
              </div>
              <div className="text-white font-semibold mb-1">{recommended.supplier}</div>
              <div className="text-xs text-slate-400 leading-relaxed mb-4">
                Lowest total at ${recommended.totalPrice.toFixed(2)} with a {recommended.leadTimeDays}-day lead and {recommended.stockAvailable} in stock. Matches your urgency tier.
              </div>
              <Button fullWidth onClick={() => accept(recommended.id)}>
                <CheckCircle2 size={14} className="mr-2" /> Award to {recommended.supplier}
              </Button>
            </div>
          )}

          <div className="glass-panel border border-white/5 rounded-2xl p-5">
            <h3 className="text-sm font-semibold text-white mb-4">Quote summary</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-2 text-slate-400"><TrendingDown size={14} /><span>Best price</span></div>
                <span className="text-white font-mono">{bestPrice !== undefined ? `$${bestPrice.toFixed(2)}` : '—'}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-2 text-slate-400"><Clock size={14} /><span>Fastest</span></div>
                <span className="text-white">{quotes.length ? Math.min(...quotes.map((q) => q.leadTimeDays)) + 'd' : '—'}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-2 text-slate-400"><Package size={14} /><span>Total stock</span></div>
                <span className="text-white">{quotes.reduce((a, q) => a + q.stockAvailable, 0) || '—'}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-2 text-slate-400"><ShieldCheck size={14} /><span>Verified suppliers</span></div>
                <span className="text-white">{new Set(quotes.map((q) => q.supplier)).size}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RFQDetail;
