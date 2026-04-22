import React, { useState } from 'react';
import { Bell, LogOut, Menu, Repeat, X, Infinity as InfinityIcon } from 'lucide-react';
import { navigate } from '../../lib/router';
import { actions, useStore } from '../../lib/store';

export interface NavItem {
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  path: string;
  sublabel?: string;
}

export interface NavSection {
  title?: string;
  items: NavItem[];
}

interface ShellProps {
  role: 'manufacturer' | 'supplier';
  activePath: string;
  sections: NavSection[];
  children: React.ReactNode;
}

const BrandMark: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`relative w-9 h-9 rounded-full flex items-center justify-center ${className}`}>
    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-emerald-400 via-teal-400 to-cyan-400 opacity-20 blur-md"></div>
    <div className="relative w-9 h-9 rounded-full border-2 border-teal-400/60 flex items-center justify-center bg-slate-950">
      <InfinityIcon size={18} className="text-teal-300" strokeWidth={2.2} />
    </div>
  </div>
);

export const Shell: React.FC<ShellProps> = ({ role, activePath, sections, children }) => {
  const store = useStore();
  const [mobileOpen, setMobileOpen] = useState(false);
  const identity = role === 'manufacturer' ? store.identity.manufacturer : store.identity.supplier;
  const roleLabel = role === 'manufacturer' ? 'BUYER' : 'SUPPLIER';
  const osLabel = role === 'manufacturer' ? 'BUYER OS' : 'SUPPLIER OS';
  const switchLabel = role === 'manufacturer' ? 'Switch to Supplier' : 'Switch to Buyer';
  const switchPath = role === 'manufacturer' ? '/app/s' : '/app/m';
  const accent = role === 'manufacturer' ? 'emerald' : 'cyan';

  const unreadCount =
    role === 'manufacturer'
      ? store.quotes.filter((q) => store.rfqs.find((r) => r.id === q.rfqId)?.status === 'quoted').length
      : store.rfqs.filter((r) => r.status === 'open').length;

  const SidebarContent = () => (
    <>
      <div className="h-20 border-b border-slate-800/80 flex items-center px-6 space-x-3 shrink-0">
        <BrandMark />
        <div>
          <div className="font-bold text-white tracking-tight leading-none">
            PROCURE <span className={accent === 'emerald' ? 'text-teal-300' : 'text-cyan-300'}>Ai</span>
          </div>
          <div className="text-[10px] text-slate-500 uppercase tracking-[0.2em] mt-1">{osLabel}</div>
        </div>
      </div>

      <nav className="flex-1 py-4 overflow-y-auto">
        {sections.map((section, si) => (
          <div key={si} className={si > 0 ? 'mt-4' : ''}>
            {section.title && (
              <div className="px-6 pb-2 text-[10px] font-semibold text-slate-600 uppercase tracking-[0.2em]">{section.title}</div>
            )}
            <div className="px-3 space-y-1">
              {section.items.map((item) => {
                const active = activePath === item.path || activePath.startsWith(item.path + '/');
                return (
                  <button
                    key={item.path}
                    onClick={() => { navigate(item.path); setMobileOpen(false); }}
                    className={`group w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 relative ${
                      active
                        ? 'text-white'
                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {active && (
                      <div className={`absolute inset-0 rounded-xl bg-gradient-to-r ${accent === 'emerald' ? 'from-emerald-500/20 via-teal-500/20 to-cyan-500/10' : 'from-cyan-500/20 via-blue-500/20 to-violet-500/10'} border ${accent === 'emerald' ? 'border-teal-500/30' : 'border-cyan-500/30'}`}></div>
                    )}
                    <item.icon size={16} className={`relative z-10 ${active ? (accent === 'emerald' ? 'text-teal-300' : 'text-cyan-300') : ''}`} />
                    <span className="relative z-10 truncate">{item.label}</span>
                    {item.sublabel && (
                      <span className="relative z-10 ml-auto text-[9px] text-slate-500 uppercase tracking-widest">{item.sublabel}</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="p-3 border-t border-slate-800/80 space-y-2 shrink-0">
        <button
          onClick={() => { navigate(switchPath); setMobileOpen(false); }}
          className={`w-full flex items-center justify-center space-x-2 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
            accent === 'emerald'
              ? 'bg-gradient-to-r from-teal-500/15 to-emerald-500/15 border border-teal-500/40 text-teal-200 hover:from-teal-500/25 hover:to-emerald-500/25'
              : 'bg-gradient-to-r from-cyan-500/15 to-blue-500/15 border border-cyan-500/40 text-cyan-200 hover:from-cyan-500/25 hover:to-blue-500/25'
          }`}
        >
          <Repeat size={14} />
          <span>{switchLabel}</span>
        </button>
        <button
          onClick={() => { actions.resetDemo(); navigate('/app'); }}
          className="w-full flex items-center space-x-2 px-3 py-2.5 rounded-xl text-sm text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
        >
          <LogOut size={14} />
          <span>Sign Out</span>
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-[#060918] text-slate-100">
      <aside className="hidden lg:flex fixed inset-y-0 left-0 w-64 border-r border-slate-800/80 bg-[#0a0e1f] flex-col z-40">
        <SidebarContent />
      </aside>

      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black/70" onClick={() => setMobileOpen(false)}></div>
          <aside className="relative w-72 bg-[#0a0e1f] border-r border-slate-800 flex flex-col">
            <SidebarContent />
            <button onClick={() => setMobileOpen(false)} className="absolute top-6 right-4 text-slate-400 p-2"><X size={18} /></button>
          </aside>
        </div>
      )}

      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 h-16 border-b border-slate-800/80 bg-[#0a0e1f]/90 backdrop-blur flex items-center px-4 lg:px-8">
          <button onClick={() => setMobileOpen(true)} className="lg:hidden mr-3 text-slate-400 hover:text-white p-2 rounded-lg hover:bg-white/5">
            <Menu size={18} />
          </button>
          <div className="text-xs text-slate-500 uppercase tracking-[0.2em] hidden md:block">
            {role === 'manufacturer' ? 'Procurement Operations' : 'Sales Operations'}
          </div>
          <div className="ml-auto flex items-center space-x-4">
            <button className="relative text-slate-400 hover:text-white p-2 rounded-lg hover:bg-white/5">
              <Bell size={16} />
              {unreadCount > 0 && (
                <span className={`absolute top-1 right-1 min-w-[16px] h-4 px-1 rounded-full text-[10px] font-bold flex items-center justify-center ${accent === 'emerald' ? 'bg-teal-500' : 'bg-cyan-500'} text-slate-950`}>
                  {unreadCount}
                </span>
              )}
            </button>
            <div className="flex items-center space-x-3 pl-4 border-l border-slate-800">
              <div className="hidden sm:block text-right">
                <div className="text-sm text-white font-semibold leading-tight">{identity.contactName}</div>
                <div className={`text-[10px] font-bold tracking-[0.2em] leading-tight ${accent === 'emerald' ? 'text-teal-400' : 'text-cyan-400'}`}>{roleLabel}</div>
              </div>
              <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-white ${accent === 'emerald' ? 'bg-gradient-to-tr from-teal-500 to-emerald-600' : 'bg-gradient-to-tr from-cyan-500 to-blue-600'}`}>
                {roleLabel[0]}
              </div>
            </div>
          </div>
        </header>

        <main className="p-4 lg:p-8 max-w-[1400px] mx-auto">{children}</main>
      </div>
    </div>
  );
};
