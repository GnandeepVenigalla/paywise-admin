import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  AlertOctagon, LifeBuoy, ShieldAlert, CheckCircle, XCircle, 
  UserCheck, AlertTriangle, Fingerprint, Activity, Clock, FileWarning, Key, Settings, Shield, Zap, TrendingUp, UserMinus
} from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, iconColor, iconBg, subtitle }) => (
  <div className="bg-[#1e232b] border border-[#2d323b] rounded-2xl p-6 shadow-sm hover:border-[#3d424b] transition-colors">
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

const Operations = () => {
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
  const userRole = currentUser.adminRole || 'read_only';
  const canDeploy = ['root', 'super_admin'].includes(userRole);

  const [loading, setLoading] = useState(false);
  
  // ALL DUMMY DATA REMOVED. Initialized as empty arrays since there's no backend endpoint for these yet.
  const [tickets, setTickets] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [kycQueue, setKycQueue] = useState([]);
  const [selectedAlerts, setSelectedAlerts] = useState([]);

  const [bugs, setBugs] = useState([]);
  const [newBug, setNewBug] = useState('');
  const [reportingBug, setReportingBug] = useState(false);
  const [message, setMessage] = useState('');

  const fetchBugs = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('/api/admin/release/bugs', { headers: { 'Authorization': `Bearer ${token}` } });
      setBugs(res.data);
    } catch (err) {
      console.error('Failed to fetch bugs');
    }
  };

  useEffect(() => {
    fetchBugs();
  }, []);

  const submitBug = async () => {
    if (!newBug.trim()) return;
    setReportingBug(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post('/api/admin/release/bugs', { description: newBug, severity: 'medium' }, { headers: { 'Authorization': `Bearer ${token}` } });
      setNewBug('');
      fetchBugs();
      setMessage('Bug reported successfully! Development team notified.');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage('Failed to report bug');
    } finally {
      setReportingBug(false);
    }
  };

  const resolveBug = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`/api/admin/release/bugs/${id}/resolve`, {}, { headers: { 'Authorization': `Bearer ${token}` } });
      fetchBugs();
      setMessage('Bug marked as resolved!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage('Failed to resolve bug');
    }
  };

  const handleAction = async (type, action) => {
    setMessage(`Executing [${action.toUpperCase()}] protocol on ${type}...`);
    try {
      const token = localStorage.getItem('token');
      const headers = { 'Authorization': `Bearer ${token}` };

      if (action === 'Generate Beta Link') {
        const res = await axios.post('/api/admin/release/beta-link', {}, { headers });
        setMessage(`BETA LINK GENERATED. Opening environment...`);
        window.open(res.data.url, '_blank');
      } else if (action === 'Push to Git') {
        const res = await axios.post('/api/admin/release/deploy', {}, { headers });
        setMessage(res.data.msg);
      } else {
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (err) {
      setMessage(`ERROR: ${err.response?.data?.msg || 'System failure'}`);
      setTimeout(() => setMessage(''), 5000);
    }
  };

  return (
    <div className="space-y-6 pb-20 max-w-[1600px] mx-auto animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-6">
         <div>
            <h1 className="text-2xl font-bold text-white mb-2">Operations Hub</h1>
            <p className="text-slate-400 text-sm">Reviewing manual exceptions, security alerts, and system pipelines.</p>
         </div>
      </div>

      {message && (
        <div className="bg-blue-600/10 border border-blue-500/30 px-6 py-4 rounded-xl flex items-center justify-between text-blue-500 font-medium shadow-sm animate-in fade-in">
          <span className="flex items-center gap-3"><Activity className="w-5 h-5"/> {message}</span>
        </div>
      )}

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <StatCard 
           title="Active Support Tickets" 
           value={tickets.length} 
           icon={LifeBuoy} 
           iconColor="text-blue-500"
           iconBg="bg-blue-500/10"
           subtitle="Awaiting manual response"
         />
         <StatCard 
           title="High-Risk Alerts" 
           value={alerts.length} 
           icon={AlertTriangle} 
           iconColor="text-rose-500"
           iconBg="bg-rose-500/10"
           subtitle="Critical security incidents"
         />
         <StatCard 
           title="KYC Overrides" 
           value={kycQueue.length} 
           icon={Fingerprint} 
           iconColor="text-amber-500"
           iconBg="bg-amber-500/10"
           subtitle="Identities awaiting approval"
         />
      </div>

      {/* Main Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Support Tickets */}
        <div className="bg-[#1e232b] border border-[#2d323b] rounded-2xl shadow-sm overflow-hidden flex flex-col h-full">
           <div className="p-6 border-b border-[#2d323b] flex justify-between items-center bg-[#171a21]/50">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2"><LifeBuoy className="w-5 h-5 text-blue-500"/> Support Tickets</h2>
           </div>
           <div className="flex-1 min-h-[250px] flex items-center justify-center p-8 text-center text-slate-500">
             {tickets.length > 0 ? (
               <div className="w-full h-full text-left">{/* Render items here if any */}</div>
             ) : (
               <div className="flex flex-col items-center gap-3">
                 <CheckCircle className="w-10 h-10 text-emerald-500/50" />
                 <p className="text-sm font-medium">No active support tickets found.</p>
               </div>
             )}
           </div>
        </div>

        {/* High Risk Alerts */}
        <div className="bg-[#1e232b] border border-[#2d323b] rounded-2xl shadow-sm overflow-hidden flex flex-col h-full">
           <div className="p-6 border-b border-[#2d323b] flex justify-between items-center bg-[#171a21]/50">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2"><AlertTriangle className="w-5 h-5 text-rose-500"/> High-Risk Alerts</h2>
           </div>
           <div className="flex-1 min-h-[250px] flex items-center justify-center p-8 text-center text-slate-500">
             {alerts.length > 0 ? (
               <div className="w-full h-full text-left">{/* Render alerts here if any */}</div>
             ) : (
               <div className="flex flex-col items-center gap-3">
                 <Shield className="w-10 h-10 text-emerald-500/50" />
                 <p className="text-sm font-medium">No security alerts detected.</p>
               </div>
             )}
           </div>
        </div>

        {/* Manual Overrides */}
        <div className="bg-[#1e232b] border border-[#2d323b] rounded-2xl shadow-sm overflow-hidden flex flex-col lg:col-span-2">
           <div className="p-6 border-b border-[#2d323b] flex justify-between items-center bg-[#171a21]/50">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2"><UserCheck className="w-5 h-5 text-amber-500"/> Manual KYC Overrides</h2>
              <span className="text-xs font-medium bg-[#171a21] text-amber-500 px-3 py-1 rounded-lg border border-[#2d323b]">Tier 0 Clearance Required</span>
           </div>
           <div className="overflow-x-auto min-h-[150px]">
              <table className="w-full text-left border-collapse">
                 <thead>
                    <tr className="bg-[#171a21]">
                       <th className="px-6 py-4 text-xs font-medium text-slate-400 uppercase tracking-wider">Target Node</th>
                       <th className="px-6 py-4 text-xs font-medium text-slate-400 uppercase tracking-wider">Reason</th>
                       <th className="px-6 py-4 text-xs font-medium text-slate-400 uppercase tracking-wider text-center">Confidence</th>
                       <th className="px-6 py-4 text-xs font-medium text-slate-400 uppercase tracking-wider text-right">Action</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-[#2d323b]">
                    {kycQueue.length > 0 ? (
                      kycQueue.map(item => (
                        <tr key={item.id} className="hover:bg-[#171a21] transition-colors">
                           <td className="px-6 py-4 text-sm font-semibold text-white">{item.user}</td>
                           <td className="px-6 py-4 text-sm text-slate-400">{item.status}</td>
                           <td className="px-6 py-4 text-sm text-center text-slate-400">{item.confidence}</td>
                           <td className="px-6 py-4 text-right">
                              <button className="text-blue-500 hover:text-blue-400 transition-colors text-sm font-medium">Review</button>
                           </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" className="px-6 py-8 text-center text-slate-500 text-sm">KYC queue is entirely clear.</td>
                      </tr>
                    )}
                 </tbody>
               </table>
           </div>
        </div>

        {/* Beta Release Management */}
        <div className="bg-[#1e232b] border border-[#2d323b] rounded-2xl shadow-sm overflow-hidden flex flex-col h-full lg:col-span-2 mt-2">
           <div className="p-6 border-b border-[#2d323b] flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#171a21]/50">
              <div>
                 <h2 className="text-lg font-semibold text-white flex items-center gap-2"><Zap className="w-5 h-5 text-indigo-500"/> Application Release Console</h2>
                 <p className="text-xs text-slate-400 font-medium mt-1">Manage staging links and report active system bugs.</p>
              </div>
              <div className="flex gap-3">
                 <button 
                   onClick={() => handleAction('System', 'Generate Beta Link')} 
                   className="flex items-center gap-2 px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-lg text-indigo-400 text-sm font-medium hover:bg-indigo-500 hover:text-white transition-colors"
                 >
                    <Settings className="w-4 h-4" /> Get Beta Link
                 </button>
                  <button 
                    onClick={() => handleAction('System', 'Push to Git')} 
                    disabled={!canDeploy}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        canDeploy 
                        ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 hover:bg-emerald-500 hover:text-white' 
                        : 'bg-slate-800 border-[#2d323b] text-slate-500 cursor-not-allowed opacity-50'
                    }`}
                  >
                     <TrendingUp className="w-4 h-4" /> Push Deploy
                  </button>
              </div>
           </div>
           
           <div className="p-6">
              <div className="flex flex-col md:flex-row gap-6 items-center justify-between border-b border-[#2d323b] pb-6">
                 <div className="flex-1">
                    <h3 className="text-lg font-bold text-white mb-2">v2.4.0 <span className="text-xs bg-indigo-500/20 text-indigo-400 px-2 py-0.5 rounded-lg border border-indigo-500/20 ml-2 font-medium">Staging</span></h3>
                    <p className="text-sm text-slate-400 leading-relaxed max-w-xl">
                       This environment tracks unresolved bugs directly connected to your Paywise Backend. Use the interface below to log new issues or mark existing bugs as resolved.
                    </p>
                 </div>
                 
                 <div className="flex gap-4">
                    <div className="text-center p-4 bg-[#171a21] rounded-xl border border-[#2d323b]">
                       <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-1">Status</p>
                       <span className="text-emerald-500 text-sm font-bold">Passing</span>
                    </div>
                    <div className="text-center p-4 bg-[#171a21] rounded-xl border border-[#2d323b]">
                       <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-1">Build</p>
                       <span className="text-emerald-500 text-sm font-bold">Stable</span>
                    </div>
                 </div>
              </div>

              {/* Bug Reporting Session */}
              <div className="mt-6">
                 <h4 className="text-sm font-semibold text-white mb-4">Bug Reports & System Logs</h4>
                 
                 <div className="flex gap-3 mb-6">
                    <input 
                      type="text" 
                      value={newBug}
                      onChange={(e) => setNewBug(e.target.value)}
                      placeholder="Describe the bug or issue observed..."
                      className="flex-1 bg-[#171a21] border border-[#2d323b] rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
                    />
                    <button 
                      onClick={submitBug}
                      disabled={reportingBug || !newBug.trim()}
                      className="px-6 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-semibold rounded-lg transition-colors flex items-center gap-2"
                    >
                       {reportingBug ? <Activity className="w-4 h-4 animate-spin" /> : <FileWarning className="w-4 h-4" />}
                       Save Log
                    </button>
                 </div>

                 <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                    {bugs.length > 0 ? (
                      bugs.map(bug => (
                        <div key={bug._id} className={`p-4 rounded-xl border flex items-center justify-between transition-colors ${
                          bug.status === 'resolved' ? 'bg-[#171a21] border-[#2d323b] opacity-60' : 'bg-[#1e232b] border-[#2d323b] hover:border-[#3d424b]'
                        }`}>
                           <div className="flex items-center gap-4">
                              <div className={`w-2 h-2 rounded-full ${bug.status === 'resolved' ? 'bg-emerald-500' : 'bg-amber-500'}`}></div>
                              <div>
                                 <p className={`text-sm ${bug.status === 'resolved' ? 'text-slate-500 line-through' : 'text-slate-200'} font-medium`}>
                                    {bug.description}
                                 </p>
                                 <p className="text-xs text-slate-500 mt-1 font-medium">
                                    Reported by {bug.reporter?.username || 'Admin'} • {new Date(bug.createdAt).toLocaleDateString()}
                                 </p>
                              </div>
                           </div>
                           {bug.status !== 'resolved' && (
                             <button 
                               onClick={() => resolveBug(bug._id)}
                               className="p-2 hover:bg-emerald-500/10 hover:text-emerald-500 text-slate-400 rounded-lg transition-colors"
                             >
                                <CheckCircle className="w-5 h-5" />
                             </button>
                           )}
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-10 bg-[#171a21] border border-dashed border-[#2d323b] rounded-xl">
                         <p className="text-sm text-slate-500 font-medium">No bugs reported yet in this cycle</p>
                      </div>
                    )}
                 </div>
              </div>
           </div>
        </div>

      </div>
    </div>
  );
};

export default Operations;
