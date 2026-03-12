import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Users, 
  Receipt, 
  UsersRound, 
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  RefreshCw,
  Zap,
  ShieldAlert,
  Crown,
  History,
  Info,
  MousePointer2,
  Eye,
  Target,
  BarChart3,
  Globe
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell, LineChart, Line
} from 'recharts';

const StatCard = ({ title, value, icon: Icon, trend, trendValue, color, delay, subtitle, goal }) => {
  const numericValue = typeof value === 'string' ? parseFloat(value.replace(/[^0-9.-]+/g,"")) : value;
  const progressPercent = goal ? Math.min(100, Math.max(0, (numericValue / goal) * 100)) : 0;

  return (
    <div 
      className="glass-card group relative overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-700 fill-mode-backwards" 
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${color} opacity-[0.03] rounded-bl-full group-hover:opacity-[0.08] transition-opacity duration-500`}></div>
      
      <div className="flex justify-between items-start mb-6 relative z-10">
        <div className={`p-4 rounded-[1.5rem] bg-gradient-to-br ${color} shadow-lg group-hover:scale-110 transition-transform duration-500`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        {trend && (
          <div className={`flex items-center gap-1.5 px-3 py-1 transparent-blur rounded-full text-[11px] font-black tracking-tighter shadow-sm ${
            trend === 'up' ? 'text-emerald-400 bg-emerald-500/10' : 'text-rose-400 bg-rose-500/10'
          }`}>
            {trend === 'up' ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
            {trendValue}
          </div>
        )}
      </div>
      
      <div className="relative z-10">
        <h3 className="text-slate-500 text-xs font-black uppercase tracking-[0.2em] mb-2">{title}</h3>
        <div className="flex items-baseline gap-2 mb-1">
          <p className="stat-value">{value}</p>
          {goal && <span className="text-sm text-slate-500 font-bold uppercase tracking-widest">/ {goal}</span>}
        </div>
        <div className="flex justify-between items-center">
          {subtitle && <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{subtitle}</span>}
          {goal && <span className="text-[10px] text-indigo-400 font-black uppercase tracking-widest">Goal</span>}
        </div>
        {goal && (
          <div className="w-full bg-white/5 rounded-full h-1.5 mt-3 overflow-hidden">
            <div className={`h-1.5 rounded-full bg-gradient-to-r ${color}`} style={{ width: `${progressPercent}%` }}></div>
          </div>
        )}
      </div>
    </div>
  );
};

const MetricRow = ({ icon: Icon, label, value, color }) => (
  <div className="flex items-center justify-between p-4 bg-white/[0.02] border border-white/5 rounded-2xl group hover:bg-white/[0.04] transition-all">
    <div className="flex items-center gap-4">
      <div className={`p-2.5 rounded-xl bg-${color}-500/10 text-${color}-400 border border-${color}-500/10`}>
        <Icon className="w-4 h-4" />
      </div>
      <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{label}</span>
    </div>
    <span className="text-white font-black">{value}</span>
  </div>
);

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
  const userRole = currentUser.adminRole || 'read_only';
  const isRoot = userRole === 'root';

  const fetchData = async () => {
    try {
      const response = await axios.get('/api/admin/stats', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      setData(response.data);
      setLastUpdated(new Date());
    } catch (err) {
      console.error("Error fetching stats:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000); // Poll every 30s
    return () => clearInterval(interval);
  }, []);

  const getRoleLabel = (role) => {
    const roles = {
      root: 'Root Administrator',
      super_admin: 'Super Admin',
      admin: 'Personnel Admin',
      moderator: 'Reporting Officer',
      read_only: 'Guest Observer'
    };
    return roles[role] || role;
  };

  const getActivityIcon = (category) => {
    switch (category) {
      case 'user': return Users;
      case 'security': return ShieldAlert;
      case 'system': return Zap;
      case 'expense': return Receipt;
      case 'group': return UsersRound;
      default: return Activity;
    }
  };

  const formatTime = (dateStr) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    return date.toLocaleDateString();
  };

  if (loading && !data) return (
    <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-indigo-500/20 rounded-full"></div>
        <div className="absolute top-0 left-0 w-16 h-16 border-4 border-indigo-500 rounded-full border-t-transparent animate-spin"></div>
      </div>
      <p className="text-indigo-400 font-black uppercase tracking-[0.3em] text-xs">Awaiting Neural Link...</p>
    </div>
  );

  const ad = data?.summary.adPerformance || {};

  return (
    <div className="space-y-10 pb-20 max-w-[1600px] mx-auto">
      {/* Hero Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 animate-in fade-in slide-in-from-left-4 duration-1000">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className={`flex items-center gap-2 px-3 py-1 rounded-full border ${isRoot ? 'bg-amber-500/10 border-amber-500/20 text-amber-500' : 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400'}`}>
               {isRoot ? <Crown className="w-3 h-3" /> : <ShieldAlert className="w-3 h-3" />}
               <span className="text-[10px] font-black uppercase tracking-[0.2em]">{getRoleLabel(userRole)}</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/5 rounded-full">
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping"></div>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">REAL-TIME TELEMETRY</span>
            </div>
          </div>
          <h1 className="text-5xl font-black text-white tracking-tighter">Command <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-violet-500">Center</span></h1>
          <p className="text-slate-500 mt-2 font-medium">Deep analysis of {data?.summary.totalUsers} registered identities and global traffic.</p>
        </div>
        
        <div className="flex items-center gap-3 mt-4 md:mt-0">

          <button 
            onClick={() => { setLoading(true); fetchData(); }}
            className="p-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl group transition-all"
          >
            <RefreshCw className={`w-5 h-5 text-slate-400 group-hover:text-white transition-all ${loading && 'animate-spin'}`} />
          </button>
        </div>
      </div>

      {/* Main KPls */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Daily Active Users" 
          value={(data?.summary?.dau || 0).toLocaleString()} 
          icon={Users} 
          trend="up" 
          trendValue="14.2%" 
          color="from-indigo-600 to-indigo-800"
          subtitle={`of ${data?.summary?.mau || 0} Monthly`}
          delay={0}
          goal={100}
        />
        <StatCard 
          title="Net Ad Revenue" 
          value={`$${(data?.summary?.adRevenue || 0).toLocaleString()}`} 
          icon={TrendingUp} 
          trend="up" 
          trendValue="8.1%" 
          color="from-emerald-600 to-emerald-800"
          subtitle={`eCPM: $${ad.ecpm || 0}`}
          delay={100}
          goal={50}
        />
        <StatCard 
          title="Global Visits" 
          value={(data?.summary?.totalVisits || 0).toLocaleString()} 
          icon={Activity} 
          trend="up" 
          trendValue="22%" 
          color="from-violet-600 to-violet-800"
          subtitle="Total Sessions"
          delay={200}
          goal={1000}
        />
        <StatCard 
          title="Inbound Volume" 
          value={`+${data?.summary?.newUsersLast7Days || 0}`} 
          icon={History} 
          trend="up" 
          trendValue="24%" 
          color="from-blue-600 to-blue-800"
          subtitle="New Registrations"
          delay={300}
          goal={50}
        />
      </div>

      {/* Secondary Intelligence Grids */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Ad Performance Intelligence */}
        <div className="glass-card !p-8">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h2 className="text-xl font-black text-white tracking-tight">Ad Logistics</h2>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Granular yield analysis and delivery</p>
            </div>
            <BarChart3 className="w-6 h-6 text-indigo-500/50" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <MetricRow icon={Eye} label="Impressions" value={ad.impressions} color="indigo" />
            <MetricRow icon={Zap} label="Requests" value={ad.requests} color="amber" />
            <MetricRow icon={MousePointer2} label="Clicks" value={ad.clicks} color="emerald" />
            <MetricRow icon={Target} label="CTR (Click Rate)" value={`${ad.ctr}%`} color="rose" />
            <MetricRow icon={RefreshCw} label="Fill Rate" value={`${ad.fillRate}%`} color="blue" />
            <MetricRow icon={TrendingUp} label="eCPM" value={`$${ad.ecpm}`} color="violet" />
          </div>
        </div>

        {/* AI Performance Intelligence */}
        <div className="glass-card !p-8">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h2 className="text-xl font-black text-white tracking-tight">AI Intelligence</h2>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Neural token consumption and load</p>
            </div>
            <Zap className="w-6 h-6 text-indigo-400/50" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <MetricRow icon={Activity} label="Total Requests" value={data?.summary?.aiPerformance?.totalRequests || 0} color="indigo" />
            <MetricRow icon={TrendingUp} label="Total Tokens" value={(data?.summary?.aiPerformance?.totalTokens || 0).toLocaleString()} color="emerald" />
            <MetricRow icon={ArrowUpRight} label="Input (Prompt)" value={(data?.summary?.aiPerformance?.inputTokens || 0).toLocaleString()} color="blue" />
            <MetricRow icon={ArrowDownRight} label="Output (Resp)" value={(data?.summary?.aiPerformance?.outputTokens || 0).toLocaleString()} color="violet" />
            <MetricRow icon={ShieldAlert} label="Quota Status" value="Healthy" color="emerald" />
            <MetricRow icon={Target} label="Est. Cost" value={`$${((data?.summary?.aiPerformance?.totalTokens || 0) * 0.0000001).toFixed(4)}`} color="amber" />
          </div>
        </div>

        {/* Audience Distribution */}
        <div className="glass-card !p-8">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h2 className="text-xl font-black text-white tracking-tight">Audience Intelligence</h2>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">User engagement and retention matrix</p>
            </div>
            <Globe className="w-6 h-6 text-emerald-500/50" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <MetricRow icon={Users} label="Reg. Users" value={data?.summary?.totalUsers || 0} color="indigo" />
            <MetricRow icon={Activity} label="Active Today" value={data?.summary?.dau || 0} color="emerald" />
            <MetricRow icon={History} label="Weekly Growth" value={data?.summary?.newUsersLast7Days || 0} color="blue" />
            <MetricRow icon={Target} label="Retention" value="84.2%" color="violet" />
            <MetricRow icon={Zap} label="API Status" value="Healthy" color="emerald" />
            <MetricRow icon={Globe} label="Top Region" value="N. America" color="amber" />
          </div>
        </div>
      </div>

      {/* Main Charts Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 glass-card !p-8 animate-in fade-in slide-in-from-left-8 duration-1000">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h2 className="text-xl font-black text-white tracking-tight">Expansion Curve</h2>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">New identity propagation (7 days)</p>
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data?.charts.userGrowth}>
                <defs>
                  <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="10 10" vertical={false} stroke="#ffffff05" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 10, fontWeight: 900}} dy={15} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 10, fontWeight: 900}} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.1)' }}
                  itemStyle={{ color: '#fff', fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="count" stroke="#6366f1" strokeWidth={4} fillOpacity={1} fill="url(#colorCount)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card !p-8 animate-in fade-in slide-in-from-right-8 duration-1000">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h2 className="text-xl font-black text-white tracking-tight">Load Intensity</h2>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Session density by day</p>
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data?.charts.expenseVolume}>
                <CartesianGrid strokeDasharray="10 10" vertical={false} stroke="#ffffff05" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 10, fontWeight: 900}} dy={15} />
                <Tooltip cursor={{fill: 'rgba(255,255,255,0.03)'}} contentStyle={{ backgroundColor: '#0f172a', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.1)' }} />
                <Bar dataKey="amount" radius={[12, 12, 12, 12]} barSize={24}>
                  {data?.charts.expenseVolume.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === data.charts.expenseVolume.length - 1 ? '#6366f1' : 'rgba(99, 102, 241, 0.2)'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Activity Log */}
      <div className="glass-card !p-0 overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-1000">
        <div className="p-8 border-b border-white/5 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-black text-white tracking-tight">Neural Activity Log</h2>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Latest operations recorded by kernel</p>
          </div>
          {userRole !== 'read_only' && <button className="text-xs text-indigo-400 font-black uppercase tracking-widest hover:text-indigo-300 transition-colors">Access Sector Files</button>}
        </div>
        <div className="divide-y divide-white/5 min-h-[200px]">
          {data?.recentActivities && data.recentActivities.length > 0 ? (
            data.recentActivities.map((log) => {
              const Icon = getActivityIcon(log.category);
              return (
                <div key={log._id} className="px-8 py-5 flex items-center justify-between hover:bg-white/[0.03] transition-all duration-300 group">
                  <div className="flex items-center gap-6">
                    <div className={`p-3 rounded-2xl ${
                      log.status === 'success' ? 'bg-emerald-500/10 text-emerald-400' : 
                      log.status === 'warning' ? 'bg-rose-500/10 text-rose-400' : 
                      log.status === 'error' ? 'bg-rose-600/10 text-rose-500' : 'bg-blue-500/10 text-blue-400'
                    }`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-400 font-medium">
                        <span className="text-white font-black">{log.user?.username || 'System'}</span> 
                        <span className="mx-2 text-slate-600">—</span>
                        {log.action}
                      </p>
                      <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mt-1">{formatTime(log.createdAt)}</p>
                    </div>
                  </div>
                  {userRole !== 'read_only' && (
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                       <button className="px-4 py-1.5 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black text-white uppercase tracking-widest hover:bg-white/10 transition-colors">Inspect</button>
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="flex flex-col items-center justify-center p-12 text-slate-600 gap-3">
              <History className="w-12 h-12 opacity-20" />
              <p className="text-[10px] font-black uppercase tracking-[0.2em]">Awaiting Kernel Pulse...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
