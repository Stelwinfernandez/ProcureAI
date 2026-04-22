import React, { useState } from 'react';
import { ArrowLeft, Bell, ChevronDown, LogOut, Menu, X } from 'lucide-react';
import { navigate } from '../../lib/router';
import { actions, useStore } from '../../lib/store';

export interface NavItem {
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  path: string;
}

interface ShellProps {
  role: 'manufacturer' | 'supplier';
  activePath: string;
  nav: NavItem[];
  children: React.ReactNode;
}

const Logo = ({ className = '' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="40" height="40" rx="12" fill="url(#shell_logo_gradient)" />
    <path d="M20 11L29 16.1962V26.5885L20 31.7846L11 26.5885V16.1962L20 11Z" stroke="white" strokeWidth="2" strokeOpacity="0.5" />
    <path d="M20 14V22M20 22L26 18M20 22L14 18M20 25.5V26.5" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="20" cy="27.5" r="1.5" fill="white" />
    <defs>
      <linearGradient id="shell_logo_gradient" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
        <stop stopColor="#2563EB" />
        <stop offset="1" stopColor="#06B6D4" />
      </linearGradient>
    </defs>
  </svg>
);

export const Shell: React.FC<ShellProps> = ({ role, activePath, nav, children }) => {
  const store = useStore();
  const [mobileOpen, setMobileOpen] = useState(false);
  const identity = role === 'manufacturer' ? store.identity.manufacturer : store.identity.supplier;
  const roleLabel = role === 'manufacturer' ? 'Manufacturer' : 'Supplier';
  const accent = role === 'manufacturer' ? 'blue' : 'cyan';

  const unreadCount =
    role === 'manufacturer'
      ? store.quotes.filter((q) => store.rfqs.find((r) => r.id === q.rfqId)?.status === 'quoted').length
      : store.rfqs.filter((r) => r.status === 'open').length;

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100">
      {/* Sidebar desktop */}
      <aside className="hidden lg:flex fixed inset-y-0 left-0 w-64 border-r border-slate-800 bg-[#0b1120] flex-col z-40">
        <div className="h-16 border-b border-slate-800 flex items-center px-5 space-x-3">
          <Logo className="w-8 h-8" />
          <div>
            <div className="font-bold text-white tracking-tight">Procure<span className="text-cyan-400">AI</span></div>
            <div className="text-[10px] text-slate-500 uppercase tracking-widest">{roleLabel}</div>
          </div>
        </div>
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {nav.map((item) => {
            const active = activePath === item.path || activePath.startsWith(item.path + '/');
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  active
                    ? accent === 'blue'
                      ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20'
                      : 'bg-cyan-600/10 text-cyan-400 border border-cyan-500/20'
                    : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
                }`}
              >
                <item.icon size={16} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
        <div className="p-3 border-t border-slate-800 space-y-2">
          <button
            onClick={() => navigate(role === 'manufacturer' ? '/app/s/inbox' : '/app/m/snap')}
            className="w-full text-left text-xs text-slate-500 hover:text-slate-300 px-3 py-2 rounded-lg hover:bg-white/5 transition-colors"
          >
            Switch to {role === 'manufacturer' ? 'Supplier' : 'Manufacturer'} view &rarr;
          </button>
          <button
            onClick={() => { actions.resetDemo(); navigate('/app'); }}
            className="w-full flex items-center space-x-2 text-xs text-slate-500 hover:text-red-400 px-3 py-2 rounded-lg hover:bg-white/5 transition-colors"
          >
            <LogOut size={12} />
            <span>Reset demo &amp; sign out</span>
          </button>
        </div>
      </aside>

      {/* Mobile sidebar */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black/60" onClick={() => setMobileOpen(false)}></div>
          <aside className="relative w-64 bg-[#0b1120] border-r border-slate-800 flex flex-col">
            <div className="h-16 border-b border-slate-800 flex items-center justify-between px-5">
              <div className="flex items-center space-x-3">
                <Logo className="w-8 h-8" />
                <div className="font-bold text-white tracking-tight">Procure<span className="text-cyan-400">AI</span></div>
              </div>
              <button onClick={() => setMobileOpen(false)} className="text-slate-400 p-2"><X size={18} /></button>
            </div>
            <nav className="flex-1 p-3 space-y-1">
              {nav.map((item) => {
                const active = activePath === item.path;
                return (
                  <button
                    key={item.path}
                    onClick={() => { navigate(item.path); setMobileOpen(false); }}
                    className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      active ? 'bg-blue-600/10 text-blue-400' : 'text-slate-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <item.icon size={16} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </aside>
        </div>
      )}

      {/* Main area */}
      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 h-16 border-b border-slate-800 bg-[#0b1120]/80 backdrop-blur flex items-center px-4 lg:px-8">
          <button onClick={() => setMobileOpen(true)} className="lg:hidden mr-3 text-slate-400 hover:text-white p-2 rounded-lg hover:bg-white/5">
            <Menu size={18} />
          </button>
          <button
            onClick={() => navigate('/')}
            className="flex items-center space-x-2 text-xs text-slate-500 hover:text-slate-300 transition-colors"
          >
            <ArrowLeft size={12} />
            <span className="hidden sm:inline">Back to site</span>
          </button>
          <div className="ml-auto flex items-center space-x-3">
            <div className="relative">
              <Bell size={16} className="text-slate-400" />
              {unreadCount > 0 && (
                <span className={`absolute -top-1 -right-1 min-w-[16px] h-4 px-1 rounded-full text-[10px] font-bold flex items-center justify-center ${accent === 'blue' ? 'bg-blue-500' : 'bg-cyan-500'} text-white`}>
                  {unreadCount}
                </span>
              )}
            </div>
            <div className="flex items-center space-x-2 pl-3 border-l border-slate-800">
              <div className={`w-8 h-8 rounded-full bg-gradient-to-tr ${accent === 'blue' ? 'from-blue-500 to-cyan-500' : 'from-cyan-500 to-blue-500'}`}></div>
              <div className="hidden sm:block">
                <div className="text-xs text-white font-medium leading-tight">{identity.companyName}</div>
                <div className="text-[10px] text-slate-500 leading-tight">{identity.contactName}</div>
              </div>
              <ChevronDown size={12} className="text-slate-500 hidden sm:block" />
            </div>
          </div>
        </header>

        <main className="p-4 lg:p-8 max-w-7xl mx-auto">{children}</main>
      </div>
    </div>
  );
};
