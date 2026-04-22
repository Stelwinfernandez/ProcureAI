import React, { useState } from 'react';
import { ArrowLeft, Truck, Package, CheckCircle2, Clock, Factory, PackageCheck, AlertCircle, DollarSign, ExternalLink, MapPin } from 'lucide-react';
import { Button } from '../../components/Button';
import { actions, useStore } from '../../lib/store';
import { navigate } from '../../lib/router';
import type { Order, OrderStatus } from '../../lib/types';

interface Props { orderId: string; mode: 'manufacturer' | 'supplier'; }

const statusSteps: { key: OrderStatus; label: string; icon: React.ComponentType<{ size?: number; className?: string }> }[] = [
  { key: 'pending', label: 'Placed', icon: Clock },
  { key: 'confirmed', label: 'Confirmed', icon: CheckCircle2 },
  { key: 'in_production', label: 'Production', icon: Factory },
  { key: 'shipped', label: 'Shipped', icon: Truck },
  { key: 'delivered', label: 'Delivered', icon: PackageCheck },
];

const stepIndex = (s: OrderStatus): number => {
  const idx = statusSteps.findIndex((x) => x.key === s);
  return idx === -1 ? 0 : idx;
};

const StatusTimeline: React.FC<{ order: Order }> = ({ order }) => {
  const current = stepIndex(order.status);
  const cancelled = order.status === 'cancelled';
  return (
    <div className="relative">
      <div className="absolute top-5 left-5 right-5 h-[2px] bg-slate-800">
        <div className={`h-full ${cancelled ? 'bg-red-500' : 'bg-gradient-to-r from-blue-500 to-green-500'} transition-all duration-500`}
             style={{ width: cancelled ? '100%' : `${(current / (statusSteps.length - 1)) * 100}%` }} />
      </div>
      <div className="relative grid grid-cols-5">
        {statusSteps.map((step, i) => {
          const reached = !cancelled && i <= current;
          const active = !cancelled && i === current;
          const Icon = step.icon;
          return (
            <div key={step.key} className="flex flex-col items-center text-center">
              <div className={`relative z-10 w-10 h-10 rounded-full border-2 flex items-center justify-center transition-colors ${
                cancelled ? 'bg-slate-900 border-slate-700 text-slate-600' :
                reached ? 'bg-blue-600 border-blue-500 text-white' : 'bg-slate-900 border-slate-700 text-slate-600'
              } ${active ? 'ring-4 ring-blue-500/20' : ''}`}>
                <Icon size={16} />
              </div>
              <div className={`text-[11px] font-medium mt-2 ${reached ? 'text-white' : 'text-slate-500'}`}>{step.label}</div>
            </div>
          );
        })}
      </div>
      {cancelled && (
        <div className="mt-4 text-center text-xs text-red-400 flex items-center justify-center space-x-1">
          <AlertCircle size={12} /><span>Order cancelled</span>
        </div>
      )}
    </div>
  );
};

const OrderDetail: React.FC<Props> = ({ orderId, mode }) => {
  const store = useStore();
  const order = store.orders.find((o) => o.id === orderId);

  const [carrier, setCarrier] = useState('FedEx');
  const [trackingNum, setTrackingNum] = useState('');

  if (!order) {
    return (
      <div className="glass-panel border border-white/5 rounded-2xl p-16 text-center">
        <h2 className="text-xl font-semibold text-white mb-2">Order not found</h2>
        <Button onClick={() => navigate(mode === 'manufacturer' ? '/app/m/orders' : '/app/s/wins')}>Back</Button>
      </div>
    );
  }

  const rfq = store.rfqs.find((r) => r.id === order.rfqId);
  const currentIdx = stepIndex(order.status);
  const nextStatus = statusSteps[currentIdx + 1]?.key;
  const canCancel = order.status !== 'delivered' && order.status !== 'cancelled' && order.status !== 'shipped';
  const backTo = mode === 'manufacturer' ? '/app/m/orders' : '/app/s/wins';
  const actor = mode === 'manufacturer' ? store.identity.manufacturer.companyName : store.identity.supplier.companyName;

  const advance = () => {
    if (!nextStatus) return;
    actions.updateOrderStatus(order.id, nextStatus, actor);
  };

  const submitTracking = () => {
    if (!trackingNum.trim()) return;
    actions.setTracking(order.id, carrier, trackingNum.trim(), actor);
    setTrackingNum('');
  };

  return (
    <div className="space-y-6">
      <button onClick={() => navigate(backTo)} className="text-xs text-slate-500 hover:text-white flex items-center space-x-1">
        <ArrowLeft size={12} /><span>Back</span>
      </button>

      <div className="glass-panel border border-white/5 rounded-2xl p-6">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
          <div>
            <div className="text-[10px] font-mono uppercase tracking-widest text-blue-400 mb-1">{order.id}</div>
            <h1 className="text-2xl font-bold text-white">{order.lineItems[0]?.description ?? 'Order'}</h1>
            <div className="text-sm text-slate-400 mt-1">
              {order.supplier} &rarr; {order.buyer} &middot; placed {new Date(order.placedAt).toLocaleString()}
            </div>
          </div>
          <div className="text-right">
            <div className="text-[10px] text-slate-500 uppercase">Order total</div>
            <div className="text-2xl font-bold text-white font-mono">${order.total.toFixed(2)}</div>
            <div className="text-xs text-slate-500 mt-1">{order.terms} &middot; <span className="capitalize">{order.invoiceStatus}</span></div>
          </div>
        </div>

        <StatusTimeline order={order} />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-panel border border-white/5 rounded-2xl overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-white">Line items</h2>
              <span className="text-xs text-slate-500">{order.lineItems.length} item{order.lineItems.length === 1 ? '' : 's'}</span>
            </div>
            <div className="divide-y divide-slate-800/60">
              {order.lineItems.map((li, i) => (
                <div key={i} className="px-5 py-4 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400">
                      <Package size={16} />
                    </div>
                    <div>
                      <div className="text-sm text-white font-medium">{li.description}</div>
                      <div className="text-xs text-slate-500 font-mono">{li.sku}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-6">
                    <div className="text-right">
                      <div className="text-[10px] text-slate-500 uppercase">Qty</div>
                      <div className="text-sm text-white font-medium">{li.quantity}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] text-slate-500 uppercase">Unit</div>
                      <div className="text-sm text-white font-mono">${li.unitPrice.toFixed(2)}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] text-slate-500 uppercase">Line total</div>
                      <div className="text-sm text-white font-mono font-bold">${li.lineTotal.toFixed(2)}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="px-5 py-3 border-t border-slate-800 bg-slate-900/30 flex items-center justify-between">
              <span className="text-sm text-slate-400">Order total</span>
              <span className="text-lg text-white font-mono font-bold">${order.total.toFixed(2)}</span>
            </div>
          </div>

          <div className="glass-panel border border-white/5 rounded-2xl overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-800">
              <h2 className="text-sm font-semibold text-white">Order timeline</h2>
            </div>
            <div className="p-5">
              <ol className="relative border-l border-slate-800 ml-2 space-y-5">
                {[...order.timeline].reverse().map((ev, i) => (
                  <li key={i} className="ml-5">
                    <div className="absolute -left-[7px] w-3 h-3 rounded-full bg-blue-500 border-2 border-[#0b1120]"></div>
                    <div className="text-sm text-white font-medium">{ev.event}</div>
                    <div className="text-xs text-slate-500">
                      {new Date(ev.ts).toLocaleString()} &middot; {ev.actor}
                    </div>
                    {ev.detail && <div className="text-xs text-slate-400 mt-0.5">{ev.detail}</div>}
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="glass-panel border border-white/5 rounded-2xl p-5">
            <h3 className="text-sm font-semibold text-white mb-4">Ship-to</h3>
            <div className="flex items-start space-x-2 text-sm">
              <MapPin size={14} className="text-slate-500 shrink-0 mt-0.5" />
              <div>
                <div className="text-white">{order.buyer}</div>
                <div className="text-slate-400 text-xs">{order.facility}</div>
                <div className="text-slate-500 text-xs mt-1">ETA {order.eta}</div>
              </div>
            </div>
          </div>

          {(order.trackingNumber || mode === 'supplier') && order.status !== 'cancelled' && (
            <div className="glass-panel border border-white/5 rounded-2xl p-5">
              <h3 className="text-sm font-semibold text-white mb-4 flex items-center space-x-2">
                <Truck size={14} className="text-cyan-400" />
                <span>Shipment</span>
              </h3>
              {order.trackingNumber ? (
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-slate-400">Carrier</span><span className="text-white">{order.carrier}</span></div>
                  <div className="flex justify-between"><span className="text-slate-400">Tracking</span><span className="text-white font-mono text-xs">{order.trackingNumber}</span></div>
                  <button className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center space-x-1">
                    <span>Track package</span><ExternalLink size={10} />
                  </button>
                </div>
              ) : mode === 'supplier' ? (
                <div className="space-y-2">
                  <select value={carrier} onChange={(e) => setCarrier(e.target.value)}
                    className="w-full bg-slate-800/50 border border-slate-700 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-cyan-500">
                    <option>FedEx</option><option>UPS</option><option>Purolator</option><option>Canada Post</option><option>DHL</option>
                  </select>
                  <input value={trackingNum} onChange={(e) => setTrackingNum(e.target.value)} placeholder="Tracking number"
                    className="w-full bg-slate-800/50 border border-slate-700 rounded px-3 py-2 text-white text-sm font-mono focus:outline-none focus:border-cyan-500" />
                  <Button variant="outline" size="sm" fullWidth onClick={submitTracking}>Add tracking</Button>
                </div>
              ) : (
                <div className="text-xs text-slate-500">Awaiting tracking info from supplier.</div>
              )}
            </div>
          )}

          {order.status !== 'cancelled' && (
            <div className="glass-panel border border-white/5 rounded-2xl p-5">
              <h3 className="text-sm font-semibold text-white mb-4">Actions</h3>
              <div className="space-y-2">
                {mode === 'supplier' && nextStatus && order.status !== 'delivered' && (
                  <Button fullWidth variant="secondary" onClick={advance}>
                    Advance to {statusSteps[currentIdx + 1].label}
                  </Button>
                )}
                {mode === 'manufacturer' && order.status === 'shipped' && (
                  <Button fullWidth onClick={() => actions.updateOrderStatus(order.id, 'delivered', actor, 'Received at dock')}>
                    <PackageCheck size={14} className="mr-2" /> Mark as delivered
                  </Button>
                )}
                {mode === 'supplier' && order.status === 'delivered' && order.invoiceStatus === 'pending' && (
                  <Button fullWidth variant="outline" onClick={() => actions.markInvoiced(order.id, actor)}>
                    <DollarSign size={14} className="mr-2" /> Send invoice
                  </Button>
                )}
                {mode === 'manufacturer' && order.invoiceStatus === 'invoiced' && (
                  <Button fullWidth onClick={() => actions.markPaid(order.id, actor)}>
                    <DollarSign size={14} className="mr-2" /> Mark invoice paid
                  </Button>
                )}
                {canCancel && (
                  <button
                    onClick={() => actions.updateOrderStatus(order.id, 'cancelled', actor, 'Cancelled by ' + mode)}
                    className="w-full text-xs text-red-400 hover:text-red-300 py-2 rounded-lg hover:bg-red-500/5 transition-colors"
                  >
                    Cancel order
                  </button>
                )}
              </div>
            </div>
          )}

          {rfq && (
            <button
              onClick={() => navigate(mode === 'manufacturer' ? `/app/m/rfqs/${rfq.id}` : `/app/s/inbox/${rfq.id}`)}
              className="w-full text-xs text-slate-500 hover:text-white flex items-center justify-center space-x-1 py-2"
            >
              <span>View originating RFQ &rarr;</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
