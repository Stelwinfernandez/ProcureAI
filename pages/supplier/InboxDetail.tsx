import React, { useMemo, useState } from 'react';
import { ArrowLeft, Send, Factory, Sparkles, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { Button } from '../../components/Button';
import { actions, useStore } from '../../lib/store';
import { navigate } from '../../lib/router';

interface Props { rfqId: string; }

const basePriceFor = (category: string): number => {
  const map: Record<string, number> = {
    Bearings: 18.5, Fasteners: 0.42, Hydraulics: 86, Pneumatics: 64,
    Electrical: 27, Safety: 11, Sanitation: 7.5, 'Power Transmission': 54, Tools: 38,
  };
  return map[category] ?? 22;
};

const InboxDetail: React.FC<Props> = ({ rfqId }) => {
  const store = useStore();
  const rfq = store.rfqs.find((r) => r.id === rfqId);
  const me = store.identity.supplier.companyName;

  const existing = useMemo(() => store.quotes.find((q) => q.rfqId === rfqId && q.supplier === me), [store.quotes, rfqId, me]);
  const competing = useMemo(() => store.quotes.filter((q) => q.rfqId === rfqId && q.supplier !== me), [store.quotes, rfqId, me]);

  const [unit, setUnit] = useState<number>(() => existing?.unitPrice ?? Math.round(basePriceFor(rfq?.part.category ?? '') * 100) / 100);
  const [lead, setLead] = useState(existing?.leadTimeDays ?? 2);
  const [stock, setStock] = useState(existing?.stockAvailable ?? 120);
  const [sku, setSku] = useState(existing?.sku ?? rfq?.part.likelySkus[0] ?? '');
  const [terms, setTerms] = useState(existing?.terms ?? 'Net 30');
  const [submitted, setSubmitted] = useState(!!existing);

  if (!rfq) {
    return (
      <div className="glass-panel border border-white/5 rounded-2xl p-16 text-center">
        <h2 className="text-xl font-semibold text-white mb-2">RFQ not found</h2>
        <Button onClick={() => navigate('/app/s/inbox')}>Back to inbox</Button>
      </div>
    );
  }

  const total = unit * rfq.quantity;
  const bestCompeting = competing.length ? Math.min(...competing.map((q) => q.totalPrice)) : null;
  const wouldBeBest = bestCompeting === null || total < bestCompeting;

  const submit = () => {
    actions.submitQuote(rfq.id, {
      supplier: me,
      supplierTag: store.identity.supplier.tag,
      unitPrice: Math.round(unit * 100) / 100,
      totalPrice: Math.round(total * 100) / 100,
      leadTimeDays: lead,
      stockAvailable: stock,
      sku,
      terms,
    });
    setSubmitted(true);
  };

  return (
    <div className="space-y-6">
      <button onClick={() => navigate('/app/s/inbox')} className="text-xs text-slate-500 hover:text-white flex items-center space-x-1">
        <ArrowLeft size={12} /><span>Inbox</span>
      </button>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-panel border border-white/5 rounded-2xl p-6 space-y-6">
          <div>
            <div className="text-[10px] font-mono uppercase tracking-widest text-cyan-400 mb-1">{rfq.id} &middot; from {rfq.buyer}</div>
            <h1 className="text-2xl font-bold text-white">{rfq.part.name}</h1>
            <div className="text-sm text-slate-400 mt-1">{rfq.part.category} &middot; needs {rfq.quantity} by {rfq.neededBy}</div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {rfq.imageDataUrl && (
              <div className="rounded-xl overflow-hidden border border-slate-800 bg-black">
                <img src={rfq.imageDataUrl} alt={rfq.part.name} className="w-full h-64 object-contain bg-slate-950" />
              </div>
            )}
            <div className="space-y-3">
              <div>
                <div className="text-[10px] text-slate-500 uppercase mb-2">Likely SKUs</div>
                <div className="flex flex-wrap gap-2">
                  {rfq.part.likelySkus.map((s) => (
                    <button key={s} onClick={() => setSku(s)} className={`text-xs font-mono px-2 py-1 rounded border transition-colors ${sku === s ? 'border-cyan-500/60 bg-cyan-500/10 text-cyan-300' : 'border-slate-700 bg-slate-800/70 text-slate-300 hover:border-slate-500'}`}>{s}</button>
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
                  <div className="text-[10px] text-slate-500 uppercase mb-1">Buyer notes</div>
                  <div className="text-sm text-slate-300 bg-slate-800/30 border border-slate-800 rounded p-3">{rfq.notes}</div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="glass-panel border border-white/5 rounded-2xl p-6">
          <h2 className="text-sm font-semibold text-white mb-4 flex items-center space-x-2">
            <Sparkles size={14} className="text-cyan-400" />
            <span>Submit your quote</span>
          </h2>

          {submitted ? (
            <div className="text-center py-6">
              <CheckCircle2 size={36} className="text-green-400 mx-auto mb-3" />
              <div className="text-white font-semibold mb-1">Quote submitted</div>
              <div className="text-xs text-slate-400 mb-6">${(Math.round(unit * 100) / 100).toFixed(2)}/ea &middot; ${total.toFixed(2)} total</div>
              <Button fullWidth variant="outline" onClick={() => navigate('/app/s/inbox')}>Back to inbox</Button>
            </div>
          ) : (
            <div className="space-y-3">
              <div>
                <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Unit price (USD)</label>
                <input type="number" step={0.01} min={0.01} value={unit} onChange={(e) => setUnit(Math.max(0.01, Number(e.target.value) || 0.01))}
                  className="mt-1 w-full bg-slate-800/50 border border-slate-700 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-cyan-500" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Lead (days)</label>
                  <input type="number" min={0} value={lead} onChange={(e) => setLead(Math.max(0, Number(e.target.value) || 0))}
                    className="mt-1 w-full bg-slate-800/50 border border-slate-700 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-cyan-500" />
                </div>
                <div>
                  <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">In stock</label>
                  <input type="number" min={0} value={stock} onChange={(e) => setStock(Math.max(0, Number(e.target.value) || 0))}
                    className="mt-1 w-full bg-slate-800/50 border border-slate-700 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-cyan-500" />
                </div>
              </div>
              <div>
                <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">SKU</label>
                <input value={sku} onChange={(e) => setSku(e.target.value)}
                  className="mt-1 w-full bg-slate-800/50 border border-slate-700 rounded px-3 py-2 text-white text-sm font-mono focus:outline-none focus:border-cyan-500" />
              </div>
              <div>
                <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Terms</label>
                <select value={terms} onChange={(e) => setTerms(e.target.value)}
                  className="mt-1 w-full bg-slate-800/50 border border-slate-700 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-cyan-500">
                  <option>Net 15</option>
                  <option>Net 30</option>
                  <option>Net 45</option>
                  <option>2/10 Net 30</option>
                </select>
              </div>

              <div className="bg-slate-800/30 border border-slate-800 rounded-lg p-3 space-y-2 text-xs mt-4">
                <div className="flex items-center justify-between text-slate-400"><span>Total ({rfq.quantity} ea)</span><span className="text-white font-mono font-bold">${total.toFixed(2)}</span></div>
                {bestCompeting !== null && (
                  <div className="flex items-center justify-between text-slate-400">
                    <span>Best competing</span>
                    <span className="text-white font-mono">${bestCompeting.toFixed(2)}</span>
                  </div>
                )}
                {bestCompeting !== null && (
                  <div className={`flex items-start space-x-2 pt-2 border-t border-slate-800 ${wouldBeBest ? 'text-green-300' : 'text-amber-300'}`}>
                    {wouldBeBest ? <CheckCircle2 size={12} className="shrink-0 mt-0.5" /> : <AlertTriangle size={12} className="shrink-0 mt-0.5" />}
                    <span>{wouldBeBest ? 'You would be the lowest quote.' : `You are $${(total - bestCompeting).toFixed(2)} above the lowest quote.`}</span>
                  </div>
                )}
              </div>

              <Button variant="secondary" fullWidth onClick={submit}>
                <Send size={14} className="mr-2" /> Submit quote
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InboxDetail;
