import React, { useState, useEffect } from 'react';
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
  ArrowDown
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

const StatCard = ({ title, value, icon: Icon, iconColor, iconBg, trendText, trendValue, isPositive }) => (
  <div className="bg-[#1e232b] border border-[#2d323b] rounded-2xl p-6 shadow-sm hover:border-[#3d424b] transition-colors">
    <div className="flex justify-between items-start">
      <div>
        <h3 className="text-slate-400 font-medium text-sm mb-2">{title}</h3>
        <p className="text-2xl font-bold text-white mb-4">{value}</p>
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

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');

  const fetchData = async () => {
    try {
      const response = await axios.get('/api/admin/stats', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      setData(response.data);
    } catch (err) {
      console.error("Error fetching stats:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading && !data) return (
    <div className="flex items-center justify-center h-[60vh]">
      <div className="w-8 h-8 border-4 border-indigo-500 rounded-full border-t-transparent animate-spin"></div>
    </div>
  );

  const summary = data?.summary || {};
  const charts = data?.charts || {};
  const recentActivities = data?.recentActivities || [];

  // Calculate dynamic trends if possible
  const todayNewUsers = charts?.userGrowth?.[6]?.count || 0;
  const yesterdayNewUsers = charts?.userGrowth?.[5]?.count || 0;
  const userDiff = todayNewUsers - yesterdayNewUsers;
  const userIsPositive = userDiff >= 0;

  return (
    <div className="space-y-6 pb-20 max-w-[1600px] mx-auto animate-in fade-in duration-500">
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
        <div className="lg:col-span-2 bg-[#1e232b] border border-[#2d323b] rounded-2xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-white">Identity Growth Curve</h2>
            <button className="text-slate-400 hover:text-white transition-colors">
              <MoreVertical className="w-5 h-5" />
            </button>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={charts.userGrowth}>
                <defs>
                  <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#2d323b" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dx={-10} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e232b', borderColor: '#2d323b', borderRadius: '8px', color: '#fff' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Area type="monotone" dataKey="count" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorCount)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-[#1e232b] border border-[#2d323b] rounded-2xl p-6 shadow-sm overflow-hidden flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-white">System Health</h2>
            <button className="text-slate-400 hover:text-white transition-colors">
              <MoreVertical className="w-5 h-5" />
            </button>
          </div>
          <div className="flex-1 space-y-4">
            <div className="flex items-center justify-between p-3 rounded-xl bg-[#171a21] border border-[#2d323b]">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500"><MonitorSmartphone className="w-4 h-4" /></div>
                <span className="text-sm font-medium text-slate-300">Active Sessions</span>
              </div>
              <span className="text-sm font-bold text-white">{summary.activeSessions || 0}</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-[#171a21] border border-[#2d323b]">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-500"><ShieldCheck className="w-4 h-4" /></div>
                <span className="text-sm font-medium text-slate-300">Verified Users</span>
              </div>
              <span className="text-sm font-bold text-white">{summary.verifiedUsers || 0}</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-[#171a21] border border-[#2d323b]">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-rose-500/10 text-rose-500"><Activity className="w-4 h-4" /></div>
                <span className="text-sm font-medium text-slate-300">Fraud Rate</span>
              </div>
              <span className="text-sm font-bold text-white">{summary.fraudRate || 0}%</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-[#171a21] border border-[#2d323b]">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-amber-500/10 text-amber-500"><MapPin className="w-4 h-4" /></div>
                <span className="text-sm font-medium text-slate-300">Total Groups</span>
              </div>
              <span className="text-sm font-bold text-white">{summary.totalGroups || 0}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#1e232b] border border-[#2d323b] rounded-2xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-[#2d323b] flex justify-between items-center">
          <h2 className="text-lg font-semibold text-white">Recent Activities</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#171a21] border-b border-[#2d323b] text-sm text-slate-400 uppercase tracking-wider">
                <th className="p-4 font-medium rounded-tl-xl">User</th>
                <th className="p-4 font-medium">Action</th>
                <th className="p-4 font-medium">Category</th>
                <th className="p-4 font-medium rounded-tr-xl">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentActivities.length > 0 ? (
                recentActivities.map((log) => (
                  <tr key={log._id} className="border-b border-[#2d323b] hover:bg-[#171a21] transition-colors group">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold text-white">
                          {(log.user?.username || 'S')[0].toUpperCase()}
                        </div>
                        <span className="font-medium text-white">{log.user?.username || 'System'}</span>
                      </div>
                    </td>
                    <td className="p-4 text-slate-300 text-sm whitespace-nowrap">{log.action}</td>
                    <td className="p-4">
                      <span className="capitalize text-sm text-slate-400">{log.category}</span>
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

