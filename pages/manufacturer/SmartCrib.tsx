import React from 'react';
import { Boxes, AlertTriangle, TrendingDown, RefreshCw, Package } from 'lucide-react';
import { ModuleHeader, Stat, Card } from '../../components/app/ModulePage';
import { Button } from '../../components/Button';
import { navigate } from '../../lib/router';

interface CribItem {
  sku: string;
  name: string;
  category: string;
  onHand: number;
  reorderPoint: number;
  reorderQty: number;
  preferredSupplier: string;
  avgUsagePerWeek: number;
  binLocation: string;
}

const CRIB: CribItem[] = [
  { sku: 'SKF-6205-2RS', name: 'Deep Groove Ball Bearing 25mm', category: 'Bearings', onHand: 6, reorderPoint: 12, reorderQty: 48, preferredSupplier: 'Motion Industries', avgUsagePerWeek: 4, binLocation: 'A-12-03' },
  { sku: 'HEX-M10x40-8.8', name: 'Hex Cap Screw M10x40 Grade 8.8 ZP', category: 'Fasteners', onHand: 140, reorderPoint: 200, reorderQty: 500, preferredSupplier: 'Fastenal', avgUsagePerWeek: 65, binLocation: 'B-04-11' },
  { sku: 'SMC-VQ2100-5', name: 'Pneumatic Solenoid Valve 5/2 24V', category: 'Pneumatics', onHand: 3, reorderPoint: 4, reorderQty: 10, preferredSupplier: 'Grainger', avgUsagePerWeek: 1, binLocation: 'C-08-02' },
  { sku: 'IMP-CLN-7', name: 'Industrial Degreaser 5 gal', category: 'Sanitation', onHand: 12, reorderPoint: 6, reorderQty: 24, preferredSupplier: 'Imperial Dade', avgUsagePerWeek: 2, binLocation: 'D-02-05' },
  { sku: 'WRT-LOC-242', name: 'Threadlocker 242 Blue 50ml', category: 'Chemicals', onHand: 2, reorderPoint: 8, reorderQty: 20, preferredSupplier: 'Würth', avgUsagePerWeek: 3, binLocation: 'B-09-07' },
  { sku: 'MSC-ENDMILL-1/2', name: '1/2" 4-Flute Carbide End Mill', category: 'Tools', onHand: 18, reorderPoint: 10, reorderQty: 25, preferredSupplier: 'MSC Industrial', avgUsagePerWeek: 3, binLocation: 'E-01-04' },
];

const SmartCrib: React.FC = () => {
  const belowReorder = CRIB.filter((i) => i.onHand <= i.reorderPoint);
  const critical = CRIB.filter((i) => i.onHand <= Math.floor(i.reorderPoint / 2));
  const weeksCover = (i: CribItem) => (i.avgUsagePerWeek > 0 ? (i.onHand / i.avgUsagePerWeek).toFixed(1) : '∞');

  return (
    <div className="space-y-6">
      <ModuleHeader
        icon={Boxes}
        title="Smart Crib"
        subtitle="Vendor-managed inventory with reorder points and automated replenishment."
        iconBg="from-blue-500/20 to-cyan-500/20 border-blue-500/30"
        iconColor="text-cyan-300"
        actions={
          <Button variant="outline" size="sm" onClick={() => navigate('/app/m/snap')}>
            <Package size={12} className="mr-1.5" /> Add SKU
          </Button>
        }
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Stat label="SKUs tracked" value={CRIB.length} color="text-white" icon={Boxes} />
        <Stat label="Below reorder" value={belowReorder.length} color="text-amber-400" icon={TrendingDown} />
        <Stat label="Critical" value={critical.length} color="text-red-400" icon={AlertTriangle} />
        <Stat label="Auto-replenishment" value="Active" color="text-emerald-400" icon={RefreshCw} />
      </div>

      <Card title="Inventory status">
        <div className="divide-y divide-slate-800/60 -mx-5">
          {CRIB.map((item) => {
            const pct = Math.min(100, (item.onHand / (item.reorderPoint * 2)) * 100);
            const state: 'critical' | 'low' | 'ok' = item.onHand <= Math.floor(item.reorderPoint / 2) ? 'critical' : item.onHand <= item.reorderPoint ? 'low' : 'ok';
            const barColor = state === 'critical' ? 'bg-red-500' : state === 'low' ? 'bg-amber-500' : 'bg-emerald-500';
            return (
              <div key={item.sku} className="px-5 py-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="text-sm text-white font-medium">{item.name}</div>
                    <div className="text-xs text-slate-500 font-mono">{item.sku} &middot; {item.binLocation} &middot; {item.preferredSupplier}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-mono font-bold text-white">{item.onHand} <span className="text-slate-500 text-xs font-normal">on hand</span></div>
                    <div className="text-[10px] text-slate-500">{weeksCover(item)} wks cover</div>
                  </div>
                </div>
                <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden mt-3">
                  <div className={`h-full ${barColor}`} style={{ width: `${pct}%` }}></div>
                </div>
                <div className="flex items-center justify-between text-[10px] mt-1.5">
                  <span className="text-slate-500">Reorder @ {item.reorderPoint} &middot; qty {item.reorderQty}</span>
                  {state !== 'ok' && (
                    <button onClick={() => navigate('/app/m/snap')} className="text-teal-300 hover:text-teal-200 font-medium">
                      Replenish &rarr;
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
};

export default SmartCrib;
