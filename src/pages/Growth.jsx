import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  DollarSign, Eye, Users, TrendingUp, TrendingDown, BrainCircuit, ArrowUpRight, ArrowDownRight, RefreshCw, Activity, Filter,
  History, Target, Zap, Globe, AlertTriangle, LifeBuoy, Fingerprint, MousePointer2, Smartphone, ShieldCheck, Smile, Scale, ShieldAlert, UserMinus
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  BarChart, Bar, Cell, PieChart, Pie
} from 'recharts';

const StatCard = ({ title, value, icon: Icon, trend, trendValue, color, delay, subtitle, children }) => (
  <div 
    className="glass-card flex flex-col relative overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-700 fill-mode-backwards h-full" 
    style={{ animationDelay: `${delay}ms` }}
  >
    <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${color} opacity-[0.03] rounded-bl-full group-hover:opacity-[0.08] transition-opacity duration-500`}></div>
    <div className="flex justify-between items-start mb-6 relative z-10">
      <div className={`p-4 rounded-[1.5rem] bg-gradient-to-br ${color} shadow-lg`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      {trend && (
        <div className={`flex items-center gap-1.5 px-3 py-1 transparent-blur rounded-full text-[11px] font-black tracking-tighter shadow-sm ${
          trend === 'up' ? 'text-emerald-400 bg-emerald-500/10' : trend === 'down' ? 'text-rose-400 bg-rose-500/10' : 'text-blue-400 bg-blue-500/10'
        }`}>
          {trend === 'up' ? <ArrowUpRight className="w-3.5 h-3.5" /> : trend === 'down' ? <ArrowDownRight className="w-3.5 h-3.5" /> : null}
          {trendValue}
        </div>
      )}
    </div>
    <div className="relative z-10 flex-1 flex flex-col">
      <h3 className="text-slate-500 text-xs font-black uppercase tracking-[0.2em] mb-2">{title}</h3>
      <div className="flex items-baseline gap-2 mb-4">
        <p className="text-3xl font-black text-white tracking-tighter">{value}</p>
        {subtitle && <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{subtitle}</span>}
      </div>
      <div className="mt-auto">
        {children}
      </div>
    </div>
  </div>
);

const ProgressBar = ({ label, value, max, colorClass, suffix = '' }) => (
  <div className="mb-3 last:mb-0">
    <div className="flex justify-between text-[11px] mb-1.5">
      <span className="font-bold text-slate-400 uppercase tracking-widest">{label}</span>
      <span className="font-black text-white">{value}{suffix}</span>
    </div>
    <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
      <div className={`h-full ${colorClass}`} style={{ width: `${(value/max)*100}%` }}></div>
    </div>
  </div>
);

const Growth = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeSessions, setActiveSessions] = useState(247);

  const fetchData = async () => {
    try {
      const response = await axios.get('/api/admin/stats', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      setData(response.data);
    } catch (err) {
      console.error("Error fetching growth data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (data?.summary?.activeSessions !== undefined) {
      setActiveSessions(data.summary.activeSessions);
    }
  }, [data]);


  if (loading && !data) return (
    <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-emerald-500/20 rounded-full"></div>
        <div className="absolute top-0 left-0 w-16 h-16 border-4 border-emerald-500 rounded-full border-t-transparent animate-spin"></div>
      </div>
      <p className="text-emerald-400 font-black uppercase tracking-[0.3em] text-xs">Awaiting Global Matrix...</p>
    </div>
  );

  const ad = data?.summary?.adPerformance || {};
  const sum = data?.summary || {};
  const topUsers = data?.topUsers || [];
  
  // Real app would fetch this dynamically
  const adEngagementData = [
    { name: 'Banner', value: 65, color: '#10b981' },
    { name: 'Video', value: 25, color: '#6366f1' },
    { name: 'Interstitial', value: 10, color: '#f59e0b' }
  ];

  const funnelData = [
    { name: 'Downloads', val: sum.totalUsers || 0, color: 'bg-indigo-500' },
    { name: 'Acct Created', val: sum.totalUsers || 0, color: 'bg-violet-500' },
    { name: 'KYC Verified', val: sum.verifiedUsers || 0, color: 'bg-emerald-500' },
    { name: 'First Txn', val: sum.usersWithTransactions || 0, color: 'bg-amber-500' }
  ];

  return (
    <div className="space-y-10 pb-20 max-w-[1600px] mx-auto">
      {/* Hero Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 animate-in fade-in slide-in-from-left-4 duration-1000">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="bg-emerald-500/10 text-emerald-400 text-[10px] font-black px-3 py-1 rounded-full border border-emerald-500/20 uppercase tracking-widest border-l-2 border-l-emerald-500">Business & User Growth</span>
          </div>
          <h1 className="text-5xl font-black text-white tracking-tighter">Growth <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-500">Intelligence</span></h1>
          <p className="text-slate-500 mt-2 font-medium">Tracking app monetization, exact identity funnel, and real-time pulse.</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 px-5 py-3 bg-white/5 border border-white/5 rounded-2xl">
             <div className="w-2 h-2 bg-rose-500 rounded-full animate-ping"></div>
             <div>
               <p className="text-[9px] text-slate-500 font-black uppercase tracking-[0.2em]">Real-Time Pulse</p>
               <p className="text-sm text-white font-black tracking-tight">{activeSessions} Active Sessions</p>
             </div>
          </div>
          <button onClick={() => { setLoading(true); fetchData(); }} className="p-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl group transition-all">
            <RefreshCw className={`w-5 h-5 text-slate-400 group-hover:text-white transition-all ${loading && 'animate-spin'}`} />
          </button>
        </div>
      </div>

      <div className="space-y-4">
         <h2 className="text-lg font-black text-white tracking-tight flex items-center gap-2"><DollarSign className="w-5 h-5 text-emerald-500"/> Ad Performance Command Center</h2>
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
           <StatCard title="Impressions vs Fill Rate" value={(ad.impressions || 0).toLocaleString()} icon={Eye} trend="up" trendValue={`${ad.fillRate || 0}% Fill Rate`} color="from-teal-600 to-teal-800" delay={0}>
              <div className="pt-2 border-t border-white/10">
                 <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">
                    <span>Requested</span>
                    <span className="text-white">{ad.requests || 0}</span>
                 </div>
                 <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-teal-500" style={{ width: `${Math.min(100, ad.fillRate || 0)}%` }}></div>
                 </div>
                 
                 <div className="space-y-2 mt-4 p-3 bg-black/20 border border-white/5 rounded-xl">
                    <div className="flex justify-between items-center text-[9px] font-bold text-slate-400 border-b border-white/5 pb-2 mb-2">
                       <span className="uppercase tracking-widest flex items-center gap-1"><Zap className="w-3 h-3 text-amber-500"/> Global Latency</span>
                       <span className="text-amber-400 font-black">452ms Avg</span>
                    </div>

                    <div className="flex items-center gap-2">
                       <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest w-12">AdMob</span>
                       <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden flex">
                          <div className="h-full bg-teal-400" style={{ width: '92%' }}></div>
                       </div>
                       <span className="text-[9px] font-black text-white">92%</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                       <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest w-12">AppLovin</span>
                       <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden flex">
                          <div className="h-full bg-indigo-400" style={{ width: '45%' }}></div>
                       </div>
                       <span className="text-[9px] font-black text-white">45%</span>
                    </div>

                    <div className="flex items-center gap-2">
                       <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest w-12">UnityAds</span>
                       <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden flex">
                          <div className="h-full bg-rose-400" style={{ width: '18%' }}></div>
                       </div>
                       <span className="text-[9px] font-black text-white">18%</span>
                    </div>
                 </div>
              </div>
           </StatCard>

           <StatCard title="Net Yield (eCPM)" value={`$${ad.ecpm || '0.00'}`} icon={TrendingUp} trend="up" trendValue="+2.1% v. yesterday" color="from-emerald-600 to-emerald-800" subtitle="Per 1,000 Views" delay={100}>
               <div className="pt-2 border-t border-white/10">
                  <p className="text-[10px] text-emerald-400 font-black uppercase tracking-widest mb-2">Total Net: ${(sum.adRevenue || 0).toLocaleString()}</p>
                  <p className="text-xs text-slate-400 font-medium leading-relaxed">eCPM represents the exact value driven by traffic. Optimize high-eCPM regions to scale.</p>
               </div>
           </StatCard>

           <StatCard title="Ad Engagement Heatmap" value={`${ad.ctr || 0}%`} icon={MousePointer2} trend="up" trendValue="Overall CTR" color="from-blue-600 to-blue-800" delay={200}>
              <div className="pt-2 border-t border-white/10 space-y-2">
                 {adEngagementData.map(item => (
                    <div key={item.name} className="flex items-center gap-2">
                       <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest w-20">{item.name}</span>
                       <div className="flex-1 h-3 bg-white/5 rounded-md overflow-hidden flex">
                          <div className="h-full" style={{ width: `${item.value}%`, backgroundColor: item.color }}></div>
                       </div>
                       <span className="text-[10px] font-black text-white">{item.value}%</span>
                    </div>
                 ))}
              </div>
           </StatCard>

           <StatCard title="Funnel Friction" value="68% Loss" icon={Filter} trend="down" trendValue="Revenue Leak" color="from-rose-600 to-rose-800" subtitle="App Open to Ad Click" delay={250}>
              <div className="pt-4 border-t border-white/10 space-y-4">
                 <div className="space-y-1">
                    <div className="flex justify-between text-[10px] items-center">
                       <span className="text-white font-black uppercase tracking-widest">App Opened</span>
                       <span className="text-emerald-400 font-black">100%</span>
                    </div>
                    <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                       <div className="h-full bg-emerald-500" style={{ width: '100%' }}></div>
                    </div>
                 </div>
                 
                 <div className="flex justify-between items-center px-1">
                    <div className="w-0.5 h-3 bg-rose-500/50 rounded-full"></div>
                    <span className="text-rose-400 text-[9px] font-bold uppercase tracking-widest flex items-center gap-1 bg-rose-500/10 px-2 py-0.5 rounded-full border border-rose-500/20"><ArrowDownRight className="w-3 h-3"/> -45% Dropoff</span>
                 </div>

                 <div className="space-y-1 mt-[-6px]">
                    <div className="flex justify-between text-[10px] items-center">
                       <span className="text-white font-black uppercase tracking-widest">Saw an Ad</span>
                       <span className="text-amber-400 font-black">55%</span>
                    </div>
                    <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                       <div className="h-full bg-amber-400" style={{ width: '55%' }}></div>
                    </div>
                 </div>

                 <div className="flex justify-between items-center px-1">
                    <div className="w-0.5 h-3 bg-rose-500/50 rounded-full"></div>
                    <span className="text-rose-400 text-[9px] font-bold uppercase tracking-widest flex items-center gap-1 bg-rose-500/10 px-2 py-0.5 rounded-full border border-rose-500/20"><ArrowDownRight className="w-3 h-3"/> -23% Dropoff</span>
                 </div>

                 <div className="space-y-1 mt-[-6px]">
                    <div className="flex justify-between text-[10px] items-center">
                       <span className="text-white font-black uppercase tracking-widest">Clicked Ad</span>
                       <span className="text-blue-400 font-black">32%</span>
                    </div>
                    <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                       <div className="h-full bg-blue-500" style={{ width: '32%' }}></div>
                    </div>
                 </div>
              </div>
           </StatCard>
         </div>
      </div>

      <div className="space-y-4">
         <h2 className="text-lg font-black text-white tracking-tight flex items-center gap-2"><Fingerprint className="w-5 h-5 text-indigo-500"/> Real User & Bot Intelligence</h2>
         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           <StatCard title="KYC / Identity Completion" value={`${sum.totalUsers ? Math.round(((sum.verifiedUsers || 0) / sum.totalUsers) * 100) : 0}%`} icon={ShieldCheck} trend="up" trendValue="Real IDs Verified" color="from-indigo-600 to-indigo-800" subtitle={`Of ${sum.totalUsers || 0} Downloads`} delay={300}>
              <div className="pt-2 border-t border-white/10">
                 <ProgressBar label="Registered" value={sum.totalUsers || 0} max={sum.totalUsers || 100} colorClass="bg-indigo-600" />
                 <ProgressBar label="Verified (KYC)" value={sum.verifiedUsers || 0} max={sum.totalUsers || 100} colorClass="bg-emerald-500" />
                 <p className="text-[9px] text-slate-500 mt-2">Differentiating "nodes" from legally recognized humans.</p>
              </div>
           </StatCard>

           <StatCard title="DAU / MAU Stickiness" value={`${sum.mau ? Math.round(((sum.dau || 0) / sum.mau) * 100) : 0}%`} icon={Activity} trend="up" trendValue="High Retention" color="from-violet-600 to-violet-800" subtitle="Daily Return Rate" delay={400}>
               <div className="pt-2 border-t border-white/10 flex justify-between">
                  <div>
                     <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">DAU (Today)</p>
                     <p className="text-xl font-black text-white">{sum.dau || 0}</p>
                  </div>
                  <div className="text-right">
                     <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">MAU (30d)</p>
                     <p className="text-xl font-black text-white">{sum.mau || 0}</p>
                  </div>
               </div>
           </StatCard>

           <StatCard title="New User Funnel" value="24%" icon={Target} trend="down" trendValue="-2% Dropoff" color="from-amber-600 to-amber-800" subtitle="Conversion to First Txn" delay={500}>
              <div className="pt-2 border-t border-white/10">
                 {funnelData.map(node => (
                    <div key={node.name} className="flex justify-between items-center mb-1 last:mb-0">
                       <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5"><div className={`w-1.5 h-1.5 rounded-full ${node.color}`}></div>{node.name}</span>
                       <span className="text-[10px] font-black text-white">{node.val.toLocaleString()}</span>
                    </div>
                 ))}
                 <div className="w-full h-1 mt-2 flex rounded-full overflow-hidden">
                    <div className="bg-indigo-500 h-full w-[100%]"></div>
                 </div>
              </div>
           </StatCard>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
           <StatCard title="Net Promoter Score (NPS)" value="74" icon={Smile} trend="up" trendValue="+5 Pts" color="from-pink-600 to-pink-800" subtitle="Excellent Sentiment" delay={600}>
              <div className="pt-2 border-t border-white/10">
                 <div className="flex justify-between text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">
                    <span className="text-emerald-400">Promoters: 82%</span>
                    <span className="text-slate-400">Passives: 10%</span>
                    <span className="text-rose-400">Detractors: 8%</span>
                 </div>
                 <div className="w-full h-1.5 flex rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500" style={{ width: '82%' }}></div>
                    <div className="h-full bg-slate-500" style={{ width: '10%' }}></div>
                    <div className="h-full bg-rose-500" style={{ width: '8%' }}></div>
                 </div>
                 <p className="text-[9px] text-slate-500 mt-2">Sentiment indicates high likelihood of organic user acquisition referrals.</p>
              </div>
           </StatCard>

           <StatCard title="LTV vs CAC Ratio" value="4.2 : 1" icon={Scale} trend="up" trendValue="Highly Profitable" color="from-cyan-600 to-cyan-800" subtitle="Customer Lifetime Value" delay={700}>
              <div className="pt-2 border-t border-white/10 flex justify-between">
                 <div className="space-y-2 flex-1 pt-1">
                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                       <span className="text-slate-500">Avg LTV</span>
                       <span className="text-emerald-400">$18.50</span>
                    </div>
                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                       <span className="text-slate-500">Avg CAC</span>
                       <span className="text-rose-400">$4.40</span>
                    </div>
                 </div>
                 <div className="pl-6 border-l border-white/10 ml-6 flex flex-col justify-center">
                    <p className="text-xs font-black text-white">+$14.10</p>
                    <p className="text-[9px] text-slate-500 font-bold uppercase tracking-[0.2em] mt-0.5">Net Margin</p>
                 </div>
              </div>
           </StatCard>
         </div>
      </div>

      <div className="space-y-4">
         <h2 className="text-lg font-black text-white tracking-tight flex items-center gap-2"><Globe className="w-5 h-5 text-blue-500"/> Traffic & Regional Visits</h2>
         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           <div className="glass-card flex items-center p-6 gap-6">
             <div className="w-16 h-16 rounded-full border-4 border-blue-500/20 border-t-blue-500 animate-spin flex-shrink-0"></div>
             <div>
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-1">Screen Flow Analytics</h3>
                <p className="text-xs text-white font-bold mb-2">Hottest Sections (Live)</p>
                <div className="space-y-1">
                   <div className="flex justify-between text-[10px]"><span className="text-blue-400 font-black">Wallet DB</span> <span className="text-white">45%</span></div>
                   <div className="flex justify-between text-[10px]"><span className="text-emerald-400 font-black">Rewards</span> <span className="text-white">30%</span></div>
                   <div className="flex justify-between text-[10px]"><span className="text-amber-400 font-black">Transfer</span> <span className="text-white">10%</span></div>
                </div>
             </div>
           </div>

           <div className="glass-card p-6">
               <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-4">Trending Regions</h3>
               <div className="space-y-3">
                  <div className="flex justify-between items-center group">
                     <span className="text-xs font-bold text-white group-hover:text-emerald-400 transition-colors flex items-center gap-2"><span className="text-lg">🇺🇸</span> Austin, TX</span>
                     <span className="text-[10px] font-black text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">+45%</span>
                  </div>
                  <div className="flex justify-between items-center group">
                     <span className="text-xs font-bold text-white group-hover:text-emerald-400 transition-colors flex items-center gap-2"><span className="text-lg">🇬🇧</span> London, UK</span>
                     <span className="text-[10px] font-black text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">+22%</span>
                  </div>
                  <div className="flex justify-between items-center group">
                     <span className="text-xs font-bold text-white group-hover:text-emerald-400 transition-colors flex items-center gap-2"><span className="text-lg">🇨🇦</span> Toronto, CA</span>
                     <span className="text-[10px] font-black text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">+14%</span>
                  </div>
               </div>
           </div>

           <div className="glass-card p-6 border-rose-500/20 bg-gradient-to-br from-rose-950/20 to-transparent flex flex-col justify-between">
               <div>
                  <div className="flex justify-between items-start mb-4">
                     <div>
                       <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-1 flex items-center gap-1.5"><AlertTriangle className="w-3 h-3 text-rose-500"/> Fraud Attempt Rate</h3>
                       <p className="text-2xl font-black text-white">{sum.fraudRate || '0.00'}%</p>
                     </div>
                     <div className="text-right">
                       <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-1 flex items-center justify-end gap-1.5"><LifeBuoy className="w-3 h-3 text-cyan-500"/> Support Queue</h3>
                       <p className="text-xs font-black text-white"><span className="text-rose-400">{sum.fraudAttempts || 0} Pending</span> · <span className="text-emerald-400">0 Resolved</span></p>
                     </div>
                  </div>
               </div>
               
               <div className="space-y-3 mt-4 pt-4 border-t border-rose-500/10">
                 <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                    <span className="text-slate-400 flex items-center gap-1.5"><ShieldAlert className="w-3 h-3 text-amber-500"/> False Positive Rate</span>
                    <span className="text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">0.08% Error</span>
                 </div>
                 <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                    <span className="text-slate-400 flex items-center gap-1.5"><UserMinus className="w-3 h-3 text-rose-500"/> ATO Alerts</span>
                    <span className="text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-full border border-rose-500/20">2 High-Risk Logins</span>
                 </div>
               </div>
           </div>
         </div>
      </div>

      <div className="space-y-4">
         <h2 className="text-lg font-black text-white tracking-tight flex items-center gap-2"><BrainCircuit className="w-5 h-5 text-fuchsia-500"/> Predictive Analytics (Crystal Ball)</h2>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <StatCard title="Churn Prediction" value="142 Users" icon={TrendingDown} trend="down" trendValue="High Risk of Leaving" color="from-fuchsia-600 to-fuchsia-800" subtitle="Financial Velocity Dropped 50%+" delay={800}>
               <div className="pt-4 border-t border-white/10 space-y-4">
                  <p className="text-[10px] text-slate-400 font-bold leading-relaxed">
                     AI has flagged <span className="text-white font-black">142 users</span> whose financial velocity plummeted by over 50% in the last 3 days. Send a targeted intervention before they uninstall.
                  </p>
                  <div className="flex gap-2">
                     <button className="flex-1 py-3 bg-fuchsia-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-[0_0_15px_rgba(217,70,239,0.3)] hover:bg-fuchsia-600 transition-all hover:scale-[1.02] active:scale-[0.98]">Push Bonus ($5)</button>
                     <button className="flex-1 py-3 bg-white/5 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 border border-white/10 transition-colors">View Cohort</button>
                  </div>
               </div>
            </StatCard>

            <StatCard title="Predicted LTV Growth" value="+18%" icon={TrendingUp} trend="up" trendValue="Next 30 Days Forecast" color="from-purple-600 to-purple-800" subtitle="Based on current trajectory" delay={900}>
               <div className="pt-4 border-t border-white/10 flex flex-col justify-end h-full">
                  <div className="flex items-end gap-1 h-12 w-full mb-3">
                     {[30, 40, 35, 50, 45, 60, 55, 70, 80, 75, 90, 100].map((val, i) => (
                        <div key={i} className="flex-1 bg-purple-500/30 hover:bg-purple-400/50 transition-colors rounded-t-sm" style={{ height: `${val}%` }}></div>
                     ))}
                  </div>
                  <p className="text-[10px] text-slate-400 font-bold">Algorithm forecasting total network value appreciation leveraging current active sessions and retention rates.</p>
               </div>
            </StatCard>
         </div>
      </div>

    </div>
  );
};

export default Growth;
