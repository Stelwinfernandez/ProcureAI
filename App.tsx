import React, { useState, useEffect } from 'react';
import { 
  Bot, 
  Factory, 
  Truck, 
  Zap, 
  BarChart3, 
  Clock, 
  ShieldCheck, 
  Globe, 
  ChevronRight, 
  Cpu, 
  Layers, 
  Search,
  Mail,
  Menu,
  X,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  MapPin,
  Calendar
} from 'lucide-react';
import { Section } from './components/Section';
import { Button } from './components/Button';
import { UserType } from './types';

// --- Components ---

const Logo = ({ className = "" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="40" height="40" rx="12" fill="url(#logo_gradient)" className="shadow-lg" />
    <path d="M20 11L29 16.1962V26.5885L20 31.7846L11 26.5885V16.1962L20 11Z" stroke="white" strokeWidth="2" strokeOpacity="0.5" />
    <path d="M20 14V22M20 22L26 18M20 22L14 18M20 25.5V26.5" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="20" cy="27.5" r="1.5" fill="white" />
    <defs>
      <linearGradient id="logo_gradient" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
        <stop stopColor="#2563EB"/>
        <stop offset="1" stopColor="#06B6D4"/>
      </linearGradient>
    </defs>
  </svg>
);

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsOpen(false);
    }
  };

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'glass-panel border-b border-white/5 shadow-lg' : 'bg-transparent border-transparent'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center space-x-3 cursor-pointer group" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="relative group-hover:scale-105 transition-transform duration-300">
              <Logo className="w-10 h-10 shadow-lg shadow-blue-500/20" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg leading-none text-white tracking-tight">Procure<span className="text-cyan-400">AI</span></span>
              <span className="text-[10px] text-slate-400 uppercase tracking-widest leading-none mt-1">Enterprise</span>
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-1">
            {['Problem', 'Solution', 'Manufacturers', 'Suppliers'].map((item) => (
              <button 
                key={item}
                onClick={() => scrollTo(item.toLowerCase())}
                className="px-4 py-2 text-slate-400 hover:text-white text-sm font-medium transition-colors hover:bg-white/5 rounded-lg"
              >
                {item}
              </button>
            ))}
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <button onClick={() => scrollTo('register')} className="text-slate-300 hover:text-white text-sm font-medium transition-colors">
              Sign In
            </button>
            <Button size="sm" onClick={() => scrollTo('register')}>Get Early Access</Button>
          </div>

          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-slate-300 hover:text-white p-2 hover:bg-white/5 rounded-lg">
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden glass-panel border-b border-white/10 absolute w-full">
          <div className="px-4 pt-4 pb-6 space-y-2">
             {['Problem', 'Solution', 'Manufacturers', 'Suppliers', 'Roadmap'].map((item) => (
              <button 
                key={item}
                onClick={() => scrollTo(item.toLowerCase())}
                className="block w-full text-left px-4 py-3 text-base font-medium text-slate-300 hover:text-white hover:bg-white/5 rounded-lg"
              >
                {item}
              </button>
            ))}
            <div className="pt-4 mt-4 border-t border-white/10">
              <Button fullWidth onClick={() => scrollTo('register')}>Get Early Access</Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

const DashboardMockup = () => (
  <div className="relative mx-auto max-w-5xl mt-16 perspective-1000">
    {/* Glow effects */}
    <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600 rounded-2xl blur-xl opacity-20 animate-pulse"></div>
    
    <div className="relative bg-[#0f172a] border border-slate-700/50 rounded-xl shadow-2xl overflow-hidden ring-1 ring-white/10">
      {/* Window Controls */}
      <div className="h-10 bg-[#1e293b] border-b border-slate-700/50 flex items-center px-4 space-x-2">
        <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50"></div>
        <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50"></div>
        <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50"></div>
        
        <div className="mx-auto bg-slate-800/50 px-32 py-1 rounded-md border border-slate-700/50">
          <div className="w-32 h-2 bg-slate-700/50 rounded-full"></div>
        </div>
      </div>

      <div className="flex h-[500px]">
        {/* Sidebar */}
        <div className="w-60 bg-[#0f172a] border-r border-slate-800 p-4 flex flex-col hidden md:flex">
          <div className="space-y-6">
            <div className="space-y-1">
              <div className="px-3 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">Platform</div>
              {['Dashboard', 'Active RFQs', 'Supplier Network', 'Analytics'].map((item, i) => (
                <div key={item} className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium cursor-pointer ${i === 0 ? 'bg-blue-600/10 text-blue-400' : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'}`}>
                  {i === 0 && <BarChart3 size={16} />}
                  {i === 1 && <Mail size={16} />}
                  {i === 2 && <Globe size={16} />}
                  {i === 3 && <TrendingUp size={16} />}
                  <span>{item}</span>
                </div>
              ))}
            </div>
            <div className="space-y-1">
               <div className="px-3 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">Workflow</div>
               {['Approvals', 'Invoices', 'Settings'].map((item) => (
                 <div key={item} className="flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium text-slate-400 hover:text-slate-200 hover:bg-white/5 cursor-pointer">
                   <div className="w-4 h-4 rounded bg-slate-800"></div>
                   <span>{item}</span>
                 </div>
               ))}
            </div>
          </div>
          
          <div className="mt-auto pt-4 border-t border-slate-800">
            <div className="flex items-center space-x-3 px-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-cyan-500"></div>
              <div className="text-xs">
                <div className="text-white font-medium">Acme Mfg.</div>
                <div className="text-slate-500">Enterprise Plan</div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 bg-[#0b1120] p-6 overflow-hidden">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-xl font-semibold text-white">Procurement Overview</h2>
              <p className="text-sm text-slate-400">Welcome back, system operational.</p>
            </div>
            <Button size="sm" variant="primary">New RFQ +</Button>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            {[
              { label: 'Active RFQs', val: '12', color: 'text-blue-400', icon: Mail },
              { label: 'Pending Quotes', val: '28', color: 'text-cyan-400', icon: Clock },
              { label: 'Cost Savings', val: '$14.2k', color: 'text-green-400', icon: TrendingUp },
            ].map((stat, i) => (
              <div key={i} className="bg-[#1e293b]/50 border border-slate-700/50 p-4 rounded-xl">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs text-slate-400 font-medium">{stat.label}</span>
                  <stat.icon size={14} className="text-slate-500" />
                </div>
                <div className={`text-2xl font-bold ${stat.color}`}>{stat.val}</div>
              </div>
            ))}
          </div>

          {/* Table Area */}
          <div className="bg-[#1e293b]/30 border border-slate-800 rounded-xl overflow-hidden">
             <div className="px-4 py-3 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
               <h3 className="text-sm font-medium text-white">Recent Requirements</h3>
               <span className="text-xs text-blue-400 cursor-pointer">View All</span>
             </div>
             <div className="divide-y divide-slate-800/50">
               {[
                 { item: 'Hydraulic Pump Assembly', id: 'RFQ-8922', status: '3 Quotes', time: '2m ago' },
                 { item: 'Industrial Ball Bearings', id: 'RFQ-8921', status: 'Analyzing', time: '15m ago' },
                 { item: 'Safety Sensors (Optical)', id: 'RFQ-8920', status: 'Matched', time: '1h ago' },
                 { item: 'Conveyor Belt 400x', id: 'RFQ-8919', status: 'Pending', time: '3h ago' },
               ].map((row, idx) => (
                 <div key={idx} className="px-4 py-3 flex items-center justify-between hover:bg-white/5 transition-colors cursor-pointer group">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded bg-slate-800 flex items-center justify-center text-slate-400 group-hover:text-blue-400 transition-colors">
                        <Factory size={14} />
                      </div>
                      <div>
                        <div className="text-sm text-slate-200 font-medium">{row.item}</div>
                        <div className="text-xs text-slate-500">{row.id}</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className={`text-xs px-2 py-1 rounded border ${
                        row.status === 'Analyzing' ? 'border-yellow-500/20 bg-yellow-500/10 text-yellow-500' :
                        row.status === 'Pending' ? 'border-slate-500/20 bg-slate-500/10 text-slate-500' :
                        'border-blue-500/20 bg-blue-500/10 text-blue-400'
                      }`}>
                        {row.status}
                      </span>
                      <span className="text-xs text-slate-600 font-mono">{row.time}</span>
                    </div>
                 </div>
               ))}
             </div>
          </div>
          
          {/* AI Toast */}
          <div className="absolute bottom-6 right-6 w-72 bg-slate-800/90 backdrop-blur border border-blue-500/30 shadow-2xl rounded-xl p-4 animate-float">
             <div className="flex items-start space-x-3">
               <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shrink-0">
                 <Bot size={16} className="text-white" />
               </div>
               <div>
                 <h4 className="text-sm font-semibold text-white mb-1">Procure AI Insight</h4>
                 <p className="text-xs text-slate-300 leading-relaxed">
                   Supplier "TechParts Inc" has the lowest lead time (2 days) for RFQ-8921. Recommended.
                 </p>
                 <div className="mt-2 flex space-x-2">
                   <button className="text-xs bg-blue-600 hover:bg-blue-500 text-white px-3 py-1 rounded transition-colors">Accept</button>
                   <button className="text-xs bg-transparent hover:bg-white/10 text-slate-400 px-3 py-1 rounded transition-colors">Dismiss</button>
                 </div>
               </div>
             </div>
          </div>

        </div>
      </div>
    </div>
  </div>
);

const Hero = () => {
  return (
    <div className="relative pt-32 pb-20 lg:pt-48 lg:pb-40 overflow-hidden">
      {/* Dynamic Background */}
      <div className="absolute inset-0 bg-hero-glow opacity-30 pointer-events-none mix-blend-screen"></div>
      <div className="absolute inset-0 grid-bg pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full border border-blue-500/20 bg-blue-500/5 text-blue-300 text-xs font-medium mb-8 animate-fade-in-up">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
          </span>
          <span>Live Pilot: Quinte Region Manufacturers</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-6 leading-[1.1]">
          The Future of <br className="hidden md:block"/>
          <span className="text-gradient-primary">MRO Procurement</span>
        </h1>
        
        <p className="text-lg md:text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
          The first AI-powered platform connecting manufacturers with suppliers for instant RFQs, real-time comparison, and zero downtime.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
          <Button size="lg" onClick={() => document.getElementById('register')?.scrollIntoView({ behavior: 'smooth' })}>
            Request Early Access
            <ChevronRight className="ml-2 w-4 h-4" />
          </Button>
          <Button size="lg" variant="outline" onClick={() => document.getElementById('suppliers')?.scrollIntoView({ behavior: 'smooth' })}>
            Supplier Pre-Registration
          </Button>
        </div>

        <DashboardMockup />

      </div>
    </div>
  );
};

const Problem = () => (
  <Section id="problem" className="bg-[#020617]">
    <div className="grid md:grid-cols-2 gap-16 items-center">
      <div>
        <div className="inline-flex items-center space-x-2 text-red-400 font-semibold mb-4 tracking-wide uppercase text-sm">
          <AlertCircle size={16} />
          <span>The Bottleneck</span>
        </div>
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 leading-tight">
          MRO Procurement Is <br/>
          <span className="text-slate-500">Slow, Fragmented, Costly.</span>
        </h2>
        <p className="text-slate-400 text-lg mb-8 leading-relaxed">
          Manufacturing teams waste countless hours on manual RFQ emails, chasing suppliers, and comparing disorganized quotes while machines sit idle.
        </p>

        <div className="space-y-6">
          {[
            { title: "Email Chaos", desc: "Dozens of threads for a single part.", icon: Mail },
            { title: "Blind Sourcing", desc: "No visibility into fair market pricing or lead times.", icon: Search },
            { title: "Hidden Costs", desc: "Downtime costs $260k/hour on average.", icon: Zap },
          ].map((item, i) => (
            <div key={i} className="flex items-start space-x-4">
               <div className="bg-slate-800 p-2 rounded-lg text-slate-300 shrink-0 mt-1">
                 <item.icon size={20} />
               </div>
               <div>
                 <h4 className="text-white font-semibold">{item.title}</h4>
                 <p className="text-slate-500 text-sm mt-1">{item.desc}</p>
               </div>
            </div>
          ))}
        </div>
      </div>

      <div className="relative">
        <div className="absolute inset-0 bg-red-500/10 blur-[100px] rounded-full"></div>
        <div className="glass-card p-8 rounded-2xl relative border border-white/5">
           <div className="space-y-4 opacity-80 pointer-events-none select-none">
             {/* Fake Email Thread */}
             <div className="bg-slate-900/80 p-4 rounded border border-slate-700/50">
               <div className="h-2 w-20 bg-slate-700 rounded mb-2"></div>
               <div className="h-2 w-full bg-slate-800 rounded"></div>
             </div>
             <div className="bg-slate-900/80 p-4 rounded border border-slate-700/50 ml-8">
               <div className="h-2 w-20 bg-blue-900/50 rounded mb-2"></div>
               <div className="h-2 w-full bg-slate-800 rounded"></div>
             </div>
             <div className="bg-slate-900/80 p-4 rounded border border-slate-700/50">
               <div className="h-2 w-20 bg-slate-700 rounded mb-2"></div>
               <div className="h-2 w-3/4 bg-slate-800 rounded"></div>
             </div>
           </div>
           
           <div className="absolute inset-0 flex items-center justify-center">
             <div className="bg-red-500/90 text-white px-6 py-3 rounded-full font-bold shadow-[0_0_30px_rgba(239,68,68,0.5)] transform -rotate-12 border border-white/20 backdrop-blur-sm">
               Inefficient
             </div>
           </div>
        </div>
      </div>
    </div>
  </Section>
);

const Solution = () => (
  <Section id="solution" bg="gradient">
    <div className="text-center max-w-3xl mx-auto mb-20">
      <div className="inline-flex items-center space-x-2 text-cyan-400 font-semibold mb-4 tracking-wide uppercase text-sm">
        <Bot size={16} />
        <span>The Solution</span>
      </div>
      <h2 className="text-4xl font-bold text-white mb-6">Built for Enterprise Efficiency</h2>
      <p className="text-slate-400 text-lg">
        Procure AI acts as your intelligent procurement layer, automating the tedious parts of sourcing so you can focus on operations.
      </p>
    </div>

    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[
        { 
          icon: Zap, 
          title: "Instant RFQ Broadcast", 
          desc: "Create one request. We intelligently route it to the best-fit suppliers in seconds." 
        },
        { 
          icon: Bot, 
          title: "AI-Powered Matching", 
          desc: "Our algorithms compare price, lead time, and supplier reliability to rank quotes." 
        },
        { 
          icon: Layers, 
          title: "Unified Workflow", 
          desc: "Track every request, quote, and PO in a single, searchable dashboard." 
        },
        { 
          icon: ShieldCheck, 
          title: "Automated Compliance", 
          desc: "Ensure all purchases meet your internal approval limits and vendor requirements." 
        },
        { 
          icon: BarChart3, 
          title: "Spend Analytics", 
          desc: "Gain deep visibility into MRO spend patterns and identify saving opportunities." 
        },
        { 
          icon: Truck, 
          title: "Delivery Tracking", 
          desc: "Real-time updates on part status from order to delivery at your dock." 
        }
      ].map((feature, idx) => (
        <div key={idx} className="glass-panel p-8 rounded-xl hover:bg-slate-800/50 transition-all duration-300 group border border-white/5 hover:border-blue-500/30">
          <div className="w-12 h-12 bg-slate-800 rounded-lg flex items-center justify-center text-blue-400 mb-6 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
            <feature.icon size={24} />
          </div>
          <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
          <p className="text-slate-400 text-sm leading-relaxed">{feature.desc}</p>
        </div>
      ))}
    </div>
  </Section>
);

const AudienceSplit = () => (
  <div className="grid lg:grid-cols-2 min-h-[600px]">
    {/* Manufacturers */}
    <div id="manufacturers" className="relative p-12 lg:p-24 flex flex-col justify-center border-b lg:border-b-0 lg:border-r border-white/5 bg-[#020617] overflow-hidden group">
      <div className="absolute inset-0 bg-blue-900/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
      <div className="relative z-10">
        <div className="w-12 h-12 bg-blue-600/10 rounded-xl flex items-center justify-center mb-6">
          <Factory className="text-blue-500" size={24} />
        </div>
        <h2 className="text-3xl font-bold text-white mb-6">For Manufacturers</h2>
        <p className="text-slate-400 mb-8 leading-relaxed">
          Eliminate downtime and stop overpaying for parts. Centralize your MRO spending and get the parts you need, when you need them.
        </p>
        <ul className="space-y-4 mb-8">
          {[
            "3-5x Faster Procurement Cycle",
            "Transparent Pricing History",
            "Reduced Unplanned Downtime",
            "Multi-site Management"
          ].map((item, i) => (
            <li key={i} className="flex items-center text-slate-300">
              <CheckCircle2 className="w-5 h-5 text-blue-500 mr-3 shrink-0" />
              {item}
            </li>
          ))}
        </ul>
        <Button variant="outline" className="w-fit" onClick={() => document.getElementById('register')?.scrollIntoView({ behavior: 'smooth' })}>
          Join Pilot Program <ArrowRight className="ml-2 w-4 h-4" />
        </Button>
      </div>
    </div>

    {/* Suppliers */}
    <div id="suppliers" className="relative p-12 lg:p-24 flex flex-col justify-center bg-[#060b19] overflow-hidden group">
      <div className="absolute inset-0 bg-cyan-900/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
      <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 blur-[100px] rounded-full pointer-events-none"></div>
      
      <div className="relative z-10">
        <div className="w-12 h-12 bg-cyan-600/10 rounded-xl flex items-center justify-center mb-6">
          <Cpu className="text-cyan-500" size={24} />
        </div>
        <h2 className="text-3xl font-bold text-white mb-2">Leads AI Platform</h2>
        <span className="text-cyan-500 font-medium text-sm mb-6 block uppercase tracking-wider">For Suppliers & Distributors</span>
        
        <p className="text-slate-400 mb-8 leading-relaxed">
          Stop cold calling. Get highly qualified, ready-to-buy RFQs delivered straight to your dashboard. Quote faster, win more.
        </p>
        <ul className="space-y-4 mb-8">
          {[
            "High-Intent Inbound Leads",
            "Auto-Drafted Quotes via AI",
            "Market Demand Analytics",
            "Zero Marketing Spend Required"
          ].map((item, i) => (
            <li key={i} className="flex items-center text-slate-300">
              <CheckCircle2 className="w-5 h-5 text-cyan-500 mr-3 shrink-0" />
              {item}
            </li>
          ))}
        </ul>
        <Button variant="secondary" className="w-fit" onClick={() => document.getElementById('register')?.scrollIntoView({ behavior: 'smooth' })}>
          Register as Supplier <ArrowRight className="ml-2 w-4 h-4" />
        </Button>
      </div>
    </div>
  </div>
);

const RegionalPilot = () => (
  <Section id="regional" className="relative">
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-900/20 via-[#020617] to-[#020617] pointer-events-none"></div>
    <div className="flex flex-col md:flex-row gap-12 items-center">
      <div className="flex-1 space-y-8">
        <div>
          <h2 className="text-3xl font-bold text-white mb-4">Expanding Across Ontario</h2>
          <p className="text-slate-400 text-lg">
            Our pilot program is live in the Quinte Region, connecting local manufacturers with regional suppliers to strengthen the local supply chain.
          </p>
        </div>
        
        <div className="space-y-6">
          <div className="flex group">
            <div className="flex flex-col items-center mr-4">
               <div className="w-4 h-4 rounded-full bg-blue-500 border-4 border-blue-500/30 group-hover:scale-110 transition-transform"></div>
               <div className="w-0.5 h-full bg-blue-500/30 my-2"></div>
            </div>
            <div className="pb-8">
               <h4 className="text-white font-bold text-lg">Phase 1: Quinte Region</h4>
               <p className="text-sm text-blue-400 font-mono mt-1">STATUS: ACTIVE PILOT</p>
               <p className="text-slate-500 text-sm mt-2">Belleville, Trenton, Quinte West</p>
            </div>
          </div>
          <div className="flex group">
            <div className="flex flex-col items-center mr-4">
               <div className="w-4 h-4 rounded-full bg-cyan-500/50 border-4 border-cyan-500/20"></div>
            </div>
            <div>
               <h4 className="text-slate-300 font-bold text-lg group-hover:text-white transition-colors">Phase 2: Northumberland</h4>
               <p className="text-sm text-cyan-500/70 font-mono mt-1">STATUS: UPCOMING Q3 2025</p>
               <p className="text-slate-500 text-sm mt-2">Cobourg, Port Hope</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 w-full h-80 relative rounded-2xl overflow-hidden border border-slate-700 bg-slate-900/50 shadow-2xl">
         {/* Abstract Map */}
         <div className="absolute inset-0 opacity-40" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)',
            backgroundSize: '24px 24px'
         }}></div>
         
         <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="relative">
              {/* Central Hub */}
              <div className="absolute -top-6 -left-6 w-12 h-12 bg-blue-500/20 rounded-full animate-ping"></div>
              <MapPin className="text-blue-500 drop-shadow-[0_0_10px_rgba(59,130,246,0.8)]" size={32} />
              
              {/* Satellites */}
              <div className="absolute top-[-80px] left-[60px]">
                 <div className="w-3 h-3 bg-cyan-400 rounded-full shadow-[0_0_10px_#22d3ee]"></div>
                 <div className="h-[80px] w-[1px] bg-gradient-to-t from-transparent via-cyan-500/30 to-transparent absolute top-3 -left-1.5 rotate-45 transform origin-top-left"></div>
              </div>
              <div className="absolute bottom-[-50px] left-[-90px]">
                 <div className="w-3 h-3 bg-cyan-400 rounded-full shadow-[0_0_10px_#22d3ee]"></div>
              </div>
              <div className="absolute top-[-40px] left-[-80px]">
                 <div className="w-3 h-3 bg-cyan-400 rounded-full shadow-[0_0_10px_#22d3ee]"></div>
              </div>
            </div>
         </div>
         
         <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur px-3 py-1 rounded border border-white/10 text-xs font-mono text-slate-400">
           CONNECTIVITY_LAYER: ON
         </div>
      </div>
    </div>
  </Section>
);

const Roadmap = () => (
  <Section id="roadmap" bg="dark">
    <div className="text-center mb-16">
      <div className="inline-flex items-center space-x-2 text-blue-400 font-semibold mb-4 tracking-wide uppercase text-sm">
        <Calendar size={16} />
        <span>Future Vision</span>
      </div>
      <h2 className="text-3xl font-bold text-white">Product Roadmap</h2>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {[
        { year: "2025", title: "MVP & Pilot", desc: "Core platform development and beta testing in Quinte.", status: "active" },
        { year: "Q1 2026", title: "Supplier Onboarding", desc: "Expanding the network of verified industrial suppliers.", status: "next" },
        { year: "Q2 2026", title: "Ontario Launch", desc: "Full availability across the Ontario manufacturing corridor.", status: "future" },
        { year: "2027", title: "Canada-wide", desc: "Predictive maintenance integration and national expansion.", status: "future" },
      ].map((item, idx) => (
        <div key={idx} className={`relative p-6 rounded-xl border ${item.status === 'active' ? 'bg-blue-900/10 border-blue-500/50' : 'bg-slate-900/40 border-slate-800'} transition-all`}>
           {item.status === 'active' && (
             <span className="absolute top-4 right-4 flex h-3 w-3">
               <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
               <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
             </span>
           )}
           <div className={`text-2xl font-bold mb-2 ${item.status === 'active' ? 'text-blue-400' : 'text-slate-600'}`}>{item.year}</div>
           <h3 className="text-white font-semibold mb-2">{item.title}</h3>
           <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
        </div>
      ))}
    </div>
  </Section>
);

const Registration = () => {
  const [activeTab, setActiveTab] = useState<UserType>('manufacturer');

  return (
    <Section id="register" bg="gradient">
      <div className="max-w-4xl mx-auto">
        <div className="glass-panel rounded-2xl overflow-hidden border border-white/10 shadow-2xl relative">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-cyan-400 to-blue-500"></div>
          
          <div className="grid md:grid-cols-5 min-h-[500px]">
             {/* Info Sidebar */}
             <div className="hidden md:block col-span-2 bg-slate-900/50 p-8 border-r border-white/5 relative overflow-hidden">
                <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-blue-500/20 blur-[80px] rounded-full pointer-events-none"></div>
                <div className="relative z-10 h-full flex flex-col justify-between">
                   <div>
                     <h3 className="text-xl font-bold text-white mb-4">Why Join Now?</h3>
                     <ul className="space-y-4">
                       <li className="flex items-start space-x-3 text-slate-300 text-sm">
                         <div className="mt-1 w-1.5 h-1.5 rounded-full bg-blue-400"></div>
                         <span>Priority onboarding support</span>
                       </li>
                       <li className="flex items-start space-x-3 text-slate-300 text-sm">
                         <div className="mt-1 w-1.5 h-1.5 rounded-full bg-blue-400"></div>
                         <span>Locked-in early bird pricing</span>
                       </li>
                       <li className="flex items-start space-x-3 text-slate-300 text-sm">
                         <div className="mt-1 w-1.5 h-1.5 rounded-full bg-blue-400"></div>
                         <span>Shape the roadmap features</span>
                       </li>
                     </ul>
                   </div>
                   <div className="text-xs text-slate-500">
                     Trusted by 50+ companies in the Quinte Region.
                   </div>
                </div>
             </div>

             {/* Form Area */}
             <div className="col-span-3 p-8 md:p-10 bg-[#0f172a]">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-white">Get Early Access</h2>
                </div>

                <div className="flex p-1 bg-slate-800 rounded-lg mb-8">
                  <button 
                    className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${activeTab === 'manufacturer' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
                    onClick={() => setActiveTab('manufacturer')}
                  >
                    Manufacturer
                  </button>
                  <button 
                    className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${activeTab === 'supplier' ? 'bg-cyan-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
                    onClick={() => setActiveTab('supplier')}
                  >
                    Supplier
                  </button>
                </div>

                <form className="space-y-5" onSubmit={(e) => { e.preventDefault(); alert("Thanks for registering! We will contact you soon."); }}>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-400 uppercase">Company</label>
                        <input type="text" className="w-full bg-slate-800/50 border border-slate-700 rounded px-3 py-2 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors placeholder-slate-600" placeholder="Acme Inc." />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-400 uppercase">Contact Name</label>
                        <input type="text" className="w-full bg-slate-800/50 border border-slate-700 rounded px-3 py-2 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors placeholder-slate-600" placeholder="Jane Smith" />
                      </div>
                    </div>
                    
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-400 uppercase">Work Email</label>
                      <input type="email" className="w-full bg-slate-800/50 border border-slate-700 rounded px-3 py-2 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors placeholder-slate-600" placeholder="jane@company.com" />
                    </div>

                    {activeTab === 'manufacturer' ? (
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-400 uppercase">MRO Categories</label>
                        <input type="text" className="w-full bg-slate-800/50 border border-slate-700 rounded px-3 py-2 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors placeholder-slate-600" placeholder="e.g. Hydraulics, Bearings" />
                      </div>
                    ) : (
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-400 uppercase">Product Lines</label>
                        <input type="text" className="w-full bg-slate-800/50 border border-slate-700 rounded px-3 py-2 text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors placeholder-slate-600" placeholder="e.g. Electrical, Tools" />
                      </div>
                    )}
                  </div>

                  <Button 
                    type="submit" 
                    fullWidth
                    variant={activeTab === 'manufacturer' ? 'primary' : 'secondary'}
                    className="mt-6"
                  >
                    {activeTab === 'manufacturer' ? 'Join Waitlist' : 'Apply as Partner'}
                  </Button>
                </form>
             </div>
          </div>
        </div>
      </div>
    </Section>
  );
};

const Footer = () => (
  <footer className="bg-[#020617] border-t border-slate-800 pt-20 pb-10 px-4 sm:px-6 lg:px-8">
    <div className="max-w-7xl mx-auto">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
        <div className="col-span-2 md:col-span-1">
           <div className="flex items-center space-x-3 mb-4">
             <Logo className="w-8 h-8" />
             <span className="font-bold text-xl text-white">Procure AI</span>
           </div>
           <p className="text-slate-500 text-sm leading-relaxed mb-6">
             Modernizing MRO procurement for the Canadian manufacturing ecosystem.
           </p>
           <div className="flex space-x-4">
             {/* Social placeholders */}
             <div className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 cursor-pointer"></div>
             <div className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 cursor-pointer"></div>
             <div className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 cursor-pointer"></div>
           </div>
        </div>
        
        <div>
          <h4 className="text-white font-semibold mb-4">Platform</h4>
          <ul className="space-y-2 text-sm text-slate-400">
            <li className="hover:text-blue-400 cursor-pointer">For Manufacturers</li>
            <li className="hover:text-blue-400 cursor-pointer">For Suppliers</li>
            <li className="hover:text-blue-400 cursor-pointer">Pricing</li>
            <li className="hover:text-blue-400 cursor-pointer">Security</li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-4">Company</h4>
          <ul className="space-y-2 text-sm text-slate-400">
            <li className="hover:text-blue-400 cursor-pointer">About Us</li>
            <li className="hover:text-blue-400 cursor-pointer">Careers</li>
            <li className="hover:text-blue-400 cursor-pointer">Contact</li>
            <li className="hover:text-blue-400 cursor-pointer">Partners</li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-4">Legal</h4>
          <ul className="space-y-2 text-sm text-slate-400">
            <li className="hover:text-blue-400 cursor-pointer">Privacy Policy</li>
            <li className="hover:text-blue-400 cursor-pointer">Terms of Service</li>
            <li className="hover:text-blue-400 cursor-pointer">Cookie Policy</li>
          </ul>
        </div>
      </div>
      
      <div className="pt-8 border-t border-slate-900 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="text-slate-600 text-xs">
          &copy; {new Date().getFullYear()} Procure AI Technologies Inc. All rights reserved.
        </div>
        <div className="flex items-center space-x-2 text-xs text-slate-600">
          <div className="w-2 h-2 rounded-full bg-green-500"></div>
          <span>Systems Operational</span>
        </div>
      </div>
    </div>
  </footer>
);

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 selection:bg-blue-500/30 selection:text-blue-100">
      <Navbar />
      <Hero />
      <Problem />
      <Solution />
      <AudienceSplit />
      <RegionalPilot />
      <Roadmap />
      <Registration />
      <Footer />
    </div>
  );
};

export default App;