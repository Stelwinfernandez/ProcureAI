import React from 'react';
import { Zap, Wrench, Activity, ArrowRight, AlertCircle } from 'lucide-react';
import { ModuleHeader, Stat, Card } from '../../components/app/ModulePage';
import { Button } from '../../components/Button';
import { navigate } from '../../lib/router';

interface WorkOrder {
  id: string;
  asset: string;
  issue: string;
  requiredParts: { sku: string; name: string; qty: number }[];
  priority: 'low' | 'medium' | 'high';
  status: 'new' | 'awaiting_parts' | 'scheduled';
  downtime: string;
}

const WORK_ORDERS: WorkOrder[] = [
  {
    id: 'WO-2204',
    asset: 'CNC Mill #3',
    issue: 'Spindle bearing failure',
    requiredParts: [{ sku: 'SKF-7208', name: 'Angular Contact Bearing 40mm', qty: 2 }],
    priority: 'high',
    status: 'new',
    downtime: '4.2 hrs',
  },
  {
    id: 'WO-2203',
    asset: 'Conveyor Line A',
    issue: 'Motor coupling worn',
    requiredParts: [{ sku: 'LOV-L110', name: 'Jaw Coupling L110', qty: 1 }, { sku: 'LOV-SPIDER-110', name: 'Urethane Spider', qty: 1 }],
    priority: 'medium',
    status: 'awaiting_parts',
    downtime: '1.8 hrs',
  },
  {
    id: 'WO-2202',
    asset: 'Hydraulic Press #2',
    issue: 'Solenoid valve replacement',
    requiredParts: [{ sku: 'SMC-VF3130', name: 'Solenoid Valve 3/2 24V', qty: 1 }],
    priority: 'low',
    status: 'scheduled',
    downtime: '0.5 hrs',
  },
];

const priorityStyle: Record<string, string> = {
  high: 'border-red-500/30 bg-red-500/10 text-red-300',
  medium: 'border-amber-500/30 bg-amber-500/10 text-amber-300',
  low: 'border-slate-500/30 bg-slate-500/10 text-slate-300',
};

const MroAutomation: React.FC = () => {
  const open = WORK_ORDERS.filter((w) => w.status !== 'scheduled');
  const criticalDowntime = WORK_ORDERS.filter((w) => w.priority === 'high').reduce((a, w) => a + parseFloat(w.downtime), 0);

  return (
    <div className="space-y-6">
      <ModuleHeader
        icon={Zap}
        title="MRO Automation"
        subtitle="Maintenance-to-Procurement (M2P): turn CMMS work orders into RFQs automatically."
        iconBg="from-amber-500/20 to-orange-500/20 border-amber-500/30"
        iconColor="text-amber-300"
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Stat label="Open work orders" value={open.length} color="text-amber-400" icon={Wrench} />
        <Stat label="Critical downtime" value={`${criticalDowntime.toFixed(1)}h`} color="text-red-400" icon={AlertCircle} />
        <Stat label="Auto-RFQ today" value="12" color="text-emerald-400" icon={Zap} />
        <Stat label="Uptime" value="94.2%" color="text-cyan-400" icon={Activity} sub="rolling 30d" />
      </div>

      <Card title="Active work orders" actions={<span className="text-xs text-slate-500">CMMS sync: 2m ago</span>}>
        <div className="divide-y divide-slate-800/60 -mx-5">
          {WORK_ORDERS.map((w) => (
            <div key={w.id} className="px-5 py-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-white font-semibold">{w.id}</span>
                    <span className={`text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded border ${priorityStyle[w.priority]}`}>{w.priority}</span>
                  </div>
                  <div className="text-sm text-slate-300 mt-1">{w.asset} &middot; {w.issue}</div>
                  <div className="text-xs text-slate-500">Est. downtime: {w.downtime}</div>
                </div>
                <span className="text-[10px] uppercase tracking-wider font-semibold px-2 py-1 rounded border border-slate-700 bg-slate-800/50 text-slate-300 capitalize">
                  {w.status.replace('_', ' ')}
                </span>
              </div>
              <div className="space-y-1">
                {w.requiredParts.map((p) => (
                  <div key={p.sku} className="flex items-center justify-between text-xs bg-slate-800/40 border border-slate-800 rounded px-3 py-2">
                    <div>
                      <span className="text-white font-medium">{p.name}</span>
                      <span className="text-slate-500 ml-2 font-mono">{p.sku}</span>
                    </div>
                    <span className="text-slate-400">qty {p.qty}</span>
                  </div>
                ))}
              </div>
              {w.status !== 'scheduled' && (
                <div className="mt-3 flex justify-end">
                  <Button size="sm" variant="outline" onClick={() => navigate('/app/m/snap')}>
                    Generate RFQ <ArrowRight size={12} className="ml-1.5" />
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default MroAutomation;
