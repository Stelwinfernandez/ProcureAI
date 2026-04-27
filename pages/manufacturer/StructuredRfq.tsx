import React, { useState } from 'react';
import { Plus, Send, Loader2 } from 'lucide-react';
import { Button } from '../../components/Button';
import { ModuleHeader } from '../../components/app/ModulePage';
import { actions } from '../../lib/store';
import { scheduleAutoQuotes } from '../../lib/mock';
import { navigate } from '../../lib/router';

const CATEGORIES = ['Bearings', 'Fasteners', 'Hydraulics', 'Pneumatics', 'Electrical', 'Safety', 'Sanitation', 'Power Transmission', 'Tools', 'Other'];

const StructuredRfq: React.FC = () => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Fasteners');
  const [sku, setSku] = useState('');
  const [specs, setSpecs] = useState<{ label: string; value: string }[]>([
    { label: 'Material', value: '' },
    { label: 'Dimension', value: '' },
  ]);
  const [qty, setQty] = useState(50);
  const [neededBy, setNeededBy] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 7);
    return d.toISOString().slice(0, 10);
  });
  const [urgency, setUrgency] = useState<'standard' | 'rush' | 'emergency'>('standard');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const addSpec = () => setSpecs([...specs, { label: '', value: '' }]);
  const removeSpec = (i: number) => setSpecs(specs.filter((_, idx) => idx !== i));

  const submit = () => {
    if (!name.trim()) return;
    setSubmitting(true);
    const rfq = actions.createRfq(
      {
        name: name.trim(),
        category,
        likelySkus: sku ? [sku] : [],
        specs: specs.filter((s) => s.label && s.value),
        confidence: 1,
      },
      { quantity: qty, neededBy, urgency, notes },
    );
    scheduleAutoQuotes(rfq);
    setTimeout(() => navigate(`/app/m/rfqs/${rfq.id}`), 400);
  };

  return (
    <div className="space-y-6">
      <ModuleHeader
        icon={Plus}
        title="Structured RFQ"
        subtitle="Create a formal RFQ from specifications when no photo is available."
        iconBg="from-blue-500/20 to-violet-500/20 border-blue-500/30"
        iconColor="text-blue-300"
      />

      <div className="glass-panel border border-white/5 rounded-2xl p-6 space-y-5">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Part name *</label>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Roller Chain Coupling 1.5in"
              className="mt-1 w-full bg-slate-800/50 border border-slate-700 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500" />
          </div>
          <div>
            <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Category</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)}
              className="mt-1 w-full bg-slate-800/50 border border-slate-700 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500">
              {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">SKU / Part number (optional)</label>
          <input value={sku} onChange={(e) => setSku(e.target.value)} placeholder="e.g. SKF-6205-2RS"
            className="mt-1 w-full bg-slate-800/50 border border-slate-700 rounded px-3 py-2 text-white text-sm font-mono focus:outline-none focus:border-blue-500" />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Specifications</label>
            <button onClick={addSpec} className="text-xs text-blue-300 hover:text-blue-200">+ Add spec</button>
          </div>
          <div className="space-y-2">
            {specs.map((s, i) => (
              <div key={i} className="grid grid-cols-[1fr_2fr_auto] gap-2">
                <input value={s.label} onChange={(e) => setSpecs(specs.map((x, idx) => idx === i ? { ...x, label: e.target.value } : x))}
                  placeholder="Label" className="bg-slate-800/50 border border-slate-700 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500" />
                <input value={s.value} onChange={(e) => setSpecs(specs.map((x, idx) => idx === i ? { ...x, value: e.target.value } : x))}
                  placeholder="Value" className="bg-slate-800/50 border border-slate-700 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500" />
                <button onClick={() => removeSpec(i)} className="text-slate-500 hover:text-red-400 px-2">&times;</button>
              </div>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4 pt-4 border-t border-slate-800">
          <div>
            <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Quantity</label>
            <input type="number" value={qty} onChange={(e) => setQty(Math.max(1, Number(e.target.value) || 1))}
              className="mt-1 w-full bg-slate-800/50 border border-slate-700 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500" />
          </div>
          <div>
            <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Needed by</label>
            <input type="date" value={neededBy} onChange={(e) => setNeededBy(e.target.value)}
              className="mt-1 w-full bg-slate-800/50 border border-slate-700 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500" />
          </div>
          <div>
            <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Urgency</label>
            <div className="mt-1 grid grid-cols-3 gap-1">
              {(['standard', 'rush', 'emergency'] as const).map((u) => (
                <button key={u} onClick={() => setUrgency(u)}
                  className={`text-xs font-medium py-2 rounded border transition-colors capitalize ${
                    urgency === u ? 'border-blue-500/40 bg-blue-500/10 text-blue-300' : 'border-slate-700 bg-slate-800/40 text-slate-400 hover:text-white'
                  }`}>{u}</button>
              ))}
            </div>
          </div>
        </div>

        <div>
          <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Notes to suppliers</label>
          <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3}
            placeholder="Packaging, certifications, delivery constraints..."
            className="mt-1 w-full bg-slate-800/50 border border-slate-700 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500" />
        </div>

        <div className="flex items-center justify-between pt-2">
          <button onClick={() => navigate('/app/m/rfqs')} className="text-xs text-slate-500 hover:text-white">Cancel</button>
          <Button onClick={submit} disabled={!name.trim() || submitting}>
            {submitting ? <><Loader2 size={14} className="mr-2 animate-spin" /> Broadcasting</> : <><Send size={14} className="mr-2" /> Broadcast RFQ</>}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default StructuredRfq;
