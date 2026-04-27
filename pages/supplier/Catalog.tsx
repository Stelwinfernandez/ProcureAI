import React, { useState } from 'react';
import { BookOpen, Plus, Search, Package } from 'lucide-react';
import { ModuleHeader, Stat, Card } from '../../components/app/ModulePage';
import { Button } from '../../components/Button';

interface CatalogItem { sku: string; name: string; category: string; price: number; stock: number; lead: number; }

const SEED: CatalogItem[] = [
  { sku: 'SKF-6205-2RS', name: 'Deep Groove Ball Bearing 25mm', category: 'Bearings', price: 18.40, stock: 420, lead: 1 },
  { sku: 'HEX-M10x40-8.8', name: 'Hex Cap Screw M10x40 Grade 8.8', category: 'Fasteners', price: 0.42, stock: 12500, lead: 1 },
  { sku: 'SMC-VQ2100-5', name: 'Pneumatic Solenoid Valve 5/2 24V', category: 'Pneumatics', price: 68.00, stock: 64, lead: 2 },
  { sku: 'WRT-LOC-242', name: 'Threadlocker 242 Blue 50ml', category: 'Chemicals', price: 9.80, stock: 180, lead: 1 },
  { sku: 'MSC-EM-0.5', name: '1/2" 4-Flute Carbide End Mill', category: 'Tools', price: 42.50, stock: 86, lead: 2 },
  { sku: 'FST-NUT-M10', name: 'Hex Nut M10 Zinc', category: 'Fasteners', price: 0.08, stock: 52000, lead: 1 },
];

const Catalog: React.FC = () => {
  const [q, setQ] = useState('');
  const filtered = SEED.filter((i) => !q || i.name.toLowerCase().includes(q.toLowerCase()) || i.sku.toLowerCase().includes(q.toLowerCase()));

  return (
    <div className="space-y-6">
      <ModuleHeader
        icon={BookOpen}
        iconBg="from-cyan-500/20 to-blue-500/20 border-cyan-500/30"
        iconColor="text-cyan-300"
        title="Product Catalog"
        subtitle="Your live price/stock list. Keeps auto-quotes competitive and accurate."
        actions={<Button variant="secondary" size="sm"><Plus size={12} className="mr-1.5" />Add SKU</Button>}
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Stat label="SKUs" value={SEED.length} color="text-white" icon={Package} />
        <Stat label="In stock" value={SEED.reduce((a, i) => a + i.stock, 0).toLocaleString()} color="text-emerald-400" icon={Package} />
        <Stat label="Categories" value={new Set(SEED.map((i) => i.category)).size} color="text-cyan-400" icon={BookOpen} />
        <Stat label="Avg lead" value={`${(SEED.reduce((a, i) => a + i.lead, 0) / SEED.length).toFixed(1)}d`} color="text-blue-400" icon={Package} />
      </div>

      <div className="relative">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search SKU or name..."
          className="w-full bg-slate-800/50 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-white text-sm focus:outline-none focus:border-cyan-500" />
      </div>

      <Card>
        <div className="grid grid-cols-12 px-2 pb-3 text-[10px] font-semibold uppercase tracking-widest text-slate-500 border-b border-slate-800">
          <div className="col-span-5">Item</div>
          <div className="col-span-2">Category</div>
          <div className="col-span-2 text-right">Price</div>
          <div className="col-span-2 text-right">Stock</div>
          <div className="col-span-1 text-right">Lead</div>
        </div>
        <div className="divide-y divide-slate-800/60">
          {filtered.map((i) => (
            <div key={i.sku} className="grid grid-cols-12 px-2 py-3 items-center text-sm">
              <div className="col-span-5">
                <div className="text-white font-medium">{i.name}</div>
                <div className="text-xs text-slate-500 font-mono">{i.sku}</div>
              </div>
              <div className="col-span-2 text-slate-300 text-xs">{i.category}</div>
              <div className="col-span-2 text-right text-white font-mono">${i.price.toFixed(2)}</div>
              <div className="col-span-2 text-right text-slate-300">{i.stock.toLocaleString()}</div>
              <div className="col-span-1 text-right text-slate-300">{i.lead}d</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default Catalog;
