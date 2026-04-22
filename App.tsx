import React from 'react';
import { Home, Camera, Inbox as InboxIcon, Package, Mail, Trophy, BarChart3 } from 'lucide-react';
import Landing from './pages/Landing';
import RoleSelect from './pages/RoleSelect';
import ManufacturerDashboard from './pages/manufacturer/Dashboard';
import SnapSource from './pages/manufacturer/SnapSource';
import RFQs from './pages/manufacturer/RFQs';
import RFQDetail from './pages/manufacturer/RFQDetail';
import Orders from './pages/manufacturer/Orders';
import SupplierDashboard from './pages/supplier/Dashboard';
import SupplierInbox from './pages/supplier/Inbox';
import SupplierInboxDetail from './pages/supplier/InboxDetail';
import Wins from './pages/supplier/Wins';
import { Shell, NavItem } from './components/app/Shell';
import { matchRoute, useHashRoute } from './lib/router';

const manufacturerNav: NavItem[] = [
  { label: 'Dashboard', icon: BarChart3, path: '/app/m' },
  { label: 'Snap & Source', icon: Camera, path: '/app/m/snap' },
  { label: 'RFQs', icon: Mail, path: '/app/m/rfqs' },
  { label: 'Orders', icon: Package, path: '/app/m/orders' },
];

const supplierNav: NavItem[] = [
  { label: 'Dashboard', icon: BarChart3, path: '/app/s' },
  { label: 'Inbound RFQs', icon: InboxIcon, path: '/app/s/inbox' },
  { label: 'Won Orders', icon: Trophy, path: '/app/s/wins' },
];

const App: React.FC = () => {
  const path = useHashRoute();

  // Landing at root
  if (path === '/' || path === '') return <Landing />;

  // Role picker
  if (path === '/app') return <RoleSelect />;

  // Manufacturer
  if (path.startsWith('/app/m')) {
    const rfqParams = matchRoute(path, '/app/m/rfqs/:id');
    let view: React.ReactNode;
    let activePath = '/app/m';

    if (path === '/app/m') view = <ManufacturerDashboard />;
    else if (path === '/app/m/snap') { view = <SnapSource />; activePath = '/app/m/snap'; }
    else if (path === '/app/m/rfqs') { view = <RFQs />; activePath = '/app/m/rfqs'; }
    else if (rfqParams) { view = <RFQDetail rfqId={rfqParams.id} />; activePath = '/app/m/rfqs'; }
    else if (path === '/app/m/orders') { view = <Orders />; activePath = '/app/m/orders'; }
    else view = <NotFound />;

    return <Shell role="manufacturer" activePath={activePath} nav={manufacturerNav}>{view}</Shell>;
  }

  // Supplier
  if (path.startsWith('/app/s')) {
    const inboxParams = matchRoute(path, '/app/s/inbox/:id');
    let view: React.ReactNode;
    let activePath = '/app/s';

    if (path === '/app/s') view = <SupplierDashboard />;
    else if (path === '/app/s/inbox') { view = <SupplierInbox />; activePath = '/app/s/inbox'; }
    else if (inboxParams) { view = <SupplierInboxDetail rfqId={inboxParams.id} />; activePath = '/app/s/inbox'; }
    else if (path === '/app/s/wins') { view = <Wins />; activePath = '/app/s/wins'; }
    else view = <NotFound />;

    return <Shell role="supplier" activePath={activePath} nav={supplierNav}>{view}</Shell>;
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
