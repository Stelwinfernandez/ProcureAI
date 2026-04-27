import { actions } from './store';
import type { Rfq } from './types';

const AUTO_SUPPLIERS = [
  { name: 'Fastenal', tag: 'Fasteners & MRO', priceFactor: 1.0, leadDays: 1, stock: 420 },
  { name: 'Würth', tag: 'Industrial Supply', priceFactor: 1.04, leadDays: 2, stock: 180 },
  { name: 'Grainger', tag: 'Broadline MRO', priceFactor: 1.08, leadDays: 2, stock: 95 },
  { name: 'Motion Industries', tag: 'Bearings & Power', priceFactor: 0.96, leadDays: 3, stock: 260 },
  { name: 'MSC Industrial', tag: 'Metalworking', priceFactor: 1.02, leadDays: 2, stock: 140 },
  { name: 'Imperial Dade', tag: 'Facility & Packaging', priceFactor: 1.12, leadDays: 1, stock: 610 },
];

const basePriceFor = (category: string): number => {
  const map: Record<string, number> = {
    Bearings: 18.5,
    Fasteners: 0.42,
    Hydraulics: 86,
    Pneumatics: 64,
    Electrical: 27,
    Safety: 11,
    Sanitation: 7.5,
    'Power Transmission': 54,
    Tools: 38,
  };
  return map[category] ?? 22;
};

const jitter = (v: number, pct: number) => v * (1 + (Math.random() * 2 - 1) * pct);

export function scheduleAutoQuotes(rfq: Rfq) {
  // Pick 3-5 suppliers, stagger over 3-14s. Never respond for same supplier twice.
  const count = 3 + Math.floor(Math.random() * 3);
  const picks = [...AUTO_SUPPLIERS].sort(() => Math.random() - 0.5).slice(0, count);
  const base = basePriceFor(rfq.part.category);

  picks.forEach((s, i) => {
    const delay = 2500 + i * (1500 + Math.random() * 2000);
    setTimeout(() => {
      const unit = Math.max(0.1, jitter(base * s.priceFactor, 0.12));
      const total = unit * rfq.quantity;
      actions.submitQuote(rfq.id, {
        supplier: s.name,
        supplierTag: s.tag,
        unitPrice: Math.round(unit * 100) / 100,
        totalPrice: Math.round(total * 100) / 100,
        leadTimeDays: s.leadDays + (rfq.urgency === 'rush' ? 0 : Math.floor(Math.random() * 2)),
        stockAvailable: s.stock + Math.floor(Math.random() * 200),
        sku: rfq.part.likelySkus[0] ?? `${s.name.slice(0, 3).toUpperCase()}-${Math.floor(Math.random() * 9000 + 1000)}`,
        terms: rfq.urgency === 'emergency' ? 'Net 15' : 'Net 30',
        auto: true,
      });
    }, delay);
  });
}
