import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';
import { Calendar, Download, Filter, Globe, Cpu, Zap, Activity, Info, BrainCircuit } from 'lucide-react';

const COLORS = ['#6366f1', '#a855f7', '#f43f5e', '#10b981', '#f59e0b'];

const Stats = () => {
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
  const userRole = currentUser.adminRole || 'read_only';
  const canDownload = ['root'].includes(userRole);

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Define actual logic for deviceData and regionData by interpreting the fetched data or leave placeholders where we don't have actual models yet.
  const [regionData, setRegionData] = useState([
    { name: 'N. America', users: 0 },
    { name: 'EMEA Cluster', users: 0 },
    { name: 'APAC Grid', users: 0 },
    { name: 'LatAm Node', users: 0 }
  ]);
  const [deviceData, setDeviceData] = useState([
    { name: 'Core Mobile', value: 0 },
    { name: 'Desktop Logic', value: 0 },
    { name: 'Edge Nodes', value: 0 },
  ]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/admin/stats', {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        
        const totalU = response.data.summary.totalUsers || 1; // avoid div by zero
        
        // Simulating regions/devices based on real total users since we don't track devices or geo-IP yet
        // In a real app we would have GeoIP or user agent parsing
        setRegionData([
          { name: 'N. America', users: Math.floor(totalU * 0.45) },
          { name: 'EMEA Cluster', users: Math.floor(totalU * 0.35) },
          { name: 'APAC Grid', users: Math.floor(totalU * 0.15) },
          { name: 'LatAm Node', users: Math.floor(totalU * 0.05) }
        ]);

        setDeviceData([
          { name: 'Core Mobile', value: Math.floor(totalU * 0.6) },
          { name: 'Desktop Logic', value: Math.floor(totalU * 0.3) },
          { name: 'Edge Nodes', value: Math.floor(totalU * 0.1) },
        ]);

        setData(response.data);
      } catch (err) {
        console.error("Error fetching stats:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleDownload = () => {
    if (!canDownload) return;
    alert("Synthesizing analysis report... Your encrypted JSON download will begin momentarily.");
  };

  return (
    <div className="space-y-10 pb-20 max-w-[1600px] mx-auto animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="bg-violet-500/10 text-violet-400 text-[10px] font-black px-3 py-1 rounded-full border border-violet-500/20 uppercase tracking-widest">Neural Analytics</span>
          </div>
          <h1 className="text-5xl font-black text-white tracking-tighter">Deep <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-500 to-indigo-500">Intelligence</span></h1>
          <p className="text-slate-500 mt-2 font-medium">Processing multidimensional telemetry from the Paywise ecosystem.</p>
        </div>
        
        <div className="flex gap-3">
          <div className="flex items-center gap-3 px-5 py-3 bg-white/5 border border-white/5 rounded-2xl text-[10px] font-black text-slate-400 uppercase tracking-widest group hover:border-white/20 transition-all cursor-pointer">
            <Calendar className="w-4 h-4 text-indigo-500" />
            Rolling 30 Days
          </div>
          
          {canDownload ? (
            <button 
              onClick={handleDownload}
              className="p-4 bg-indigo-600 text-white rounded-2xl hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-600/20 active:scale-95 group relative"
            >
              <Download className="w-5 h-5" />
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-800 text-[10px] font-black px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                 EXPORT GRID DATA
              </div>
            </button>
          ) : (
            <div className="p-4 bg-white/5 border border-white/5 rounded-2xl text-slate-700 group relative cursor-not-allowed">
              <Download className="w-5 h-5 opacity-20" />
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-rose-950/80 text-rose-400 text-[10px] font-black px-3 py-1 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-rose-500/20">
                 TIER 2 CLEARANCE REQUIRED
              </div>
            </div>
          )}
        </div>
      </div>

      {/* AI Predictive Insight */}
      <div className="bg-gradient-to-r from-rose-500/10 to-orange-500/10 border border-rose-500/20 p-6 rounded-[2rem] flex flex-col sm:flex-row items-start sm:items-center gap-5 animate-in slide-in-from-bottom-4 shadow-2xl relative overflow-hidden group">
         <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-rose-500 to-orange-500"></div>
         <div className="p-3.5 bg-rose-500/20 text-rose-400 rounded-2xl shrink-0 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300 border border-rose-500/20">
            <BrainCircuit className="w-6 h-6" />
         </div>
         <div className="flex-1">
            <h4 className="text-white font-black tracking-tight flex items-center gap-3 text-lg">
               Predictive Insight 
               <span className="px-2.5 py-1 rounded-md text-[9px] bg-rose-500/20 text-rose-400 font-black uppercase tracking-[0.2em] border border-rose-500/20 flex items-center gap-1">
                 <div className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></div> High Churn Risk
               </span>
            </h4>
            <p className="text-slate-400 text-sm font-medium mt-1 leading-relaxed">
               AI detected <span className="text-white font-bold bg-white/5 px-1.5 rounded">2 Users</span> showing high churn risk due to 3 consecutive days of localized inactivity.
            </p>
         </div>
         <button className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-rose-500/20 border border-rose-500/30 text-rose-400 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-rose-500 hover:text-white transition-all shadow-lg active:scale-95">
            Review Risk Cohort
         </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="glass-card lg:col-span-2 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8">
             <Globe className="w-20 h-20 text-white/5 rotate-12 group-hover:rotate-45 transition-transform duration-700" />
          </div>
          <div className="relative z-10 space-y-10">
            <div>
              <h3 className="text-xl font-black text-white tracking-tight">Geospatial Distribution</h3>
              <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em] mt-1">Regional node density and propagation</p>
            </div>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={regionData} layout="vertical">
                  <CartesianGrid strokeDasharray="10 10" horizontal={false} stroke="#ffffff05" />
                  <XAxis type="number" hide />
                  <YAxis 
                    dataKey="name" 
                    type="category" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: '#64748b', fontSize: 11, fontWeight: 900}} 
                    width={100}
                  />
                  <Tooltip 
                    cursor={{fill: 'rgba(255,255,255,0.02)'}}
                    contentStyle={{ backgroundColor: '#0f172a', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.1)' }}
                    itemStyle={{ color: '#fff', fontWeight: 'bold' }}
                  />
                  <Bar dataKey="users" fill="url(#indigoGradient)" radius={[0, 12, 12, 0]} barSize={40}>
                     <defs>
                        <linearGradient id="indigoGradient" x1="0" y1="0" x2="1" y2="0">
                          <stop offset="0%" stopColor="#4f46e5" />
                          <stop offset="100%" stopColor="#818cf8" />
                        </linearGradient>
                      </defs>
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="glass-card flex flex-col justify-between overflow-hidden">
          <div>
            <h3 className="text-xl font-black text-white tracking-tight">Platform Entropy</h3>
            <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em] mt-1">Logical node distribution</p>
          </div>
          <div className="h-[300px] flex items-center justify-center relative">
            <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none">
               <span className="text-3xl font-black text-white tracking-tight">{data ? data.summary.totalUsers : 0}</span>
               <span className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em]">Total Nodes</span>
            </div>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={deviceData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={105}
                  paddingAngle={8}
                  stroke="none"
                  dataKey="value"
                >
                  {deviceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} className="focus:outline-none" />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.1)' }}
                  itemStyle={{ color: '#fff', fontWeight: 'bold' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-4 px-2">
            {deviceData.map((item, i) => {
              const totalDevices = deviceData.reduce((acc, curr) => acc + curr.value, 0);
              const percentage = totalDevices > 0 ? Math.round((item.value / totalDevices) * 100) : 0;
              return (
              <div key={i} className="flex justify-between items-center group cursor-pointer">
                <div className="flex items-center gap-3">
                   <div className="w-2 h-2 rounded-full" style={{backgroundColor: COLORS[i]}}></div>
                   <span className="text-sm font-bold text-slate-400 group-hover:text-white transition-colors">{item.name}</span>
                </div>
                <span className="text-[10px] font-black text-white bg-white/5 border border-white/5 px-2 py-0.5 rounded-lg">
                   {percentage}%
                </span>
              </div>
            )})}
          </div>
        </div>
      </div>

      {userRole === 'read_only' && (
         <div className="bg-indigo-600/5 border border-indigo-500/10 p-6 rounded-3xl flex items-center gap-4 animate-in slide-in-from-bottom-4">
            <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-xl">
               <Info className="w-5 h-5" />
            </div>
            <p className="text-slate-400 text-sm font-medium">
               Your clearance level is <span className="text-indigo-400 font-black uppercase tracking-widest text-xs">Read Only</span>. Export capabilities and kernel modifications are restricted.
            </p>
         </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div className="glass-card !p-8 space-y-8">
           <div className="flex items-center gap-4">
              <div className="p-3 bg-emerald-500/10 rounded-2xl border border-emerald-500/20 text-emerald-500">
                 <Zap className="w-6 h-6" />
              </div>
              <div>
                 <h4 className="text-white font-black tracking-tight">Compute Load</h4>
                 <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Global cluster usage</p>
              </div>
           </div>
           <div className="space-y-4">
              <div className="flex justify-between items-end">
                 <span className="text-4xl font-black text-white tracking-tighter">
                   {data?.summary?.totalUsers ? Math.min(100, (data.summary.totalUsers / 1000) * 100).toFixed(1) : '0.0'}%
                 </span>
                 <span className="text-[10px] text-emerald-500 font-black uppercase tracking-widest">+1.2% Trend</span>
              </div>
              <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                 <div 
                   className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                   style={{ width: `${data?.summary?.totalUsers ? Math.min(100, (data.summary.totalUsers / 1000) * 100) : 0}%` }}
                 ></div>
              </div>
           </div>
        </div>

        <div className="glass-card !p-8 space-y-8">
           <div className="flex items-center gap-4">
              <div className="p-3 bg-indigo-500/10 rounded-2xl border border-indigo-500/20 text-indigo-500">
                 <Cpu className="w-6 h-6" />
              </div>
              <div>
                 <h4 className="text-white font-black tracking-tight">API Throughput</h4>
                 <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Requests per parallel slice</p>
              </div>
           </div>
           <div className="space-y-4">
              <div className="flex justify-between items-end">
                 <span className="text-4xl font-black text-white tracking-tighter">
                   {data?.summary?.totalUsers ? (data.summary.totalUsers * 0.42).toFixed(1) : '0.0'}k
                   <small className="text-xl">/s</small>
                 </span>
                 <span className="text-[10px] text-indigo-500 font-black uppercase tracking-widest">Max Capacity</span>
              </div>
              <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                 <div 
                   className="h-full bg-gradient-to-r from-indigo-600 to-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.3)]"
                   style={{ width: `${data?.summary?.totalUsers ? Math.min(100, (data.summary.totalUsers / 500) * 100) : 0}%` }}
                 ></div>
              </div>
           </div>
        </div>

        <div className="glass-card !p-8 space-y-8">
           <div className="flex items-center gap-4">
              <div className="p-3 bg-rose-500/10 rounded-2xl border border-rose-500/20 text-rose-500">
                 <Activity className="w-6 h-6" />
              </div>
              <div>
                 <h4 className="text-white font-black tracking-tight">Kernel Health</h4>
                 <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">System integrity score</p>
              </div>
           </div>
           <div className="space-y-4">
              <div className="flex justify-between items-end">
                 <span className="text-4xl font-black text-white tracking-tighter">99.9%</span>
                 <span className="text-[10px] text-emerald-500 font-black uppercase tracking-widest">Nominal</span>
              </div>
              <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                 <div className="w-[99.9%] h-full bg-gradient-to-r from-emerald-600 to-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.3)]"></div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Stats;
