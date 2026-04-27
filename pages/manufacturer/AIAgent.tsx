import React, { useRef, useState } from 'react';
import { Sparkles, Send, User, Bot, Loader2 } from 'lucide-react';
import { ModuleHeader } from '../../components/app/ModulePage';
import { actions } from '../../lib/store';
import { scheduleAutoQuotes } from '../../lib/mock';
import { navigate } from '../../lib/router';

type Msg = { role: 'user' | 'agent'; text: string; action?: { label: string; do: () => void } };

const SUGGESTIONS = [
  'I need 12 hex cap screws M10x40 by Friday',
  'Source 50 deep-groove bearings 25mm bore, rush',
  'Quote pneumatic solenoid valves 24V, 5 units',
  'Compare my 3 latest RFQs and recommend suppliers',
];

const parseIntent = (text: string): { name?: string; qty?: number; urgency?: 'standard' | 'rush' | 'emergency'; category?: string } => {
  const lower = text.toLowerCase();
  const qtyMatch = lower.match(/(\d+)\s*(?:x|units?|pcs?|pieces?)?/);
  const qty = qtyMatch ? parseInt(qtyMatch[1]) : undefined;
  const urgency: 'standard' | 'rush' | 'emergency' =
    /\b(emergency|asap|down)\b/.test(lower) ? 'emergency' :
    /\b(rush|urgent|friday|tomorrow|same.day)\b/.test(lower) ? 'rush' : 'standard';
  let category = 'Other';
  if (/bearing/.test(lower)) category = 'Bearings';
  else if (/(screw|bolt|nut|fastener)/.test(lower)) category = 'Fasteners';
  else if (/hydraulic/.test(lower)) category = 'Hydraulics';
  else if (/(pneumatic|solenoid|valve)/.test(lower)) category = 'Pneumatics';
  else if (/(safety|ppe|glove)/.test(lower)) category = 'Safety';
  else if (/(sanit|clean|degreaser)/.test(lower)) category = 'Sanitation';
  else if (/(tool|mill|drill)/.test(lower)) category = 'Tools';
  const name = text.length > 80 ? text.slice(0, 80) + '…' : text;
  return { name, qty, urgency, category };
};

const AIAgent: React.FC = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: 'agent',
      text: 'Hi — I\'m your sourcing agent. Describe what you need in plain English and I\'ll draft an RFQ, suggest suppliers, or compare options. What are we sourcing today?',
    },
  ]);
  const [busy, setBusy] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const send = (text: string) => {
    const t = text.trim();
    if (!t) return;
    const user: Msg = { role: 'user', text: t };
    setMessages((m) => [...m, user]);
    setInput('');
    setBusy(true);

    setTimeout(() => {
      const intent = parseIntent(t);
      const { name = t, qty = 10, urgency = 'standard', category = 'Other' } = intent;

      const response: Msg = {
        role: 'agent',
        text:
          `Got it. Here's the draft RFQ I'll broadcast:\n\n` +
          `• **Part:** ${name}\n` +
          `• **Category:** ${category}\n` +
          `• **Quantity:** ${qty}\n` +
          `• **Urgency:** ${urgency}\n\n` +
          `I'll route this to the best-fit suppliers in the network. Confirm to broadcast.`,
        action: {
          label: 'Broadcast RFQ',
          do: () => {
            const rfq = actions.createRfq(
              {
                name,
                category,
                likelySkus: [],
                specs: [],
                confidence: 0.8,
              },
              {
                quantity: qty,
                neededBy: new Date(Date.now() + (urgency === 'emergency' ? 1 : urgency === 'rush' ? 3 : 7) * 86400000).toISOString().slice(0, 10),
                urgency,
                notes: `Drafted by AI Agent from: "${t}"`,
              },
            );
            scheduleAutoQuotes(rfq);
            navigate(`/app/m/rfqs/${rfq.id}`);
          },
        },
      };
      setMessages((m) => [...m, response]);
      setBusy(false);
      setTimeout(() => scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' }), 50);
    }, 900);
  };

  return (
    <div className="space-y-6">
      <ModuleHeader
        icon={Sparkles}
        title="Sourcing Agent"
        subtitle="Describe what you need — the agent drafts RFQs, routes suppliers, and surfaces tradeoffs."
        iconBg="from-violet-500/20 via-fuchsia-500/20 to-blue-500/20 border-violet-500/30"
        iconColor="text-violet-300"
      />

      <div className="grid lg:grid-cols-[1fr_300px] gap-6">
        <div className="glass-panel border border-white/5 rounded-2xl flex flex-col h-[600px]">
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-5 space-y-4">
            {messages.map((m, i) => (
              <div key={i} className={`flex items-start space-x-3 ${m.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                  m.role === 'user' ? 'bg-slate-700 text-slate-300' : 'bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white'
                }`}>
                  {m.role === 'user' ? <User size={14} /> : <Bot size={14} />}
                </div>
                <div className={`max-w-[80%] ${m.role === 'user' ? 'text-right' : ''}`}>
                  <div className={`inline-block px-4 py-3 rounded-2xl text-sm whitespace-pre-wrap ${
                    m.role === 'user' ? 'bg-slate-800 text-white' : 'bg-slate-900/80 border border-slate-800 text-slate-200'
                  }`}>
                    {m.text}
                  </div>
                  {m.action && (
                    <button
                      onClick={m.action.do}
                      className="mt-2 inline-flex items-center space-x-2 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white text-sm font-semibold"
                    >
                      <Sparkles size={12} /><span>{m.action.label}</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
            {busy && (
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center">
                  <Loader2 size={14} className="text-white animate-spin" />
                </div>
                <div className="text-sm text-slate-400">Analyzing...</div>
              </div>
            )}
          </div>

          <div className="border-t border-slate-800 p-4">
            <div className="flex items-center space-x-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && send(input)}
                placeholder="Describe what you need..."
                className="flex-1 bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-violet-500"
              />
              <button
                onClick={() => send(input)}
                disabled={!input.trim() || busy}
                className="px-4 py-2.5 rounded-lg bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 disabled:opacity-40 text-white"
              >
                <Send size={14} />
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="glass-panel border border-white/5 rounded-xl p-4">
            <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-3">Try</div>
            <div className="space-y-1.5">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  className="w-full text-left text-xs text-slate-300 hover:text-white bg-slate-800/30 hover:bg-slate-800/70 border border-slate-800 rounded-lg p-3 transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAgent;
