import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { 
  Users, 
  MapPin,
  TrendingUp,
  Activity,
  DollarSign,
  MonitorSmartphone,
  ShieldCheck,
  MoreVertical,
  ArrowUp,
  ArrowDown,
  RefreshCw,
  Download,
  Maximize2,
  X
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer
} from 'recharts';

const StatCard = ({ title, value, icon: Icon, iconColor, iconBg, trendText, trendValue, isPositive }) => (
  <div className="bg-surface-card border border-surface-border rounded-2xl p-6 shadow-sm hover:border-[#3d424b] transition-colors">
    <div className="flex justify-between items-start">
      <div>
        <h3 className="text-color-secondary font-medium text-sm mb-2">{title}</h3>
        <p className="text-2xl font-bold text-color mb-4">{value}</p>
        {(trendValue !== undefined || trendText) && (
          <div className="flex items-center gap-2">
            {trendValue !== undefined && (
              <span className={`font-medium text-sm flex items-center gap-1 ${isPositive ? 'text-emerald-500' : 'text-rose-500'}`}>
                {isPositive ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
                {trendValue}
              </span>
            )}
            {trendText && <span className="text-slate-500 text-sm">{trendText}</span>}
          </div>
        )}
      </div>
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${iconBg} ${iconColor}`}>
        <Icon className="w-6 h-6" />
      </div>
    </div>
  </div>
);

const CardMenu = ({ onRefresh, onExport, onExpand }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="text-color-secondary hover:text-color transition-colors p-1 rounded-md hover:bg-surface-hover"
      >
        <MoreVertical className="w-5 h-5" />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-1 w-48 bg-surface-card border border-surface-border rounded-xl shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in duration-150">
          <div className="p-1">
            <button 
              onClick={() => { onRefresh(); setIsOpen(false); }}
              className="w-full text-left px-3 py-2 text-sm text-color-secondary hover:text-color hover:bg-surface-hover rounded-lg flex items-center gap-2 transition-colors"
            >
              <RefreshCw className="w-4 h-4" /> Refresh Data
            </button>
            <button 
              onClick={() => { onExport(); setIsOpen(false); }}
              className="w-full text-left px-3 py-2 text-sm text-color-secondary hover:text-color hover:bg-surface-hover rounded-lg flex items-center gap-2 transition-colors"
            >
              <Download className="w-4 h-4" /> Export CSV
            </button>
            <div className="h-px bg-surface-border my-1"></div>
            <button 
              onClick={() => { onExpand(); setIsOpen(false); }}
              className="w-full text-left px-3 py-2 text-sm text-[var(--primary-color)] hover:bg-[var(--primary-color)]/10 rounded-lg flex items-center gap-2 transition-colors"
            >
              <Maximize2 className="w-4 h-4" /> Expand View
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [fullscreenCard, setFullscreenCard] = useState(null);

  const fetchData = async (isManualRefresh = false) => {
    if (isManualRefresh) setIsRefreshing(true);
    try {
      const response = await axios.get('/api/admin/stats', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      setData(response.data);
    } catch (err) {
      console.error("Error fetching stats:", err);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  const exportCSV = (filename, rows) => {
    if (!rows || !rows.length) return;
    const keys = Object.keys(rows[0]);
    const csvContent = "data:text/csv;charset=utf-8," 
      + keys.join(",") + "\n"
      + rows.map(r => keys.map(k => r[k]).join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${filename}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading && !data) return (
    <div className="flex items-center justify-center h-[60vh]">
      <div className="w-8 h-8 border-4 border-[var(--primary-color)] rounded-full border-t-transparent animate-spin"></div>
    </div>
  );

  const summary = data?.summary || {};
  const charts = data?.charts || {};
  const recentActivities = data?.recentActivities || [];

  const todayNewUsers = charts?.userGrowth?.[6]?.count || 0;
  const yesterdayNewUsers = charts?.userGrowth?.[5]?.count || 0;
  const userDiff = todayNewUsers - yesterdayNewUsers;
  const userIsPositive = userDiff >= 0;

  const renderGrowthChart = () => (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={charts.userGrowth}>
        <defs>
          <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--primary-color)" stopOpacity={0.4}/>
            <stop offset="95%" stopColor="var(--primary-color)" stopOpacity={0}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-surface)" />
        <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: 'var(--text-secondary)', fontSize: 12}} dy={10} />
        <YAxis axisLine={false} tickLine={false} tick={{fill: 'var(--text-secondary)', fontSize: 12}} dx={-10} />
        <RechartsTooltip 
          contentStyle={{ backgroundColor: 'var(--bg-surface-card)', borderColor: 'var(--border-surface)', borderRadius: '8px', color: 'var(--text-primary)' }}
          itemStyle={{ color: 'var(--text-primary)' }}
        />
        <Area type="monotone" dataKey="count" stroke="var(--primary-color)" strokeWidth={3} fillOpacity={1} fill="url(#colorCount)" />
      </AreaChart>
    </ResponsiveContainer>
  );

  const renderSystemHealth = () => (
    <div className="space-y-4 h-full flex flex-col justify-center">
      <div className="flex items-center justify-between p-3 rounded-xl bg-surface-section border border-surface-border">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500"><MonitorSmartphone className="w-4 h-4" /></div>
          <span className="text-sm font-medium text-color-secondary">Active Sessions</span>
        </div>
        <span className="text-sm font-bold text-color">{summary.activeSessions || 0}</span>
      </div>
      <div className="flex items-center justify-between p-3 rounded-xl bg-surface-section border border-surface-border">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-indigo-500/10 text-[var(--primary-color)]"><ShieldCheck className="w-4 h-4" /></div>
          <span className="text-sm font-medium text-color-secondary">Verified Users</span>
        </div>
        <span className="text-sm font-bold text-color">{summary.verifiedUsers || 0}</span>
      </div>
      <div className="flex items-center justify-between p-3 rounded-xl bg-surface-section border border-surface-border">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-rose-500/10 text-rose-500"><Activity className="w-4 h-4" /></div>
          <span className="text-sm font-medium text-color-secondary">Fraud Rate</span>
        </div>
        <span className="text-sm font-bold text-color">{summary.fraudRate || 0}%</span>
      </div>
      <div className="flex items-center justify-between p-3 rounded-xl bg-surface-section border border-surface-border">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-amber-500/10 text-amber-500"><MapPin className="w-4 h-4" /></div>
          <span className="text-sm font-medium text-color-secondary">Total Groups</span>
        </div>
        <span className="text-sm font-bold text-color">{summary.totalGroups || 0}</span>
      </div>
    </div>
  );

  return (
    <div className="space-y-6 pb-20 max-w-[1600px] mx-auto animate-in fade-in duration-500">
      
      {/* FULLSCREEN MODAL */}
      {fullscreenCard && (
        <div className="fixed inset-0 z-[110] bg-surface-body flex flex-col animate-in fade-in zoom-in-95 duration-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-color">{fullscreenCard === 'growth' ? 'Identity Growth Curve' : 'System Health'} - Fullscreen</h2>
            <button 
              onClick={() => setFullscreenCard(null)}
              className="p-3 bg-surface-card border border-surface-border rounded-xl text-color-secondary hover:text-color hover:bg-surface-hover transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          <div className="flex-1 bg-surface-card border border-surface-border rounded-2xl p-8 shadow-2xl flex items-center justify-center">
            {fullscreenCard === 'growth' ? (
              <div className="w-full h-full max-h-[800px]">
                {renderGrowthChart()}
              </div>
            ) : (
              <div className="w-full max-w-2xl">
                {renderSystemHealth()}
              </div>
            )}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <StatCard 
          title="Total Users" 
          value={(summary.totalUsers || 0).toLocaleString()} 
          icon={Users} 
          iconColor="text-blue-500"
          iconBg="bg-blue-500/10"
          trendValue={Math.abs(userDiff)}
          isPositive={userIsPositive}
          trendText="new since yesterday"
        />
        <StatCard 
          title="Daily Active Users" 
          value={(summary.dau || 0).toLocaleString()} 
          icon={Activity} 
          iconColor="text-emerald-500"
          iconBg="bg-emerald-500/10"
          trendText={`out of ${(summary.mau || 0).toLocaleString()} MAU`}
        />
        <StatCard 
          title="Ad Revenue" 
          value={`$${summary.adRevenue || '0.00'}`} 
          icon={DollarSign} 
          iconColor="text-amber-500"
          iconBg="bg-amber-500/10"
          trendText={`eCPM: $${summary.adPerformance?.ecpm || '0.00'}`}
        />
        <StatCard 
          title="New Users (7d)" 
          value={`+${summary.newUsersLast7Days || 0}`} 
          icon={TrendingUp} 
          iconColor="text-violet-500"
          iconBg="bg-violet-500/10"
          trendText="Total visits: "
          trendValue={(summary.totalVisits || 0).toLocaleString()}
          isPositive={true}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Growth Curve Card */}
        <div className={`lg:col-span-2 bg-surface-card border border-surface-border rounded-2xl p-6 shadow-sm relative ${isRefreshing ? 'opacity-50 pointer-events-none' : ''} transition-opacity`}>
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-semibold text-color">Identity Growth Curve</h2>
              {isRefreshing && <RefreshCw className="w-4 h-4 text-color-secondary animate-spin" />}
            </div>
            <CardMenu 
              onRefresh={() => fetchData(true)}
              onExport={() => exportCSV('Identity_Growth_Curve', charts.userGrowth || [])}
              onExpand={() => setFullscreenCard('growth')}
            />
          </div>
          <div className="h-[300px] w-full">
            {renderGrowthChart()}
          </div>
        </div>

        {/* System Health Card */}
        <div className={`bg-surface-card border border-surface-border rounded-2xl p-6 shadow-sm overflow-hidden flex flex-col relative ${isRefreshing ? 'opacity-50 pointer-events-none' : ''} transition-opacity`}>
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-semibold text-color">System Health</h2>
              {isRefreshing && <RefreshCw className="w-4 h-4 text-color-secondary animate-spin" />}
            </div>
            <CardMenu 
              onRefresh={() => fetchData(true)}
              onExport={() => exportCSV('System_Health', [
                { Metric: 'Active Sessions', Value: summary.activeSessions || 0 },
                { Metric: 'Verified Users', Value: summary.verifiedUsers || 0 },
                { Metric: 'Fraud Rate', Value: `${summary.fraudRate || 0}%` },
                { Metric: 'Total Groups', Value: summary.totalGroups || 0 }
              ])}
              onExpand={() => setFullscreenCard('health')}
            />
          </div>
          <div className="flex-1">
            {renderSystemHealth()}
          </div>
        </div>
      </div>

      <div className="bg-surface-card border border-surface-border rounded-2xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-surface-border flex justify-between items-center">
          <h2 className="text-lg font-semibold text-color">Recent Activities</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-section border-b border-surface-border text-sm text-color-secondary uppercase tracking-wider">
                <th className="p-4 font-medium rounded-tl-xl">User</th>
                <th className="p-4 font-medium">Action</th>
                <th className="p-4 font-medium">Category</th>
                <th className="p-4 font-medium rounded-tr-xl">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentActivities.length > 0 ? (
                recentActivities.map((log) => (
                  <tr key={log._id} className="border-b border-surface-border hover:bg-surface-section transition-colors group">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold text-color">
                          {(log.user?.username || 'S')[0].toUpperCase()}
                        </div>
                        <span className="font-medium text-color">{log.user?.username || 'System'}</span>
                      </div>
                    </td>
                    <td className="p-4 text-color-secondary text-sm whitespace-nowrap">{log.action}</td>
                    <td className="p-4">
                      <span className="capitalize text-sm text-color-secondary">{log.category}</span>
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 text-xs font-semibold rounded-md flex items-center gap-1.5 w-max ${
                        log.status === 'success' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 
                        log.status === 'warning' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' : 
                        log.status === 'error' ? 'bg-rose-500/10 text-rose-500 border border-rose-500/20' : 
                        'bg-blue-500/10 text-blue-500 border border-blue-500/20'
                      }`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${
                          log.status === 'success' ? 'bg-emerald-500' : 
                          log.status === 'warning' ? 'bg-amber-500' : 
                          log.status === 'error' ? 'bg-rose-500' : 
                          'bg-blue-500'
                        }`}></div>
                        {log.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="p-8 text-center text-slate-500 text-sm">No recent activities found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

