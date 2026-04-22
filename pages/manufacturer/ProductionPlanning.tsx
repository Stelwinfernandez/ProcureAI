import React from 'react';
import { FactoryIcon, Calendar, Package, Clock, CheckCircle2 } from 'lucide-react';
import { Factory } from 'lucide-react';
import { ModuleHeader, Stat, Card } from '../../components/app/ModulePage';

interface Run {
  id: string;
  product: string;
  startAt: string;
  endAt: string;
  line: string;
  quantity: number;
  bomStatus: 'green' | 'yellow' | 'red';
  missingParts: string[];
}

const RUNS: Run[] = [
  { id: 'PR-3041', product: 'Pump Assembly P-200', startAt: 'Apr 23 06:00', endAt: 'Apr 24 18:00', line: 'Line 1', quantity: 120, bomStatus: 'green', missingParts: [] },
  { id: 'PR-3042', product: 'Valve Manifold VM-08', startAt: 'Apr 24 08:00', endAt: 'Apr 25 16:00', line: 'Line 2', quantity: 45, bomStatus: 'yellow', missingParts: ['Solenoid SMC-VQ2100'] },
  { id: 'PR-3043', product: 'Conveyor Drive CD-5', startAt: 'Apr 25 06:00', endAt: 'Apr 26 20:00', line: 'Line 1', quantity: 30, bomStatus: 'red', missingParts: ['Gearmotor GM-40', 'Chain ANSI 80'] },
  { id: 'PR-3044', product: 'Hydraulic Cylinder HC-3', startAt: 'Apr 26 06:00', endAt: 'Apr 27 14:00', line: 'Line 3', quantity: 60, bomStatus: 'green', missingParts: [] },
];

const bomStyle: Record<string, string> = {
  green: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300',
  yellow: 'border-amber-500/30 bg-amber-500/10 text-amber-300',
  red: 'border-red-500/30 bg-red-500/10 text-red-300',
};

const ProductionPlanning: React.FC = () => {
  const blocked = RUNS.filter((r) => r.bomStatus === 'red').length;
  const atRisk = RUNS.filter((r) => r.bomStatus === 'yellow').length;

  return (
    <div className="space-y-6">
      <ModuleHeader
        icon={Factory}
        title="Production Planning"
        subtitle="Link your production schedule to procurement. See BOM readiness at a glance."
        iconBg="from-orange-500/20 to-red-500/20 border-orange-500/30"
        iconColor="text-orange-300"
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Stat label="Scheduled runs" value={RUNS.length} color="text-white" icon={Calendar} />
        <Stat label="Ready" value={RUNS.length - blocked - atRisk} color="text-emerald-400" icon={CheckCircle2} />
        <Stat label="At risk" value={atRisk} color="text-amber-400" icon={Clock} />
        <Stat label="Blocked" value={blocked} color="text-red-400" icon={Package} />
      </div>

      <Card title="Upcoming production schedule">
        <div className="divide-y divide-slate-800/60 -mx-5">
          {RUNS.map((r) => (
            <div key={r.id} className="px-5 py-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400">
                  <FactoryIcon size={16} />
                </div>
                <div>
                  <div className="text-sm text-white font-medium">{r.product}</div>
                  <div className="text-xs text-slate-500">{r.id} &middot; {r.line} &middot; qty {r.quantity}</div>
                  <div className="text-[10px] text-slate-600 font-mono mt-0.5">{r.startAt} &rarr; {r.endAt}</div>
                </div>
              </div>
              <div className="text-right">
                <span className={`text-[10px] uppercase tracking-wider font-semibold px-2 py-1 rounded border ${bomStyle[r.bomStatus]}`}>
                  BOM {r.bomStatus === 'green' ? 'ready' : r.bomStatus === 'yellow' ? 'at risk' : 'blocked'}
                </span>
                {r.missingParts.length > 0 && (
                  <div className="text-[10px] text-amber-300 mt-1.5 max-w-[200px]">Missing: {r.missingParts.join(', ')}</div>
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default ProductionPlanning;
