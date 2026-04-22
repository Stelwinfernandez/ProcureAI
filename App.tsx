import React from 'react';
import {
  Home, Camera, Inbox as InboxIcon, Package, Trophy, BarChart3, ShoppingCart, Boxes, PieChart, FileCheck,
  ShieldAlert, Sparkles, Brain, Zap, ScanLine, Factory, Users, Star, BookOpen, Target, Layers,
} from 'lucide-react';
import Landing from './pages/Landing';
import RoleSelect from './pages/RoleSelect';
import ManufacturerDashboard from './pages/manufacturer/Dashboard';
import SnapSource from './pages/manufacturer/SnapSource';
import StructuredRfq from './pages/manufacturer/StructuredRfq';
import AIAgent from './pages/manufacturer/AIAgent';
import RFQs from './pages/manufacturer/RFQs';
import RFQDetail from './pages/manufacturer/RFQDetail';
import Orders from './pages/manufacturer/Orders';
import OrderDetail from './pages/manufacturer/OrderDetail';
import Suppliers from './pages/manufacturer/Suppliers';
import SupplierDetail from './pages/manufacturer/SupplierDetail';
import SpendAnalytics from './pages/manufacturer/SpendAnalytics';
import ThreeWayMatch from './pages/manufacturer/ThreeWayMatch';
import RiskCompliance from './pages/manufacturer/RiskCompliance';
import SmartCrib from './pages/manufacturer/SmartCrib';
import PredictiveInsights from './pages/manufacturer/PredictiveInsights';
import MroAutomation from './pages/manufacturer/MroAutomation';
import SmartTakeoff from './pages/manufacturer/SmartTakeoff';
import ProductionPlanning from './pages/manufacturer/ProductionPlanning';
import SupplierDashboard from './pages/supplier/Dashboard';
import SupplierInbox from './pages/supplier/Inbox';
import SupplierInboxDetail from './pages/supplier/InboxDetail';
import Wins from './pages/supplier/Wins';
import Scorecard from './pages/supplier/Scorecard';
import Catalog from './pages/supplier/Catalog';
import Customers from './pages/supplier/Customers';
import { Shell, NavSection } from './components/app/Shell';
import { matchRoute, useHashRoute } from './lib/router';

const buyerSections: NavSection[] = [
  {
    items: [
      { label: 'Dashboard', icon: BarChart3, path: '/app/m' },
      { label: 'Sourcing Agent', icon: Sparkles, path: '/app/m/agent' },
      { label: 'Predictive Insights', icon: Brain, path: '/app/m/insights' },
    ],
  },
  {
    title: 'Automation',
    items: [
      { label: 'MRO Automation', icon: Zap, path: '/app/m/mro', sublabel: 'M2P' },
      { label: 'Smart Takeoff', icon: ScanLine, path: '/app/m/takeoff' },
      { label: 'Production Planning', icon: Factory, path: '/app/m/production' },
      { label: 'Smart Crib', icon: Boxes, path: '/app/m/crib', sublabel: 'VMI' },
    ],
  },
  {
    title: 'Source to pay',
    items: [
      { label: 'RFQ Management', icon: ShoppingCart, path: '/app/m/rfqs' },
      { label: 'Purchase Orders', icon: Package, path: '/app/m/orders' },
      { label: 'Suppliers', icon: Users, path: '/app/m/suppliers' },
      { label: 'Spend Analytics', icon: PieChart, path: '/app/m/analytics' },
      { label: '3-Way Matching', icon: FileCheck, path: '/app/m/match' },
      { label: 'Risk & Compliance', icon: ShieldAlert, path: '/app/m/risk' },
    ],
  },
];

const supplierSections: NavSection[] = [
  {
    items: [
      { label: 'Dashboard', icon: BarChart3, path: '/app/s' },
      { label: 'Inbound RFQs', icon: InboxIcon, path: '/app/s/inbox' },
      { label: 'Won Orders', icon: Trophy, path: '/app/s/wins' },
    ],
  },
  {
    title: 'Growth',
    items: [
      { label: 'Scorecard', icon: Star, path: '/app/s/scorecard' },
      { label: 'Customers', icon: Users, path: '/app/s/customers' },
      { label: 'Product Catalog', icon: BookOpen, path: '/app/s/catalog' },
    ],
  },
];

const App: React.FC = () => {
  const path = useHashRoute();

  if (path === '/' || path === '') return <Landing />;
  if (path === '/app') return <RoleSelect />;

  if (path.startsWith('/app/m')) {
    const rfqParams = matchRoute(path, '/app/m/rfqs/:id');
    const orderParams = matchRoute(path, '/app/m/orders/:id');
    const supplierParams = matchRoute(path, '/app/m/suppliers/:id');
    let view: React.ReactNode;
    let activePath = '/app/m';

    if (path === '/app/m') { view = <ManufacturerDashboard />; activePath = '/app/m'; }
    else if (path === '/app/m/snap') { view = <SnapSource />; activePath = '/app/m/rfqs'; }
    else if (path === '/app/m/rfq/new') { view = <StructuredRfq />; activePath = '/app/m/rfqs'; }
    else if (path === '/app/m/agent') { view = <AIAgent />; activePath = '/app/m/agent'; }
    else if (path === '/app/m/insights') { view = <PredictiveInsights />; activePath = '/app/m/insights'; }
    else if (path === '/app/m/mro') { view = <MroAutomation />; activePath = '/app/m/mro'; }
    else if (path === '/app/m/takeoff') { view = <SmartTakeoff />; activePath = '/app/m/takeoff'; }
    else if (path === '/app/m/production') { view = <ProductionPlanning />; activePath = '/app/m/production'; }
    else if (path === '/app/m/crib') { view = <SmartCrib />; activePath = '/app/m/crib'; }
    else if (path === '/app/m/rfqs') { view = <RFQs />; activePath = '/app/m/rfqs'; }
    else if (rfqParams) { view = <RFQDetail rfqId={rfqParams.id} />; activePath = '/app/m/rfqs'; }
    else if (path === '/app/m/orders') { view = <Orders />; activePath = '/app/m/orders'; }
    else if (orderParams) { view = <OrderDetail orderId={orderParams.id} mode="manufacturer" />; activePath = '/app/m/orders'; }
    else if (path === '/app/m/suppliers') { view = <Suppliers />; activePath = '/app/m/suppliers'; }
    else if (supplierParams) { view = <SupplierDetail supplierId={supplierParams.id} />; activePath = '/app/m/suppliers'; }
    else if (path === '/app/m/analytics') { view = <SpendAnalytics />; activePath = '/app/m/analytics'; }
    else if (path === '/app/m/match') { view = <ThreeWayMatch />; activePath = '/app/m/match'; }
    else if (path === '/app/m/risk') { view = <RiskCompliance />; activePath = '/app/m/risk'; }
    else view = <NotFound />;

    return <Shell role="manufacturer" activePath={activePath} sections={buyerSections}>{view}</Shell>;
  }

  if (path.startsWith('/app/s')) {
    const inboxParams = matchRoute(path, '/app/s/inbox/:id');
    const orderParams = matchRoute(path, '/app/s/orders/:id');
    let view: React.ReactNode;
    let activePath = '/app/s';

    if (path === '/app/s') view = <SupplierDashboard />;
    else if (path === '/app/s/inbox') { view = <SupplierInbox />; activePath = '/app/s/inbox'; }
    else if (inboxParams) { view = <SupplierInboxDetail rfqId={inboxParams.id} />; activePath = '/app/s/inbox'; }
    else if (path === '/app/s/wins') { view = <Wins />; activePath = '/app/s/wins'; }
    else if (orderParams) { view = <OrderDetail orderId={orderParams.id} mode="supplier" />; activePath = '/app/s/wins'; }
    else if (path === '/app/s/scorecard') { view = <Scorecard />; activePath = '/app/s/scorecard'; }
    else if (path === '/app/s/customers') { view = <Customers />; activePath = '/app/s/customers'; }
    else if (path === '/app/s/catalog') { view = <Catalog />; activePath = '/app/s/catalog'; }
    else view = <NotFound />;

    return <Shell role="supplier" activePath={activePath} sections={supplierSections}>{view}</Shell>;
  }

  return <Landing />;
};

const NotFound: React.FC = () => (
  <div className="glass-panel border border-white/5 rounded-2xl p-16 text-center">
    <div className="w-16 h-16 mx-auto rounded-2xl bg-slate-800 flex items-center justify-center mb-6">
      <Home size={26} className="text-slate-400" />
    </div>
    <h2 className="text-xl font-semibold text-white mb-2">Page not found</h2>
    <p className="text-slate-400 text-sm">The route you followed doesn&apos;t exist in this demo.</p>
  </div>
);

export default App;
