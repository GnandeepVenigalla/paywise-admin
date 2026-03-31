import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  AlertOctagon, LifeBuoy, ShieldAlert, CheckCircle, XCircle, 
  UserCheck, AlertTriangle, Fingerprint, Activity, Clock, FileWarning, Key, Settings, Shield, Zap, TrendingUp, UserMinus
} from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, iconColor, iconBg, subtitle }) => (
  <div className="bg-surface-card border border-surface-border rounded-2xl p-6 shadow-sm hover:border-[#3d424b] transition-colors">
    <div className="flex justify-between items-start mb-4">
      <div>
        <h3 className="text-color-secondary font-medium text-sm mb-2">{title}</h3>
        <p className="text-2xl font-bold text-color mb-1">{value}</p>
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
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [adminReply, setAdminReply] = useState('');
  const [ticketStatus, setTicketStatus] = useState('closed');

  const fetchTickets = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('/api/admin/support', { headers: { 'Authorization': `Bearer ${token}` } });
      setTickets(res.data);
    } catch (err) {
      console.error('Failed to fetch tickets');
    }
  };

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
    fetchTickets();
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

  const respondTicket = async () => {
    if (!selectedTicket || !adminReply) return;
    try {
      const token = localStorage.getItem('token');
      const res = await axios.put(`/api/admin/support/${selectedTicket._id}`, 
        { status: ticketStatus, adminResponse: adminReply }, 
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      setMessage(`Ticket #${selectedTicket._id.slice(-6)} updated to ${ticketStatus}`);
      
      // Keep modal open but update the local ticket data and clear the input
      setSelectedTicket(res.data);
      setAdminReply('');
      
      fetchTickets();
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage('Failed to update ticket');
    }
  };

  const runPhoneReminders = async () => {
    setMessage('Initiating bulk phone reminders protocol...');
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post('/api/admin/maintenance/phone-reminders', {}, { 
        headers: { 'Authorization': `Bearer ${token}` } 
      });
      setMessage(`SUCCESS: ${res.data.msg}`);
    } catch (err) {
      setMessage(`ERROR: ${err.response?.data?.msg || 'Maintenance process failed'}`);
    } finally {
      setTimeout(() => setMessage(''), 8000);
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
            <h1 className="text-2xl font-bold text-color mb-2">Operations Hub</h1>
            <p className="text-color-secondary text-sm">Reviewing manual exceptions, security alerts, and system pipelines.</p>
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
        <div className="bg-surface-card border border-surface-border rounded-2xl shadow-sm overflow-hidden flex flex-col h-full">
           <div className="p-6 border-b border-surface-border flex justify-between items-center bg-surface-section/50">
              <h2 className="text-lg font-semibold text-color flex items-center gap-2"><LifeBuoy className="w-5 h-5 text-blue-500"/> Support Tickets</h2>
           </div>
           <div className="flex-1 min-h-[400px] overflow-y-auto px-6 py-4 custom-scrollbar">
             {tickets.length > 0 ? (
               <div className="space-y-4">
                 {tickets.map(ticket => (
                   <div key={ticket._id} className={`p-4 rounded-xl border transition-all ${
                     ticket.status === 'closed' ? 'bg-surface-section border-surface-border opacity-60' : 'bg-surface-card border-surface-border hover:border-[#3d424b]'
                   }`}>
                     <div className="flex justify-between items-start mb-2">
                       <div>
                         <span className="text-[10px] font-black uppercase text-slate-500 tracking-tighter block mb-1">Ticket ID: {ticket._id.slice(-8)}</span>
                         <h4 className="font-bold text-color leading-tight">{ticket.subject}</h4>
                       </div>
                       <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                         ticket.status === 'open' ? 'bg-amber-500/20 text-amber-500' :
                         ticket.status === 'in-progress' ? 'bg-blue-500/20 text-blue-500' :
                         'bg-emerald-500/20 text-emerald-500 text-emerald-400'
                       }`}>
                         {ticket.status}
                       </span>
                     </div>
                     <p className="text-sm text-color-secondary line-clamp-2 mb-3 leading-relaxed">{ticket.message}</p>
                     <div className="flex items-center justify-between border-t border-surface-border pt-3">
                        <div className="flex items-center gap-2">
                           <div className="w-6 h-6 rounded-full bg-indigo-500/20 flex items-center justify-center text-[10px] font-bold text-indigo-400">
                             {ticket.user?.username?.[0] || 'U'}
                           </div>
                           <span className="text-xs font-medium text-slate-500">{ticket.user?.username || 'Unknown User'}</span>
                        </div>
                        <button 
                          onClick={() => { setSelectedTicket(ticket); setAdminReply(ticket.adminResponse || ''); setTicketStatus(ticket.status === 'closed' ? 'closed' : 'in-progress'); }}
                          className="text-xs font-bold text-indigo-500 hover:underline flex items-center gap-1"
                        >
                          <LifeBuoy className="w-3 h-3" /> Manage Ticket
                        </button>
                     </div>
                   </div>
                 ))}
               </div>
             ) : (
               <div className="flex flex-col items-center gap-3 mt-20">
                 <CheckCircle className="w-10 h-10 text-emerald-500/50" />
                 <p className="text-sm font-medium">No active support tickets found.</p>
               </div>
             )}
           </div>
        </div>

        {/* High Risk Alerts */}
        <div className="bg-surface-card border border-surface-border rounded-2xl shadow-sm overflow-hidden flex flex-col h-full">
           <div className="p-6 border-b border-surface-border flex justify-between items-center bg-surface-section/50">
              <h2 className="text-lg font-semibold text-color flex items-center gap-2"><AlertTriangle className="w-5 h-5 text-rose-500"/> High-Risk Alerts</h2>
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
        <div className="bg-surface-card border border-surface-border rounded-2xl shadow-sm overflow-hidden flex flex-col lg:col-span-2">
           <div className="p-6 border-b border-surface-border flex justify-between items-center bg-surface-section/50">
              <h2 className="text-lg font-semibold text-color flex items-center gap-2"><UserCheck className="w-5 h-5 text-amber-500"/> Manual KYC Overrides</h2>
              <span className="text-xs font-medium bg-surface-section text-amber-500 px-3 py-1 rounded-lg border border-surface-border">Tier 0 Clearance Required</span>
           </div>
           <div className="overflow-x-auto min-h-[150px]">
              <table className="w-full text-left border-collapse">
                 <thead>
                    <tr className="bg-surface-section">
                       <th className="px-6 py-4 text-xs font-medium text-color-secondary uppercase tracking-wider">Target Node</th>
                       <th className="px-6 py-4 text-xs font-medium text-color-secondary uppercase tracking-wider">Reason</th>
                       <th className="px-6 py-4 text-xs font-medium text-color-secondary uppercase tracking-wider text-center">Confidence</th>
                       <th className="px-6 py-4 text-xs font-medium text-color-secondary uppercase tracking-wider text-right">Action</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-[#2d323b]">
                    {kycQueue.length > 0 ? (
                      kycQueue.map(item => (
                        <tr key={item.id} className="hover:bg-surface-section transition-colors">
                           <td className="px-6 py-4 text-sm font-semibold text-color">{item.user}</td>
                           <td className="px-6 py-4 text-sm text-color-secondary">{item.status}</td>
                           <td className="px-6 py-4 text-sm text-center text-color-secondary">{item.confidence}</td>
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
        <div className="bg-surface-card border border-surface-border rounded-2xl shadow-sm overflow-hidden flex flex-col h-full lg:col-span-2 mt-2">
           <div className="p-6 border-b border-surface-border flex flex-col md:flex-row md:items-center justify-between gap-4 bg-surface-section/50">
              <div>
                 <h2 className="text-lg font-semibold text-color flex items-center gap-2"><Zap className="w-5 h-5 text-[var(--primary-color)]"/> Application Release Console</h2>
                 <p className="text-xs text-color-secondary font-medium mt-1">Manage staging links and report active system bugs.</p>
              </div>
              <div className="flex gap-3">
                 <button 
                   onClick={() => handleAction('System', 'Generate Beta Link')} 
                   className="flex items-center gap-2 px-4 py-2 bg-indigo-500/10 border border-[var(--primary-color)]/20 rounded-lg text-[var(--primary-color)] text-sm font-medium hover:bg-indigo-500 hover:text-color transition-colors"
                 >
                    <Settings className="w-4 h-4" /> Get Beta Link
                 </button>
                  <button 
                    onClick={runPhoneReminders}
                    className="flex items-center gap-2 px-4 py-2 bg-amber-500/10 border border-amber-500/20 rounded-lg text-amber-500 text-sm font-medium hover:bg-amber-500 hover:text-color transition-colors"
                  >
                     <ShieldAlert className="w-4 h-4" /> Remind Profiles
                  </button>
                  <button 
                    onClick={() => handleAction('System', 'Push to Git')} 
                    disabled={!canDeploy}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        canDeploy 
                        ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 hover:bg-emerald-500 hover:text-color' 
                        : 'bg-slate-800 border-surface-border text-slate-500 cursor-not-allowed opacity-50'
                    }`}
                  >
                     <TrendingUp className="w-4 h-4" /> Push Deploy
                  </button>
              </div>
           </div>
           
           <div className="p-6">
              <div className="flex flex-col md:flex-row gap-6 items-center justify-between border-b border-surface-border pb-6">
                 <div className="flex-1">
                    <h3 className="text-lg font-bold text-color mb-2">v2.4.0 <span className="text-xs bg-indigo-500/20 text-[var(--primary-color)] px-2 py-0.5 rounded-lg border border-[var(--primary-color)]/20 ml-2 font-medium">Staging</span></h3>
                    <p className="text-sm text-color-secondary leading-relaxed max-w-xl">
                       This environment tracks unresolved bugs directly connected to your Paywise Backend. Use the interface below to log new issues or mark existing bugs as resolved.
                    </p>
                 </div>
                 
                 <div className="flex gap-4">
                    <div className="text-center p-4 bg-surface-section rounded-xl border border-surface-border">
                       <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-1">Status</p>
                       <span className="text-emerald-500 text-sm font-bold">Passing</span>
                    </div>
                    <div className="text-center p-4 bg-surface-section rounded-xl border border-surface-border">
                       <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-1">Build</p>
                       <span className="text-emerald-500 text-sm font-bold">Stable</span>
                    </div>
                 </div>
              </div>

              {/* Bug Reporting Session */}
              <div className="mt-6">
                 <h4 className="text-sm font-semibold text-color mb-4">Bug Reports & System Logs</h4>
                 
                 <div className="flex gap-3 mb-6">
                    <input 
                      type="text" 
                      value={newBug}
                      onChange={(e) => setNewBug(e.target.value)}
                      placeholder="Describe the bug or issue observed..."
                      className="flex-1 bg-surface-section border border-surface-border rounded-lg px-4 py-2.5 text-sm text-color focus:outline-none focus:border-blue-500 transition-colors"
                    />
                    <button 
                      onClick={submitBug}
                      disabled={reportingBug || !newBug.trim()}
                      className="px-6 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-color text-sm font-semibold rounded-lg transition-colors flex items-center gap-2"
                    >
                       {reportingBug ? <Activity className="w-4 h-4 animate-spin" /> : <FileWarning className="w-4 h-4" />}
                       Save Log
                    </button>
                 </div>

                 <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                    {bugs.length > 0 ? (
                      bugs.map(bug => (
                        <div key={bug._id} className={`p-4 rounded-xl border flex items-center justify-between transition-colors ${
                          bug.status === 'resolved' ? 'bg-surface-section border-surface-border opacity-60' : 'bg-surface-card border-surface-border hover:border-[#3d424b]'
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
                               className="p-2 hover:bg-emerald-500/10 hover:text-emerald-500 text-color-secondary rounded-lg transition-colors"
                             >
                                <CheckCircle className="w-5 h-5" />
                             </button>
                           )}
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-10 bg-surface-section border border-dashed border-surface-border rounded-xl">
                         <p className="text-sm text-slate-500 font-medium">No bugs reported yet in this cycle</p>
                      </div>
                    )}
                 </div>
              </div>
           </div>
        </div>

      </div>

       {/* Ticket Management Dialog Overlay */}
       {selectedTicket && (
         <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-surface-card border border-surface-border w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95">
               <div className="p-6 border-b border-surface-border flex justify-between items-center bg-surface-section/50">
                  <h3 className="font-bold text-color flex items-center gap-2 uppercase tracking-widest text-xs">
                    <LifeBuoy className="w-4 h-4 text-blue-500" /> Ticket Control Center
                  </h3>
                  <button onClick={() => setSelectedTicket(null)} className="p-1 hover:bg-surface-section rounded-lg transition-colors">
                    <XCircle className="w-5 h-5 text-slate-500" />
                  </button>
               </div>
               
               <div className="p-8 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
                  <div className="space-y-4">
                    <div className="bg-surface-section/50 border border-surface-border p-4 rounded-xl">
                       <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Original Inquiry</p>
                       <h2 className="text-xl font-bold text-color leading-tight">"{selectedTicket.subject}"</h2>
                       <p className="text-slate-400 text-sm italic mt-3 leading-relaxed">"{selectedTicket.message}"</p>
                    </div>

                    {/* Chat History */}
                    {selectedTicket.replies && selectedTicket.replies.length > 0 && (
                       <div className="space-y-3 pt-4">
                          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Conversation Thread</p>
                          {selectedTicket.replies.map((reply, idx) => (
                             <div key={idx} className={`p-3 rounded-xl border ${
                                reply.isAdmin 
                                ? 'bg-emerald-500/5 border-emerald-500/20 text-right ml-12' 
                                : 'bg-indigo-500/5 border-indigo-500/20 mr-12'
                             }`}>
                                <p className={`text-[9px] font-bold uppercase mb-1 ${reply.isAdmin ? 'text-emerald-500' : 'text-indigo-400'}`}>
                                   {reply.isAdmin ? 'Support Agent' : 'User'}
                                </p>
                                <p className="text-xs text-slate-300 leading-relaxed">{reply.message}</p>
                             </div>
                          ))}
                       </div>
                    )}
                  </div>

                  <div className="space-y-4 pt-6 border-t border-surface-border">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Reply to User</label>
                       <textarea 
                         value={adminReply}
                         onChange={(e) => setAdminReply(e.target.value)}
                         placeholder="Type your message here..."
                         className="w-full bg-surface-section border border-surface-border rounded-xl p-4 text-sm text-color focus:outline-none focus:border-indigo-500 min-h-[100px] shadow-inner"
                       />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                       <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Status Protocol</label>
                          <select 
                            value={ticketStatus}
                            onChange={(e) => setTicketStatus(e.target.value)}
                            className="w-full bg-surface-section border border-surface-border rounded-lg px-4 py-2 text-sm text-color focus:outline-none"
                          >
                             <option value="open">Open</option>
                             <option value="in-progress">In-Progress</option>
                             <option value="closed">Closed / Solved</option>
                          </select>
                       </div>
                       <div className="flex items-end">
                          <button 
                            onClick={respondTicket}
                            className="w-full h-[40px] bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-lg shadow-lg shadow-emerald-900/40 transition-all active:scale-95"
                          >
                             Send & Update
                          </button>
                       </div>
                    </div>
                  </div>
               </div>
            </div>
         </div>
       )}
    </div>
  );
};

export default Operations;
