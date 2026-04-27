import React from 'react';

interface HeaderProps {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  iconColor?: string;
  iconBg?: string;
  title: string;
  subtitle: string;
  actions?: React.ReactNode;
}

export const ModuleHeader: React.FC<HeaderProps> = ({
  icon: Icon,
  iconColor = 'text-teal-300',
  iconBg = 'from-teal-500/20 to-emerald-500/20 border-teal-500/30',
  title,
  subtitle,
  actions,
}) => (
  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
    <div className="flex items-start space-x-3">
      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${iconBg} border flex items-center justify-center shrink-0`}>
        <Icon size={20} className={iconColor} />
      </div>
      <div>
        <h1 className="text-2xl font-bold text-white">{title}</h1>
        <p className="text-slate-400 text-sm mt-1">{subtitle}</p>
      </div>
    </div>
    {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
  </div>
);

export const Stat: React.FC<{ label: string; value: React.ReactNode; color?: string; icon?: React.ComponentType<{ size?: number; className?: string }>; sub?: string }> = ({
  label,
  value,
  color = 'text-white',
  icon: Icon,
  sub,
}) => (
  <div className="glass-panel border border-white/5 p-4 rounded-xl">
    <div className="flex items-center justify-between mb-2">
      <span className="text-xs text-slate-400">{label}</span>
      {Icon && <Icon size={14} className="text-slate-500" />}
    </div>
    <div className={`text-xl font-bold ${color}`}>{value}</div>
    {sub && <div className="text-[10px] text-slate-500 mt-1">{sub}</div>}
  </div>
);

export const Card: React.FC<{ title?: string; actions?: React.ReactNode; className?: string; children: React.ReactNode }> = ({ title, actions, className = '', children }) => (
  <div className={`glass-panel border border-white/5 rounded-2xl ${className}`}>
    {(title || actions) && (
      <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between">
        {title && <h2 className="text-sm font-semibold text-white">{title}</h2>}
        {actions}
      </div>
    )}
    <div className="p-5">{children}</div>
  </div>
);
