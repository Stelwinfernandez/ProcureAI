import { useEffect, useState } from 'react';
import type { Rfq, Quote, Order, IdentifiedPart } from './types';

const KEY = 'procureai.state.v1';
const EVENT = 'procureai:change';

interface State {
  rfqs: Rfq[];
  quotes: Quote[];
  orders: Order[];
  identity: {
    manufacturer: { companyName: string; contactName: string; facility: string };
    supplier: { companyName: string; contactName: string; tag: string };
  };
}

const defaultState: State = {
  rfqs: [],
  quotes: [],
  orders: [],
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
    const parsed = JSON.parse(raw);
    return { ...defaultState, ...parsed };
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

  submitQuote(
    rfqId: string,
    q: Omit<Quote, 'id' | 'rfqId' | 'submittedAt'>,
  ): Quote {
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
      status: 'in_production',
    };

    update((s) => ({
      ...s,
      orders: [order, ...s.orders],
      rfqs: s.rfqs.map((r) => (r.id === rfq.id ? { ...r, status: 'awarded', awardedQuoteId: quote.id } : r)),
    }));
    return order;
  },

  resetDemo() {
    write(defaultState);
  },

  setIdentity(role: 'manufacturer' | 'supplier', patch: Partial<State['identity']['manufacturer']> & Partial<State['identity']['supplier']>) {
    update((s) => ({
      ...s,
      identity: { ...s.identity, [role]: { ...s.identity[role], ...patch } },
    }));
  },
};

export const getState = read;
