import React, { useRef, useState } from 'react';
import { Camera, Upload, Sparkles, ScanLine, AlertTriangle, CheckCircle2, Loader2, X, Send, Zap, Info } from 'lucide-react';
import { Button } from '../../components/Button';
import { identifyPart, type AiStatus } from '../../lib/ai';
import { actions } from '../../lib/store';
import { scheduleAutoQuotes } from '../../lib/mock';
import { navigate } from '../../lib/router';
import type { IdentifiedPart } from '../../lib/types';

type Phase = 'idle' | 'analyzing' | 'review' | 'broadcasting';

const SnapSource: React.FC = () => {
  const fileRef = useRef<HTMLInputElement>(null);
  const [imageDataUrl, setImageDataUrl] = useState<string | null>(null);
  const [phase, setPhase] = useState<Phase>('idle');
  const [part, setPart] = useState<IdentifiedPart | null>(null);
  const [aiStatus, setAiStatus] = useState<AiStatus | null>(null);
  const [aiMessage, setAiMessage] = useState<string | undefined>();
  const [hint, setHint] = useState('');
  const [quantity, setQuantity] = useState(10);
  const [neededBy, setNeededBy] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 7);
    return d.toISOString().slice(0, 10);
  });
  const [urgency, setUrgency] = useState<'standard' | 'rush' | 'emergency'>('standard');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setImageDataUrl(reader.result as string);
    reader.readAsDataURL(file);
    setError(null);
  };

  const onDrop: React.DragEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();
    const f = e.dataTransfer.files?.[0];
    if (f) handleFile(f);
  };

  const analyze = async () => {
    if (!imageDataUrl) return;
    setPhase('analyzing');
    setError(null);
    try {
      const result = await identifyPart(imageDataUrl, hint);
      setPart(result.part);
      setAiStatus(result.status);
      setAiMessage(result.message);
      setPhase('review');
    } catch (err) {
      console.error(err);
      setError('Analysis failed. Please try another photo.');
      setPhase('idle');
    }
  };

  const reset = () => {
    setImageDataUrl(null);
    setPart(null);
    setHint('');
    setPhase('idle');
    setError(null);
    setAiStatus(null);
    setAiMessage(undefined);
  };

  const broadcast = () => {
    if (!part) return;
    setPhase('broadcasting');
    const rfq = actions.createRfq(part, {
      quantity,
      neededBy,
      urgency,
      notes,
      imageDataUrl: imageDataUrl ?? undefined,
    });
    scheduleAutoQuotes(rfq);
    setTimeout(() => navigate(`/app/m/rfqs/${rfq.id}`), 600);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
        <div>
          <div className="text-xs text-blue-400 font-semibold uppercase tracking-widest mb-2">Snap &amp; Source</div>
          <h1 className="text-3xl font-bold text-white">Part to quote in minutes</h1>
          <p className="text-slate-400 text-sm mt-1">Drop a photo of any MRO part. Our vision model identifies it and we&apos;ll fire an instant RFQ to the best suppliers.</p>
        </div>
        {aiStatus && (
          <div className={`inline-flex items-center space-x-2 px-3 py-2 rounded-lg border text-xs font-medium ${
            aiStatus === 'live' ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300' :
            aiStatus === 'error' ? 'border-red-500/30 bg-red-500/10 text-red-300' :
            'border-amber-500/30 bg-amber-500/10 text-amber-300'
          }`}>
            {aiStatus === 'live' ? <Zap size={12} /> : aiStatus === 'error' ? <AlertTriangle size={12} /> : <Info size={12} />}
            <span>
              {aiStatus === 'live' ? 'Live AI (Gemini 2.5 Flash)' :
               aiStatus === 'error' ? 'Gemini error &middot; using fallback' :
               'Demo mode &middot; deterministic fallback'}
            </span>
          </div>
        )}
      </div>

      {aiStatus && aiStatus !== 'live' && aiMessage && (
        <div className="flex items-start space-x-2 text-xs bg-slate-900/60 border border-slate-800 rounded-lg p-3">
          <Info size={14} className="text-slate-400 shrink-0 mt-0.5" />
          <div className="text-slate-300 leading-relaxed">
            {aiMessage}
            {aiStatus === 'demo' && (
              <div className="mt-1 text-slate-500">
                Create <span className="font-mono text-slate-300">.env.local</span> with <span className="font-mono text-slate-300">GEMINI_API_KEY=your_key</span>, restart the dev server, and reload. The fallback is deterministic &mdash; the same photo always maps to the same part.
              </div>
            )}
          </div>
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Left: capture */}
        <div className="glass-panel border border-white/5 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-white flex items-center space-x-2">
              <Camera size={16} className="text-blue-400" />
              <span>Step 1 &middot; Capture</span>
            </h2>
            {imageDataUrl && phase === 'idle' && (
              <button onClick={reset} className="text-xs text-slate-500 hover:text-white flex items-center space-x-1">
                <X size={12} /><span>Clear</span>
              </button>
            )}
          </div>

          {!imageDataUrl && (
            <div
              onClick={() => fileRef.current?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={onDrop}
              className="border-2 border-dashed border-slate-700 hover:border-blue-500/60 rounded-xl p-10 text-center cursor-pointer transition-colors bg-slate-900/30"
            >
              <div className="w-14 h-14 mx-auto rounded-full bg-blue-600/10 border border-blue-500/30 flex items-center justify-center mb-4">
                <Upload size={22} className="text-blue-400" />
              </div>
              <div className="text-white font-medium mb-1">Drop a photo or click to upload</div>
              <div className="text-xs text-slate-500">PNG, JPG &middot; any MRO part on your plant floor</div>
            </div>
          )}

          {imageDataUrl && (
            <div className="relative rounded-xl overflow-hidden border border-slate-800 bg-black">
              <img src={imageDataUrl} alt="Part" className="w-full h-80 object-contain bg-slate-950" />
              {phase === 'analyzing' && (
                <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center">
                  <div className="text-center">
                    <div className="relative w-20 h-20 mx-auto mb-4">
                      <div className="absolute inset-0 border-2 border-cyan-500/20 rounded-2xl"></div>
                      <div className="absolute inset-0 border-t-2 border-cyan-400 rounded-2xl animate-spin"></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <ScanLine size={28} className="text-cyan-400" />
                      </div>
                    </div>
                    <div className="text-sm text-white font-medium mb-1">Identifying part&hellip;</div>
                    <div className="text-xs text-slate-400">Vision model analyzing geometry and markings</div>
                  </div>
                </div>
              )}
            </div>
          )}

          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            capture="environment"
            onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
          />

          {imageDataUrl && phase === 'idle' && (
            <div className="mt-5 space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Optional hint</label>
                <input
                  type="text"
                  value={hint}
                  onChange={(e) => setHint(e.target.value)}
                  placeholder="e.g. front pump assembly, 25mm bore"
                  className="mt-1 w-full bg-slate-800/50 border border-slate-700 rounded px-3 py-2 text-white text-sm placeholder-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <Button fullWidth onClick={analyze}>
                <Sparkles size={16} className="mr-2" /> Identify with AI
              </Button>
            </div>
          )}

          {error && (
            <div className="mt-4 flex items-start space-x-2 text-sm text-red-300 bg-red-500/5 border border-red-500/20 rounded-lg p-3">
              <AlertTriangle size={14} className="text-red-400 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* Right: review + RFQ */}
        <div className="glass-panel border border-white/5 rounded-2xl p-6 min-h-[400px] flex flex-col">
          <h2 className="text-sm font-semibold text-white flex items-center space-x-2 mb-4">
            <Sparkles size={16} className="text-cyan-400" />
            <span>Step 2 &middot; Review &amp; Broadcast</span>
          </h2>

          {!part && phase !== 'analyzing' && (
            <div className="flex-1 flex items-center justify-center text-center text-slate-500 text-sm px-6">
              Upload a photo on the left to see the AI identification here.
            </div>
          )}

          {phase === 'analyzing' && (
            <div className="flex-1 flex items-center justify-center text-slate-400 text-sm">
              <Loader2 size={16} className="animate-spin mr-2" /> Waiting for identification&hellip;
            </div>
          )}

          {part && (phase === 'review' || phase === 'broadcasting') && (
            <div className="flex-1 space-y-5">
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-[10px] font-mono uppercase tracking-widest text-cyan-400 mb-1">Detected</div>
                  <div className="text-xl font-bold text-white">{part.name}</div>
                  <div className="text-xs text-slate-400 mt-1">{part.category}</div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] font-mono uppercase tracking-widest text-slate-500">Confidence</div>
                  <div className="text-lg font-bold text-green-400">{Math.round(part.confidence * 100)}%</div>
                </div>
              </div>

              <div>
                <div className="text-[10px] font-mono uppercase tracking-widest text-slate-500 mb-2">Likely SKUs</div>
                <div className="flex flex-wrap gap-2">
                  {part.likelySkus.map((sku) => (
                    <span key={sku} className="text-xs font-mono bg-slate-800/70 border border-slate-700 text-slate-300 px-2 py-1 rounded">
                      {sku}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <div className="text-[10px] font-mono uppercase tracking-widest text-slate-500 mb-2">Specs</div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {part.specs.map((s) => (
                    <div key={s.label} className="bg-slate-800/40 border border-slate-800 rounded px-3 py-2">
                      <div className="text-slate-500 text-[10px] uppercase tracking-wider">{s.label}</div>
                      <div className="text-slate-200">{s.value}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Quantity</label>
                  <input type="number" min={1} value={quantity} onChange={(e) => setQuantity(Math.max(1, Number(e.target.value) || 1))}
                    className="mt-1 w-full bg-slate-800/50 border border-slate-700 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500" />
                </div>
                <div>
                  <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Needed by</label>
                  <input type="date" value={neededBy} onChange={(e) => setNeededBy(e.target.value)}
                    className="mt-1 w-full bg-slate-800/50 border border-slate-700 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500" />
                </div>
                <div className="col-span-2">
                  <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Urgency</label>
                  <div className="mt-1 grid grid-cols-3 gap-2">
                    {(['standard', 'rush', 'emergency'] as const).map((u) => (
                      <button key={u} onClick={() => setUrgency(u)}
                        className={`text-xs font-medium py-2 rounded border transition-colors ${
                          urgency === u
                            ? u === 'emergency' ? 'bg-red-500/10 border-red-500/40 text-red-300'
                              : u === 'rush' ? 'bg-amber-500/10 border-amber-500/40 text-amber-300'
                              : 'bg-blue-500/10 border-blue-500/40 text-blue-300'
                            : 'bg-slate-800/40 border-slate-700 text-slate-400 hover:text-white'
                        }`}>{u}</button>
                    ))}
                  </div>
                </div>
                <div className="col-span-2">
                  <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Notes to suppliers</label>
                  <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={2}
                    placeholder="Any compatibility, certification, or packaging requirements."
                    className="mt-1 w-full bg-slate-800/50 border border-slate-700 rounded px-3 py-2 text-white text-sm placeholder-slate-600 focus:outline-none focus:border-blue-500" />
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <button onClick={reset} className="text-xs text-slate-500 hover:text-white">Start over</button>
                <Button onClick={broadcast} disabled={phase === 'broadcasting'}>
                  {phase === 'broadcasting' ? (
                    <><Loader2 size={14} className="mr-2 animate-spin" /> Broadcasting&hellip;</>
                  ) : (
                    <><Send size={14} className="mr-2" /> Broadcast RFQ</>
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-start space-x-2 text-xs text-slate-500 px-1">
        <CheckCircle2 size={12} className="text-green-400 shrink-0 mt-0.5" />
        <span>Photos stay on your device &mdash; the demo uses local storage to simulate the two-sided flow.</span>
      </div>
    </div>
  );
};

export default SnapSource;
