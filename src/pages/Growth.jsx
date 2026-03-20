import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  DollarSign, Users, Activity, Eye, ShieldCheck, PieChart, Info
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

const StatCard = ({ title, value, icon: Icon, iconColor, iconBg, subtitle }) => (
  <div className="bg-[#1e232b] border border-[#2d323b] rounded-2xl p-6 shadow-sm">
    <div className="flex justify-between items-start mb-4">
      <div>
        <h3 className="text-slate-400 font-medium text-sm mb-2">{title}</h3>
        <p className="text-2xl font-bold text-white mb-1">{value}</p>
        {subtitle && <span className="text-slate-500 text-sm">{subtitle}</span>}
      </div>
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${iconBg} ${iconColor}`}>
        <Icon className="w-6 h-6" />
      </div>
    </div>
  </div>
);

const ProgressBar = ({ label, value, max, colorClass, suffix = '' }) => (
  <div className="mb-3 last:mb-0">
    <div className="flex justify-between text-sm mb-1.5">
      <span className="font-medium text-slate-400">{label}</span>
      <span className="font-semibold text-white">{value}{suffix}</span>
    </div>
    <div className="w-full h-1.5 bg-[#2d323b] rounded-full overflow-hidden">
      <div className={`h-full ${colorClass}`} style={{ width: `${(value/max)*100}%` }}></div>
    </div>
  </div>
);

const Growth = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

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

  if (loading && !data) return (
    <div className="flex items-center justify-center h-[60vh]">
      <div className="w-8 h-8 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
    </div>
  );

  const ad = data?.summary?.adPerformance || {};
  const sum = data?.summary || {};

  return (
    <div className="space-y-6 pb-20 max-w-[1600px] mx-auto animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">Growth & Revenue</h1>
          <p className="text-slate-400 text-sm">Monetization tracking and acquisition funnel.</p>
        </div>
      </div>

      <div className="space-y-4">
         <h2 className="text-lg font-semibold text-white flex items-center gap-2"><DollarSign className="w-5 h-5 text-emerald-500"/> Ad Performance Overview</h2>
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
           <StatCard 
             title="Total Net Yield" 
             value={`$${(sum.adRevenue || 0).toLocaleString()}`} 
             icon={DollarSign} 
             iconColor="text-emerald-500" 
             iconBg="bg-emerald-500/10"
             subtitle={`eCPM: $${ad.ecpm || '0.00'}`} 
           />
           <StatCard 
             title="Impressions" 
             value={(ad.impressions || 0).toLocaleString()} 
             icon={Eye} 
             iconColor="text-blue-500" 
             iconBg="bg-blue-500/10"
             subtitle={`${ad.fillRate || 0}% Fill Rate`} 
           />
           <StatCard 
             title="Ad Clicks" 
             value={(ad.clicks || 0).toLocaleString()} 
             icon={Activity} 
             iconColor="text-indigo-500" 
             iconBg="bg-indigo-500/10"
             subtitle={`${ad.ctr || 0}% CTR`} 
           />
           <StatCard 
             title="Ad Requests" 
             value={(ad.requests || 0).toLocaleString()} 
             icon={PieChart} 
             iconColor="text-purple-500" 
             iconBg="bg-purple-500/10"
             subtitle="Total requests dispatched" 
           />
         </div>
      </div>

      <div className="space-y-4 mt-8">
         <h2 className="text-lg font-semibold text-white flex items-center gap-2"><Users className="w-5 h-5 text-indigo-500"/> User Insights</h2>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <div className="bg-[#1e232b] border border-[#2d323b] rounded-2xl p-6 shadow-sm">
             <div className="flex items-center gap-3 mb-6">
                <ShieldCheck className="w-5 h-5 text-emerald-500" />
                <h3 className="text-lg font-semibold text-white">Verification Funnel</h3>
             </div>
             <div>
                <ProgressBar label="Registered Users" value={sum.totalUsers || 0} max={sum.totalUsers || 1} colorClass="bg-indigo-500" />
                <ProgressBar label="KYC Verified" value={sum.verifiedUsers || 0} max={sum.totalUsers || 1} colorClass="bg-emerald-500" />
                <ProgressBar label="Transacting Users" value={sum.usersWithTransactions || 0} max={sum.totalUsers || 1} colorClass="bg-amber-500" />
             </div>
           </div>

           <div className="bg-[#1e232b] border border-[#2d323b] rounded-2xl p-6 shadow-sm">
             <div className="flex items-center gap-3 mb-6">
                <Activity className="w-5 h-5 text-indigo-500" />
                <h3 className="text-lg font-semibold text-white">Retention (DAU/MAU)</h3>
             </div>
             <div className="flex items-end gap-6 mb-6">
                <div>
                   <p className="text-sm font-medium text-slate-400 mb-1">DAU (Today)</p>
                   <p className="text-2xl font-bold text-white">{sum.dau || 0}</p>
                </div>
                <div>
                   <p className="text-sm font-medium text-slate-400 mb-1">MAU (30d)</p>
                   <p className="text-2xl font-bold text-white">{sum.mau || 0}</p>
                </div>
                <div className="ml-auto text-right">
                   <p className="text-sm font-medium text-slate-400 mb-1">Stickiness</p>
                   <p className="text-2xl font-bold text-emerald-400">{sum.mau ? Math.round(((sum.dau || 0) / sum.mau) * 100) : 0}%</p>
                </div>
             </div>
             <div className="w-full h-2 bg-[#2d323b] rounded-full overflow-hidden">
                <div className="h-full bg-indigo-500" style={{ width: `${sum.mau ? Math.round(((sum.dau || 0) / sum.mau) * 100) : 0}%` }}></div>
             </div>
           </div>
         </div>
      </div>

    </div>
  );
};

export default Growth;
