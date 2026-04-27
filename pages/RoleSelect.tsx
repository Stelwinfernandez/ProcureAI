import React from 'react';
import { Factory, Cpu, ArrowRight, ArrowLeft, Camera } from 'lucide-react';
import { Button } from '../components/Button';
import { navigate } from '../lib/router';

const Logo = ({ className = '' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="40" height="40" rx="12" fill="url(#rs_logo_gradient)" />
    <path d="M20 11L29 16.1962V26.5885L20 31.7846L11 26.5885V16.1962L20 11Z" stroke="white" strokeWidth="2" strokeOpacity="0.5" />
    <path d="M20 14V22M20 22L26 18M20 22L14 18M20 25.5V26.5" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="20" cy="27.5" r="1.5" fill="white" />
    <defs>
      <linearGradient id="rs_logo_gradient" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
        <stop stopColor="#2563EB" />
        <stop offset="1" stopColor="#06B6D4" />
      </linearGradient>
    </defs>
  </svg>
);

const RoleSelect: React.FC = () => (
  <div className="min-h-screen bg-[#020617] text-slate-100 grid-bg relative overflow-hidden">
    <div className="absolute inset-0 bg-hero-glow opacity-40 pointer-events-none mix-blend-screen"></div>

    <div className="relative z-10 max-w-5xl mx-auto px-6 py-12">
      <div className="flex items-center justify-between mb-12">
        <div className="flex items-center space-x-3">
          <Logo className="w-10 h-10" />
          <div>
            <div className="font-bold text-lg text-white tracking-tight">Procure<span className="text-cyan-400">AI</span></div>
            <div className="text-[10px] text-slate-500 uppercase tracking-widest">Workspace</div>
          </div>
        </div>
        <button onClick={() => navigate('/')} className="text-xs text-slate-400 hover:text-white flex items-center space-x-1">
          <ArrowLeft size={12} />
          <span>Back to site</span>
        </button>
      </div>

      <div className="text-center mb-12">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full border border-blue-500/20 bg-blue-500/5 text-blue-300 text-xs font-medium mb-6">
          <Camera size={12} />
          <span>Demo workspace &middot; data stored locally</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">Choose your workspace</h1>
        <p className="text-slate-400">Two sides of the same marketplace. Open both in separate tabs to see quotes flow live.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <button
          onClick={() => navigate('/app/m/snap')}
          className="group text-left glass-panel rounded-2xl border border-white/5 hover:border-blue-500/40 p-8 transition-all duration-300 hover:-translate-y-1"
        >
          <div className="w-14 h-14 rounded-xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:border-blue-500 transition-colors">
            <Factory className="text-blue-400 group-hover:text-white transition-colors" size={26} />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">I&apos;m a Manufacturer</h2>
          <p className="text-slate-400 text-sm mb-6 leading-relaxed">
            Snap photos of parts on the plant floor, fire instant RFQs to industrial suppliers, and track quotes in real time.
          </p>
          <div className="flex items-center text-blue-400 text-sm font-medium">
            <span>Enter manufacturer workspace</span>
            <ArrowRight size={14} className="ml-2 group-hover:translate-x-1 transition-transform" />
          </div>
        </button>

        <button
          onClick={() => navigate('/app/s/inbox')}
          className="group text-left glass-panel rounded-2xl border border-white/5 hover:border-cyan-500/40 p-8 transition-all duration-300 hover:-translate-y-1"
        >
          <div className="w-14 h-14 rounded-xl bg-cyan-600/10 border border-cyan-500/20 flex items-center justify-center mb-6 group-hover:bg-cyan-600 group-hover:border-cyan-500 transition-colors">
            <Cpu className="text-cyan-400 group-hover:text-white transition-colors" size={26} />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">I&apos;m a Supplier</h2>
          <p className="text-slate-400 text-sm mb-6 leading-relaxed">
            Watch a live queue of inbound RFQs from verified manufacturers, respond with quotes, and win orders.
          </p>
          <div className="flex items-center text-cyan-400 text-sm font-medium">
            <span>Enter supplier workspace</span>
            <ArrowRight size={14} className="ml-2 group-hover:translate-x-1 transition-transform" />
          </div>
        </button>
      </div>

      <div className="mt-12 text-center">
        <Button variant="ghost" size="sm" onClick={() => navigate('/')}>View landing page</Button>
      </div>
    </div>
  </div>
);

export default RoleSelect;
