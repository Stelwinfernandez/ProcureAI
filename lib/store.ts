import { useEffect, useState } from 'react';
import type { Rfq, Quote, Order, IdentifiedPart, Supplier, SupplierScorecard, OrderStatus, OrderEvent } from './types';

const KEY = 'procureai.state.v2';
const EVENT = 'procureai:change';

interface State {
  rfqs: Rfq[];
  quotes: Quote[];
  orders: Order[];
  suppliers: Supplier[];
  identity: {
    manufacturer: { companyName: string; contactName: string; facility: string };
    supplier: { companyName: string; contactName: string; tag: string };
  };
}

const SEEDED_SUPPLIERS: Supplier[] = [
  {
    id: 'sup-fastenal',
    name: 'Fastenal',
    tag: 'Fasteners & MRO',
    categories: ['Fasteners', 'Tools', 'Safety'],
    region: 'North America',
    verified: true,
    certifications: ['ISO 9001', 'ISO 14001'],
    joinedAt: Date.now() - 1000 * 60 * 60 * 24 * 540,
    logoLetter: 'F',
    color: 'blue',
  },
  {
    id: 'sup-wurth',
    name: 'Würth',
    tag: 'Industrial Supply',
    categories: ['Fasteners', 'Chemicals', 'Tools', 'Safety'],
    region: 'Global',
    verified: true,
    certifications: ['ISO 9001', 'IATF 16949'],
    joinedAt: Date.now() - 1000 * 60 * 60 * 24 * 480,
    logoLetter: 'W',
    color: 'red',
  },
  {
    id: 'sup-imperial-dade',
    name: 'Imperial Dade',
    tag: 'Facility & Packaging',
    categories: ['Sanitation', 'Safety', 'Packaging'],
    region: 'North America',
    verified: true,
    certifications: ['ISO 9001'],
    joinedAt: Date.now() - 1000 * 60 * 60 * 24 * 300,
    logoLetter: 'I',
    color: 'emerald',
  },
  {
    id: 'sup-grainger',
    name: 'Grainger',
    tag: 'Broadline MRO',
    categories: ['Electrical', 'Tools', 'Safety', 'Power Transmission', 'Pneumatics'],
    region: 'North America',
    verified: true,
    certifications: ['ISO 9001', 'ISO 14001', 'OHSAS 18001'],
    joinedAt: Date.now() - 1000 * 60 * 60 * 24 * 720,
    logoLetter: 'G',
    color: 'red',
  },
  {
    id: 'sup-msc',
    name: 'MSC Industrial',
    tag: 'Metalworking',
    categories: ['Tools', 'Metalworking', 'Fasteners'],
    region: 'North America',
    verified: true,
    certifications: ['ISO 9001'],
    joinedAt: Date.now() - 1000 * 60 * 60 * 24 * 400,
    logoLetter: 'M',
    color: 'violet',
  },
  {
    id: 'sup-motion',
    name: 'Motion Industries',
    tag: 'Bearings & Power',
    categories: ['Bearings', 'Power Transmission', 'Hydraulics', 'Pneumatics'],
    region: 'North America',
    verified: true,
    certifications: ['ISO 9001', 'AS9100'],
    joinedAt: Date.now() - 1000 * 60 * 60 * 24 * 610,
    logoLetter: 'M',
    color: 'amber',
  },
];

const defaultState: State = {
  rfqs: [],
  quotes: [],
  orders: [],
  suppliers: SEEDED_SUPPLIERS,
  identity: {
    manufacturer: { companyName: 'Acme Manufacturing', contactName: 'Jane Smith', facility: 'Belleville Plant #2' },
    supplier: { companyName: 'Fastenal', contactName: 'Alex Ruiz', tag: 'Fasteners & MRO' },
  },
};

const read = (): State => {
  if (typeof window === 'undefined') return defaultState;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return defaultState;
    const parsed = JSON.parse(raw) as Partial<State>;
    return {
      ...defaultState,
      ...parsed,
      suppliers: parsed.suppliers && parsed.suppliers.length ? parsed.suppliers : SEEDED_SUPPLIERS,
    };
  } catch {
    return defaultState;
  }
};

const write = (next: State) => {
  localStorage.setItem(KEY, JSON.stringify(next));
  window.dispatchEvent(new CustomEvent(EVENT));
};

const update = (fn: (s: State) => State) => {
  const next = fn(read());
  write(next);
  return next;
};

export const useStore = (): State => {
  const [state, setState] = useState<State>(() => read());
  useEffect(() => {
    const sync = () => setState(read());
    window.addEventListener(EVENT, sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener(EVENT, sync);
      window.removeEventListener('storage', sync);
    };
  }, []);
  return state;
};

export const actions = {
  createRfq(
    part: IdentifiedPart,
    opts: { quantity: number; neededBy: string; urgency: Rfq['urgency']; notes: string; imageDataUrl?: string },
  ): Rfq {
    const state = read();
    const rfq: Rfq = {
      id: `RFQ-${Math.floor(Math.random() * 9000 + 1000)}`,
      createdAt: Date.now(),
      buyer: state.identity.manufacturer.companyName,
      facility: state.identity.manufacturer.facility,
      part,
      quantity: opts.quantity,
      neededBy: opts.neededBy,
      urgency: opts.urgency,
      notes: opts.notes,
      imageDataUrl: opts.imageDataUrl,
      status: 'open',
    };
    update((s) => ({ ...s, rfqs: [rfq, ...s.rfqs] }));
    return rfq;
  },

  submitQuote(rfqId: string, q: Omit<Quote, 'id' | 'rfqId' | 'submittedAt'>): Quote {
    const quote: Quote = {
      ...q,
      id: `Q-${Math.floor(Math.random() * 90000 + 10000)}`,
      rfqId,
      submittedAt: Date.now(),
    };
    update((s) => ({
      ...s,
      quotes: [quote, ...s.quotes],
      rfqs: s.rfqs.map((r) => (r.id === rfqId && r.status === 'open' ? { ...r, status: 'quoted' } : r)),
    }));
    return quote;
  },

  acceptQuote(quoteId: string): Order | null {
    const state = read();
    const quote = state.quotes.find((q) => q.id === quoteId);
    if (!quote) return null;
    const rfq = state.rfqs.find((r) => r.id === quote.rfqId);
    if (!rfq) return null;

    const order: Order = {
      id: `PO-${Math.floor(Math.random() * 90000 + 10000)}`,
      rfqId: rfq.id,
      quoteId: quote.id,
      supplier: quote.supplier,
      total: quote.totalPrice,
      placedAt: Date.now(),
      eta: new Date(Date.now() + quote.leadTimeDays * 86400000).toISOString().slice(0, 10),
      status: 'pending',
      lineItems: [
        {
          sku: quote.sku,
          description: rfq.part.name,
          quantity: rfq.quantity,
          unitPrice: quote.unitPrice,
          lineTotal: quote.totalPrice,
        },
      ],
      timeline: [
        { ts: Date.now(), event: 'Order placed', actor: rfq.buyer, detail: `Awarded to ${quote.supplier} at $${quote.totalPrice.toFixed(2)}` },
      ],
      invoiceStatus: 'pending',
      terms: quote.terms,
      buyer: rfq.buyer,
      facility: rfq.facility,
    };

    update((s) => ({
      ...s,
      orders: [order, ...s.orders],
      rfqs: s.rfqs.map((r) => (r.id === rfq.id ? { ...r, status: 'awarded', awardedQuoteId: quote.id } : r)),
    }));
    return order;
  },

  updateOrderStatus(orderId: string, next: OrderStatus, actor: string, detail?: string) {
    update((s) => ({
      ...s,
      orders: s.orders.map((o) => {
        if (o.id !== orderId) return o;
        const event: OrderEvent = {
          ts: Date.now(),
          event: ({
            pending: 'Order placed',
            confirmed: 'Supplier confirmed',
            in_production: 'Moved to production',
            shipped: 'Shipped',
            delivered: 'Delivered',
            cancelled: 'Cancelled',
          } as Record<OrderStatus, string>)[next],
          actor,
          detail,
        };
        return { ...o, status: next, timeline: [...o.timeline, event] };
      }),
    }));
  },

  setTracking(orderId: string, carrier: string, trackingNumber: string, actor: string) {
    update((s) => ({
      ...s,
      orders: s.orders.map((o) => {
        if (o.id !== orderId) return o;
        return {
          ...o,
          carrier,
          trackingNumber,
          timeline: [
            ...o.timeline,
            { ts: Date.now(), event: 'Tracking added', actor, detail: `${carrier} · ${trackingNumber}` },
          ],
        };
      }),
    }));
  },

  markInvoiced(orderId: string, actor: string) {
    update((s) => ({
      ...s,
      orders: s.orders.map((o) =>
        o.id === orderId
          ? { ...o, invoiceStatus: 'invoiced', timeline: [...o.timeline, { ts: Date.now(), event: 'Invoice sent', actor }] }
          : o,
      ),
    }));
  },

  markPaid(orderId: string, actor: string) {
    update((s) => ({
      ...s,
      orders: s.orders.map((o) =>
        o.id === orderId
          ? { ...o, invoiceStatus: 'paid', timeline: [...o.timeline, { ts: Date.now(), event: 'Payment received', actor }] }
          : o,
      ),
    }));
  },

  resetDemo() {
    write(defaultState);
  },

  setIdentity(
    role: 'manufacturer' | 'supplier',
    patch: Partial<State['identity']['manufacturer']> & Partial<State['identity']['supplier']>,
  ) {
    update((s) => ({
      ...s,
      identity: { ...s.identity, [role]: { ...s.identity[role], ...patch } },
    }));
  },
};

export const getState = read;

const clamp = (v: number, lo = 0, hi = 1) => Math.max(lo, Math.min(hi, v));

export const scorecardFor = (supplier: Supplier, state: State): SupplierScorecard => {
  const myQuotes = state.quotes.filter((q) => q.supplier === supplier.name);
  const myOrders = state.orders.filter((o) => o.supplier === supplier.name);
  const wins = myOrders.length;
  const quotesSubmitted = myQuotes.length;
  const winRate = quotesSubmitted > 0 ? wins / quotesSubmitted : 0.42 + Math.random() * 0.1;
  const revenue = myOrders.reduce((a, o) => a + o.total, 0);
  const activeOrders = myOrders.filter((o) => o.status !== 'delivered' && o.status !== 'cancelled').length;

  const onTimeOrders = myOrders.filter((o) => {
    if (o.status !== 'delivered') return false;
    return new Date(o.eta).getTime() >= (o.timeline.find((e) => e.event === 'Delivered')?.ts ?? Date.now());
  }).length;
  const deliveredCount = myOrders.filter((o) => o.status === 'delivered').length;
  const onTimeRate = deliveredCount > 0 ? onTimeOrders / deliveredCount : 0.94;

  const avgLeadDays = myQuotes.length > 0 ? myQuotes.reduce((a, q) => a + q.leadTimeDays, 0) / myQuotes.length : 2.2;
  const avgResponseMinutes = myQuotes.length > 0
    ? myQuotes.reduce((a, q) => {
        const rfq = state.rfqs.find((r) => r.id === q.rfqId);
        if (!rfq) return a;
        return a + (q.submittedAt - rfq.createdAt) / 60000;
      }, 0) / myQuotes.length
    : 4.5;

  let priceCompetitivenessPct = 0.72;
  if (myQuotes.length > 0) {
    const diffs = myQuotes.map((q) => {
      const peers = state.quotes.filter((p) => p.rfqId === q.rfqId);
      if (peers.length < 2) return 0;
      const best = Math.min(...peers.map((p) => p.totalPrice));
      return best === 0 ? 0 : (q.totalPrice - best) / best;
    });
    const avgOver = diffs.reduce((a, d) => a + d, 0) / diffs.length;
    priceCompetitivenessPct = clamp(1 - avgOver);
  }

  // Quality score: blend of on-time, response, and price competitiveness on 0-5 scale
  const qualityScore = clamp((onTimeRate * 0.4 + priceCompetitivenessPct * 0.35 + clamp(1 - avgResponseMinutes / 20) * 0.25) * 5, 0, 5);

  const lastActivityAt =
    [...myQuotes.map((q) => q.submittedAt), ...myOrders.map((o) => o.placedAt), ...myOrders.flatMap((o) => o.timeline.map((e) => e.ts))]
      .sort((a, b) => b - a)[0] ?? null;

  return {
    supplier,
    quotesSubmitted,
    ordersWon: wins,
    winRate,
    revenue,
    onTimeRate,
    qualityScore,
    avgLeadDays,
    avgResponseMinutes,
    priceCompetitivenessPct,
    activeOrders,
    lastActivityAt,
  };
};

export const allScorecards = (state: State): SupplierScorecard[] =>
  state.suppliers.map((s) => scorecardFor(s, state));
