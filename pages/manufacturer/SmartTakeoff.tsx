import React, { useRef, useState } from 'react';
import { ScanLine, Upload, FileText, Sparkles, Loader2, Send } from 'lucide-react';
import { ModuleHeader, Card } from '../../components/app/ModulePage';
import { Button } from '../../components/Button';
import { actions } from '../../lib/store';
import { scheduleAutoQuotes } from '../../lib/mock';
import { navigate } from '../../lib/router';

interface Line {
  id: string;
  name: string;
  sku: string;
  qty: number;
  category: string;
  selected: boolean;
}

const MOCK_LINES: Line[] = [
  { id: '1', name: 'Hex Cap Screw M8x25 Grade 10.9', sku: 'DIN931-M8X25-10.9', qty: 48, category: 'Fasteners', selected: true },
  { id: '2', name: 'Flat Washer M8 Zinc', sku: 'DIN125-M8-ZP', qty: 96, category: 'Fasteners', selected: true },
  { id: '3', name: 'Deep Groove Bearing 6004-2RS', sku: 'SKF-6004-2RS', qty: 8, category: 'Bearings', selected: true },
  { id: '4', name: 'Shaft Key 6x6x30 DIN 6885', sku: 'DIN6885-6X6X30', qty: 8, category: 'Power Transmission', selected: true },
  { id: '5', name: 'Lock Washer M8 Split', sku: 'DIN127-M8', qty: 48, category: 'Fasteners', selected: false },
];

const SmartTakeoff: React.FC = () => {
  const fileRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [phase, setPhase] = useState<'idle' | 'analyzing' | 'ready'>('idle');
  const [lines, setLines] = useState<Line[]>([]);

  const handleFile = (f: File) => {
    setFile(f);
    setPhase('analyzing');
    setTimeout(() => {
      setLines(MOCK_LINES);
      setPhase('ready');
    }, 1600);
  };

  const toggle = (id: string) => setLines(lines.map((l) => (l.id === id ? { ...l, selected: !l.selected } : l)));

  const broadcast = () => {
    const selected = lines.filter((l) => l.selected);
    if (selected.length === 0) return;
    const first = selected[0];
    const rfq = actions.createRfq(
      {
        name: first.name,
        category: first.category,
        likelySkus: [first.sku],
        specs: [{ label: 'From', value: file?.name ?? 'Blueprint' }],
        confidence: 0.95,
      },
      {
        quantity: first.qty,
        neededBy: new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10),
        urgency: 'standard',
        notes: `Takeoff from ${file?.name} — bundled with ${selected.length - 1} related line item(s).`,
      },
    );
    scheduleAutoQuotes(rfq);
    navigate(`/app/m/rfqs/${rfq.id}`);
  };

  return (
    <div className="space-y-6">
      <ModuleHeader
        icon={ScanLine}
        title="Smart Takeoff"
        subtitle="Upload an engineering drawing or BOM. AI extracts every part and bundles it into an RFQ."
        iconBg="from-cyan-500/20 to-blue-500/20 border-cyan-500/30"
        iconColor="text-cyan-300"
      />

      {phase === 'idle' && (
        <Card>
          <div
            onClick={() => fileRef.current?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => { e.preventDefault(); const f = e.dataTransfer.files?.[0]; if (f) handleFile(f); }}
            className="border-2 border-dashed border-slate-700 hover:border-cyan-500/60 rounded-xl p-16 text-center cursor-pointer transition-colors bg-slate-900/30"
          >
            <div className="w-14 h-14 mx-auto rounded-full bg-cyan-600/10 border border-cyan-500/30 flex items-center justify-center mb-4">
              <Upload size={22} className="text-cyan-400" />
            </div>
            <div className="text-white font-medium mb-1">Drop blueprint, drawing, or BOM</div>
            <div className="text-xs text-slate-500">PDF, DWG, DXF, XLSX &middot; up to 50 MB</div>
          </div>
          <input ref={fileRef} type="file" className="hidden" accept=".pdf,.dwg,.dxf,.xlsx,.csv,image/*"
            onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />
        </Card>
      )}

      {phase === 'analyzing' && (
        <Card>
          <div className="py-16 text-center">
            <Loader2 size={28} className="text-cyan-400 animate-spin mx-auto mb-4" />
            <div className="text-white font-medium">Parsing {file?.name}&hellip;</div>
            <div className="text-xs text-slate-500 mt-2">Identifying parts, extracting SKUs, mapping to supplier catalogs</div>
          </div>
        </Card>
      )}

      {phase === 'ready' && (
        <>
          <Card title={`Extracted parts from ${file?.name}`} actions={<span className="text-xs text-slate-500">{lines.filter((l) => l.selected).length} of {lines.length} selected</span>}>
            <div className="divide-y divide-slate-800/60 -mx-5">
              {lines.map((l) => (
                <label key={l.id} className="px-5 py-3 flex items-center space-x-3 cursor-pointer hover:bg-white/5">
                  <input type="checkbox" checked={l.selected} onChange={() => toggle(l.id)} className="w-4 h-4 accent-cyan-500" />
                  <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400">
                    <FileText size={14} />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm text-white font-medium">{l.name}</div>
                    <div className="text-xs text-slate-500 font-mono">{l.sku} &middot; {l.category}</div>
                  </div>
                  <div className="text-sm text-white font-mono">qty {l.qty}</div>
                </label>
              ))}
            </div>
          </Card>

          <div className="flex justify-end space-x-3">
            <Button variant="outline" onClick={() => { setPhase('idle'); setFile(null); setLines([]); }}>Start over</Button>
            <Button onClick={broadcast}>
              <Send size={14} className="mr-2" /> Broadcast bundled RFQ
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default SmartTakeoff;
