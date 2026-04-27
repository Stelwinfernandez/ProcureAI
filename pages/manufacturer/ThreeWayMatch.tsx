import React, { useMemo } from 'react';
import { CheckCircle2, XCircle, AlertTriangle, FileCheck, FileText, PackageCheck, DollarSign } from 'lucide-react';
import { ModuleHeader, Stat, Card } from '../../components/app/ModulePage';
import { actions, useStore } from '../../lib/store';
import { navigate } from '../../lib/router';
import type { Order } from '../../lib/types';

interface MatchRow {
  order: Order;
  poOk: boolean;
  grnOk: boolean;
  invoiceOk: boolean;
  matched: boolean;
}

const ThreeWayMatch: React.FC = () => {
  const store = useStore();

  const rows = useMemo<MatchRow[]>(() => {
    return store.orders.map((o) => {
      const poOk = true; // PO always exists
      const grnOk = o.status === 'delivered';
      const invoiceOk = o.invoiceStatus === 'invoiced' || o.invoiceStatus === 'paid';
      return { order: o, poOk, grnOk, invoiceOk, matched: poOk && grnOk && invoiceOk };
    });
  }, [store.orders]);

  const matched = rows.filter((r) => r.matched).length;
  const pending = rows.filter((r) => !r.matched && r.order.status !== 'cancelled').length;
  const exceptions = rows.filter((r) => r.grnOk && !r.invoiceOk).length;

  return (
    <div className="space-y-6">
      <ModuleHeader
        icon={FileCheck}
        title="3-Way Matching"
        subtitle="Automated reconciliation of Purchase Order, Goods Receipt, and Invoice before payment."
        iconBg="from-emerald-500/20 to-green-500/20 border-emerald-500/30"
        iconColor="text-emerald-300"
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Stat label="Matched" value={matched} color="text-emerald-400" icon={CheckCircle2} />
        <Stat label="Pending match" value={pending} color="text-amber-400" icon={AlertTriangle} />
        <Stat label="Invoice exceptions" value={exceptions} color="text-cyan-400" icon={FileText} />
        <Stat label="Total POs" value={rows.length} color="text-white" icon={DollarSign} />
      </div>

      <Card title="Reconciliation queue">
        {rows.length === 0 ? (
          <div className="py-12 text-center text-slate-500 text-sm">No purchase orders to reconcile yet.</div>
        ) : (
          <div className="divide-y divide-slate-800/60 -mx-5">
            {rows.map(({ order, poOk, grnOk, invoiceOk, matched }) => (
              <div key={order.id} className="px-5 py-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <button onClick={() => navigate(`/app/m/orders/${order.id}`)} className="text-sm text-white font-medium hover:text-teal-300">
                      {order.id} &middot; {order.lineItems[0]?.description ?? 'Order'}
                    </button>
                    <div className="text-xs text-slate-500">{order.supplier} &middot; ${order.total.toFixed(2)}</div>
                  </div>
                  <span className={`text-[10px] uppercase tracking-wider font-semibold px-2 py-1 rounded border ${
                    matched ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300' :
                    order.status === 'cancelled' ? 'border-slate-500/30 bg-slate-500/10 text-slate-400' :
                    'border-amber-500/30 bg-amber-500/10 text-amber-300'
                  }`}>
                    {matched ? 'Matched' : order.status === 'cancelled' ? 'Cancelled' : 'Awaiting'}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <MatchBadge label="PO" ok={poOk} icon={FileText} detail={`$${order.total.toFixed(2)}`} />
                  <MatchBadge label="Goods Receipt" ok={grnOk} icon={PackageCheck} detail={grnOk ? 'Delivered' : 'Pending delivery'} />
                  <MatchBadge label="Invoice" ok={invoiceOk} icon={DollarSign} detail={order.invoiceStatus} />
                </div>
                {!matched && grnOk && order.status !== 'cancelled' && !invoiceOk && (
                  <button
                    onClick={() => actions.markInvoiced(order.id, 'Matching bot')}
                    className="mt-3 text-xs text-teal-300 hover:text-teal-200"
                  >
                    Request invoice from {order.supplier} &rarr;
                  </button>
                )}
                {matched && order.invoiceStatus === 'invoiced' && (
                  <button
                    onClick={() => actions.markPaid(order.id, 'AP Automation')}
                    className="mt-3 text-xs text-emerald-300 hover:text-emerald-200"
                  >
                    Release payment &rarr;
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </Card>

      <Card title="How matching works">
        <ol className="space-y-3 text-sm">
          {[
            ['PO', 'Generated automatically when a buyer awards a supplier quote.'],
            ['Goods Receipt', 'Captured when the order is marked delivered and quantities match the PO.'],
            ['Invoice', 'Compared line-by-line against PO pricing and GRN quantities before AP releases payment.'],
          ].map(([title, desc]) => (
            <li key={title} className="flex items-start space-x-3">
              <div className="w-6 h-6 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-[11px] font-bold flex items-center justify-center shrink-0">✓</div>
              <div>
                <div className="text-white font-medium">{title}</div>
                <div className="text-slate-400 text-xs">{desc}</div>
              </div>
            </li>
          ))}
        </ol>
      </Card>
    </div>
  );
};

const MatchBadge: React.FC<{ label: string; ok: boolean; icon: React.ComponentType<{ size?: number; className?: string }>; detail: string }> = ({ label, ok, icon: Icon, detail }) => (
  <div className={`rounded-lg border p-3 ${ok ? 'border-emerald-500/30 bg-emerald-500/5' : 'border-slate-700 bg-slate-800/30'}`}>
    <div className="flex items-center justify-between mb-1">
      <div className="flex items-center space-x-2">
        <Icon size={12} className={ok ? 'text-emerald-400' : 'text-slate-500'} />
        <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-400">{label}</span>
      </div>
      {ok ? <CheckCircle2 size={12} className="text-emerald-400" /> : <XCircle size={12} className="text-slate-600" />}
    </div>
    <div className={`text-xs capitalize ${ok ? 'text-white' : 'text-slate-500'}`}>{detail}</div>
  </div>
);

export default ThreeWayMatch;
