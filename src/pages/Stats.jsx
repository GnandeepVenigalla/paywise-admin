import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area
} from 'recharts';
import { Download, Users, Zap, ShieldCheck, Activity, CreditCard, Group, Info } from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, iconColor, iconBg, subtitle }) => (
  <div className="bg-[#1e232b] border border-[#2d323b] rounded-2xl p-6 shadow-sm">
    <div className="flex justify-between items-start mb-4">
      <div>
        <h3 className="text-slate-400 font-medium text-sm mb-2">{title}</h3>
        <p className="text-2xl font-bold text-white mb-1">{value}</p>
        {subtitle && <span className="text-slate-500 text-sm">{subtitle}</span>}
      </div>
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${iconBg} ${iconColor}`}>
        {Icon && <Icon className="w-6 h-6" />}
      </div>
    </div>
  </div>
);

const Stats = () => {
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
  const userRole = currentUser.adminRole || 'read_only';
  const canDownload = ['root'].includes(userRole);

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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

    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleDownload = () => {
    if (!canDownload) return;
    alert("Synthesizing analysis report... Your encrypted JSON download will begin momentarily.");
  };

  if (loading && !data) return (
    <div className="flex items-center justify-center h-[60vh]">
      <div className="w-8 h-8 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
    </div>
  );

  const { summary, charts, recentActivities, topUsers } = data || {};

  return (
    <div className="space-y-6 pb-20 max-w-[1600px] mx-auto animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">Analytics Data</h1>
          <p className="text-slate-400 text-sm">Real-time metrics and system tracking.</p>
        </div>
        
        <div className="flex gap-3">
          {canDownload ? (
            <button 
              onClick={handleDownload}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors"
            >
              <Download className="w-4 h-4" />
              Export Data
            </button>
          ) : (
            <button 
              disabled
              className="flex items-center gap-2 px-4 py-2 bg-slate-800 border-[#2d323b] text-slate-500 rounded-lg text-sm font-medium opacity-50 cursor-not-allowed"
            >
              <Download className="w-4 h-4" />
              Export Data
            </button>
          )}
        </div>
      </div>

      {userRole === 'read_only' && (
         <div className="bg-indigo-600/10 border border-indigo-500/30 px-6 py-4 rounded-xl flex items-center gap-3 text-indigo-400 font-medium">
            <Info className="w-5 h-5" />
            <span className="text-sm">Read Only mode active. Export restricted.</span>
         </div>
      )}

      {/* KPI Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         <StatCard 
           title="Total Nodes" 
           value={summary?.totalUsers || 0} 
           icon={Users} 
           iconColor="text-blue-500"
           iconBg="bg-blue-500/10"
         />
         <StatCard 
           title="Platform Groups" 
           value={summary?.totalGroups || 0} 
           icon={Users} 
           iconColor="text-indigo-500"
           iconBg="bg-indigo-500/10"
         />
         <StatCard 
           title="Total Expenses" 
           value={summary?.totalExpenses || 0} 
           icon={CreditCard} 
           iconColor="text-emerald-500"
           iconBg="bg-emerald-500/10"
         />
         <StatCard 
           title="Verified Identities" 
           value={summary?.verifiedUsers || 0} 
           icon={ShieldCheck} 
           iconColor="text-amber-500"
           iconBg="bg-amber-500/10"
         />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Growth Chart */}
        <div className="bg-[#1e232b] border border-[#2d323b] rounded-2xl shadow-sm p-6">
           <div className="mb-6">
              <h2 className="text-lg font-semibold text-white">Daily Acquisition</h2>
              <p className="text-sm text-slate-400">Node generation over the last 7 days</p>
           </div>
           <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                 <BarChart data={charts?.userGrowth || []} margin={{top: 10, right: 10, left: -20, bottom: 0}}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#2d323b" />
                    <XAxis dataKey="date" stroke="#94a3b8" tick={{fill: '#94a3b8', fontSize: 12}} axisLine={false} tickLine={false} />
                    <YAxis stroke="#94a3b8" tick={{fill: '#94a3b8', fontSize: 12}} axisLine={false} tickLine={false} />
                    <Tooltip cursor={{fill: 'rgba(255,255,255,0.05)'}} contentStyle={{ backgroundColor: '#1e232b', border: '1px solid #2d323b', borderRadius: '8px' }} itemStyle={{ color: '#fff' }} />
                    <Bar dataKey="count" fill="#4f46e5" radius={[4, 4, 0, 0]} barSize={30} />
                 </BarChart>
              </ResponsiveContainer>
           </div>
        </div>

        {/* Expense Volume Chart */}
        <div className="bg-[#1e232b] border border-[#2d323b] rounded-2xl shadow-sm p-6">
           <div className="mb-6">
              <h2 className="text-lg font-semibold text-white">Resource Allocation</h2>
              <p className="text-sm text-slate-400">Expense volume over the last 7 days</p>
           </div>
           <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                 <AreaChart data={charts?.expenseVolume || []} margin={{top: 10, right: 10, left: -20, bottom: 0}}>
                    <defs>
                      <linearGradient id="expGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#2d323b" />
                    <XAxis dataKey="date" stroke="#94a3b8" tick={{fill: '#94a3b8', fontSize: 12}} axisLine={false} tickLine={false} />
                    <YAxis stroke="#94a3b8" tick={{fill: '#94a3b8', fontSize: 12}} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ backgroundColor: '#1e232b', border: '1px solid #2d323b', borderRadius: '8px' }} itemStyle={{ color: '#fff' }} />
                    <Area type="monotone" dataKey="amount" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#expGradient)" />
                 </AreaChart>
              </ResponsiveContainer>
           </div>
        </div>
      </div>
      
      {/* Platform Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#1e232b] border border-[#2d323b] rounded-2xl shadow-sm overflow-hidden">
           <div className="p-6 border-b border-[#2d323b] bg-[#171a21]/50">
              <h2 className="text-lg font-semibold text-white">Top Active Users</h2>
           </div>
           <div className="p-0">
             <table className="w-full text-left">
               <thead className="bg-[#171a21] border-b border-[#2d323b]">
                 <tr>
                   <th className="px-6 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">User</th>
                   <th className="px-6 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider text-right">Last Active</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-[#2d323b] bg-[#1e232b]">
                 {(topUsers || []).slice(0, 5).map(user => (
                   <tr key={user._id} className="hover:bg-[#171a21]/50">
                     <td className="px-6 py-4 text-sm font-medium text-slate-200">{user.username}</td>
                     <td className="px-6 py-4 text-sm text-slate-500 text-right">
                       {new Date(user.lastActive).toLocaleDateString()}
                     </td>
                   </tr>
                 ))}
                 {(!topUsers || topUsers.length === 0) && (
                   <tr>
                     <td colSpan="2" className="px-6 py-8 text-center text-slate-500 text-sm">No activity recorded</td>
                   </tr>
                 )}
               </tbody>
             </table>
           </div>
        </div>
        
        <div className="bg-[#1e232b] border border-[#2d323b] rounded-2xl shadow-sm overflow-hidden">
           <div className="p-6 border-b border-[#2d323b] bg-[#171a21]/50">
              <h2 className="text-lg font-semibold text-white">System Logs</h2>
           </div>
           <div className="p-0">
             <table className="w-full text-left">
               <thead className="bg-[#171a21] border-b border-[#2d323b]">
                 <tr>
                   <th className="px-6 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Action</th>
                   <th className="px-6 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider text-right">Time</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-[#2d323b] bg-[#1e232b]">
                 {(recentActivities || []).slice(0, 5).map(activity => (
                   <tr key={activity._id} className="hover:bg-[#171a21]/50">
                     <td className="px-6 py-4 text-sm font-medium text-slate-200">{activity.description || activity.action || 'System Action'}</td>
                     <td className="px-6 py-4 text-sm text-slate-500 text-right">
                       {new Date(activity.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                     </td>
                   </tr>
                 ))}
                 {(!recentActivities || recentActivities.length === 0) && (
                   <tr>
                     <td colSpan="2" className="px-6 py-8 text-center text-slate-500 text-sm">No recent logs</td>
                   </tr>
                 )}
               </tbody>
             </table>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Stats;
