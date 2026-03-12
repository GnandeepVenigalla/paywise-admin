import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  AlertOctagon, LifeBuoy, ShieldAlert, CheckCircle, XCircle, 
  UserCheck, AlertTriangle, Fingerprint, Activity, Clock, FileWarning, Key, Settings, Shield, Zap, TrendingUp, UserMinus
} from 'lucide-react';

const StatBox = ({ title, value, icon: Icon, alertColor, subtitle }) => (
  <div className={`glass-card relative overflow-hidden flex flex-col p-6 animate-in zoom-in-95 duration-700`}>
    <div className={`absolute -right-10 -top-10 w-32 h-32 rounded-full blur-[60px] opacity-20 ${alertColor}`}></div>
    <div className="flex justify-between items-start mb-4 z-10">
      <div className={`p-3 rounded-2xl ${alertColor} bg-opacity-20 shadow-lg border border-white/5`}>
        <Icon className={`w-6 h-6 text-white`} />
      </div>
      <div className="text-right">
        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-1">{title}</h3>
        <p className="text-3xl font-black text-white">{value}</p>
      </div>
    </div>
    <div className="mt-auto border-t border-white/10 pt-4 z-10">
       <p className="text-xs text-slate-400 font-medium">{subtitle}</p>
    </div>
  </div>
);

const Operations = () => {
  const [loading, setLoading] = useState(false);
  const [tickets, setTickets] = useState([
    { id: 'TIC-0982', user: 'jane_smith@paywiseapp.com', issue: 'KYC Document Rejected', status: 'waiting', urgency: 'high', time: '12m ago' },
    { id: 'TIC-0985', user: 'bob_martin@test.com', issue: 'Account Frozen Appeal', status: 'waiting', urgency: 'critical', time: '45m ago' },
    { id: 'TIC-0988', user: 'alice_w@domain.com', issue: 'Identity Verification Stuck', status: 'waiting', urgency: 'medium', time: '2h ago' }
  ]);
  const [alerts, setAlerts] = useState([
    { id: 'ALR-881', user: 'User #102 (test_acc)', type: 'New Country Login', details: 'Login attempt from IP 192.168.x (Russia) 2 hours after US login.', action: 'flagged' },
    { id: 'ALR-882', user: 'User #458 (node_0x)', type: 'Velocity Attack', details: '9 failed transactions in 60 seconds.', action: 'blocked' }
  ]);
  const [kycQueue, setKycQueue] = useState([
    { id: 'K-991', user: 'david_r@paywise.net', status: 'Automated Fail - Blurred ID', confidence: '45%', actions: ['approve', 'reject'] },
    { id: 'K-992', user: 'xyz_99@secure.com', status: 'Automated Fail - Name Mismatch', confidence: '62%', actions: ['approve', 'reject'] }
  ]);

  const [selectedAlerts, setSelectedAlerts] = useState([]);

  const handleSelectAllAlerts = (e) => setSelectedAlerts(e.target.checked ? alerts.map(a => a.id) : []);
  const handleSelectAlert = (id) => setSelectedAlerts(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  const handleBatchAlertAction = (action) => {
    handleAction(`[BATCH ${selectedAlerts.length} items]`, action);
    setSelectedAlerts([]);
  };

  const [message, setMessage] = useState('');

  const handleAction = (type, action) => {
    setMessage(`Executing [${action.toUpperCase()}] protocol on ${type}...`);
    setTimeout(() => setMessage(''), 3000);
  };

  return (
    <div className="space-y-10 pb-20 max-w-[1600px] mx-auto animate-in fade-in duration-700">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8">
         <div>
            <div className="flex items-center gap-2 mb-3">
               <div className="bg-rose-500/10 text-rose-500 text-[10px] font-black px-4 py-1.5 rounded-full border border-rose-500/20 uppercase tracking-widest flex items-center gap-2 shadow-[0_0_20px_rgba(244,63,94,0.1)]">
                 <AlertOctagon className="w-3.5 h-3.5 animate-pulse" /> Active Risk Protocols
               </div>
            </div>
            <h1 className="text-5xl font-black text-white tracking-tighter">Operations <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-orange-500">Hub</span></h1>
            <p className="text-slate-400 mt-2 font-medium">Resolving manual exceptions, security alerts, and organizational risk pipelines.</p>
         </div>
      </div>

      {message && (
        <div className="bg-indigo-600 border border-indigo-500/30 px-6 py-4 rounded-2xl flex items-center justify-between text-white font-bold animate-in slide-in-from-top flex-1 shadow-2xl">
          <span className="flex items-center gap-3"><Activity className="w-5 h-5 animate-pulse"/> {message}</span>
        </div>
      )}

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <StatBox 
           title="Support Ticket Queue" 
           value="3" 
           icon={LifeBuoy} 
           alertColor="bg-blue-600" 
           subtitle="Users waiting for manual KYC help or general support."
         />
         <StatBox 
           title="High-Risk ATO Alerts" 
           value="2" 
           icon={ShieldAlert} 
           alertColor="bg-rose-600" 
           subtitle="Suspicious login patterns and volume detected."
         />
         <StatBox 
           title="Manual KYC Overrides" 
           value="2" 
           icon={Fingerprint} 
           alertColor="bg-amber-600" 
           subtitle="Identities failed automation, awaiting manual approval."
         />
      </div>

      {/* Main Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Support Tickets */}
        <div className="glass-card shadow-xl p-0 overflow-hidden flex flex-col h-full border border-blue-500/10">
           <div className="p-6 border-b border-white/5 bg-white/[0.02]">
              <h2 className="text-lg font-black text-white tracking-tight flex items-center gap-2"><LifeBuoy className="w-5 h-5 text-blue-500"/> Support Tickets</h2>
           </div>
           <div className="divide-y divide-white/5">
              {tickets.map(ticket => (
                 <div key={ticket.id} className="p-6 hover:bg-white/[0.02] transition-colors group">
                    <div className="flex justify-between items-start mb-3">
                       <div>
                          <p className="text-sm font-bold text-white mb-1"><span className="text-blue-400 mr-2">[{ticket.id}]</span> {ticket.issue}</p>
                          <p className="text-xs text-slate-500 font-medium font-mono">{ticket.user}</p>
                       </div>
                       <div className="flex items-center gap-2">
                          <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-1"><Clock className="w-3 h-3"/> {ticket.time}</span>
                          <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest ${ticket.urgency === 'critical' ? 'bg-rose-500/20 text-rose-400' : 'bg-amber-500/20 text-amber-400'}`}>{ticket.urgency}</span>
                       </div>
                    </div>
                    <button onClick={() => handleAction('Ticket ' + ticket.id, 'engage support')} className="mt-2 text-[10px] font-black bg-white/5 border border-white/10 hover:bg-white/10 text-white px-4 py-2 rounded-lg transition-all uppercase tracking-widest flex items-center gap-2">
                       Resolve Ticket <Activity className="w-3 h-3 group-hover:text-blue-400"/>
                    </button>
                 </div>
              ))}
           </div>
        </div>

        {/* High Risk Alerts */}
        <div className="glass-card shadow-xl p-0 overflow-hidden flex flex-col h-full border border-rose-500/10">
           <div className="p-6 border-b border-white/5 bg-rose-950/20 flex justify-between items-center">
              <h2 className="text-lg font-black text-rose-100 tracking-tight flex items-center gap-2"><AlertTriangle className="w-5 h-5 text-rose-500"/> High-Risk Alerts</h2>
              {selectedAlerts.length > 0 && (
                 <div className="flex gap-2 animate-in fade-in">
                    <button onClick={() => handleBatchAlertAction('freeze accounts')} className="bg-rose-500/20 border border-rose-500/30 text-rose-400 text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg hover:bg-rose-500 hover:text-white transition-all shadow-lg flex items-center gap-1">Bulk Freeze ({selectedAlerts.length})</button>
                    <button onClick={() => handleBatchAlertAction('dismiss')} className="bg-white/10 border border-white/20 text-slate-300 text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg hover:bg-slate-700 hover:text-white transition-all shadow-lg">Batch Dismiss ({selectedAlerts.length})</button>
                 </div>
              )}
           </div>

           <div className="p-4 border-b border-white/5 bg-rose-950/10 flex items-center gap-3">
              <label className="flex items-center gap-2 cursor-pointer group">
                  <input type="checkbox" checked={selectedAlerts.length === alerts.length && alerts.length > 0} onChange={handleSelectAllAlerts} className="w-4 h-4 rounded border-rose-500/30 bg-rose-950/50 text-rose-500 focus:ring-rose-500 focus:ring-opacity-20 cursor-pointer accent-rose-500" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 group-hover:text-rose-400 transition-colors">Select All Incidents</span>
              </label>
           </div>

           <div className="divide-y divide-white/5 bg-rose-950/10 flex-1 overflow-y-auto min-h-[300px]">
              {alerts.map(alert => (
                 <div key={alert.id} className={`p-6 hover:bg-rose-500/5 transition-colors group flex items-start gap-4 ${selectedAlerts.includes(alert.id) ? 'bg-rose-500/10 border-l-2 border-rose-500' : 'border-l-2 border-transparent'}`}>
                    <input type="checkbox" checked={selectedAlerts.includes(alert.id)} onChange={() => handleSelectAlert(alert.id)} className="mt-1 w-4 h-4 rounded border-rose-500/30 bg-rose-950/50 text-rose-500 focus:ring-rose-500 focus:ring-opacity-20 cursor-pointer accent-rose-500" />
                    <div className="flex-1">
                        <div className="flex justify-between items-start mb-3">
                           <div>
                              <p className="text-sm font-bold text-white mb-1"><span className="text-rose-400 mr-2">[{alert.id}]</span> {alert.type}</p>
                              <p className="text-xs text-slate-400 font-medium mb-2">{alert.details}</p>
                              <p className="text-[10px] text-rose-500 font-bold uppercase tracking-widest bg-rose-500/10 px-2 py-1 rounded inline-block">Target: {alert.user}</p>
                           </div>
                        </div>
                        <div className="flex gap-2 mt-4">
                           <button onClick={() => handleAction('Alert ' + alert.id, 'freeze target')} className="text-[10px] font-black bg-rose-500/20 border border-rose-500/20 hover:bg-rose-500 hover:text-white text-rose-400 px-4 py-2 rounded-lg transition-all uppercase tracking-widest flex items-center gap-2">
                              Freeze Account <XCircle className="w-3 h-3"/>
                           </button>
                           <button onClick={() => handleAction('Alert ' + alert.id, 'dismiss')} className="text-[10px] font-black bg-white/5 border border-white/10 hover:bg-slate-800 text-slate-400 px-4 py-2 rounded-lg transition-all uppercase tracking-widest flex items-center gap-2">
                              False Alarm
                           </button>
                        </div>
                    </div>
                 </div>
              ))}
           </div>
        </div>

        {/* Manual Overrides */}
        <div className="glass-card shadow-xl p-0 overflow-hidden flex flex-col h-full lg:col-span-2 border border-amber-500/10">
           <div className="p-6 border-b border-white/5 bg-amber-950/20 flex justify-between items-center">
              <h2 className="text-lg font-black text-amber-100 tracking-tight flex items-center gap-2"><UserCheck className="w-5 h-5 text-amber-500"/> Manual KYC Overrides</h2>
              <span className="text-[10px] font-black bg-amber-500/20 text-amber-400 px-3 py-1 rounded-full border border-amber-500/20">Requires Tier 0 / Tier 1 Clearance</span>
           </div>
           <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                 <thead>
                    <tr className="border-b border-white/5 bg-black/20">
                       <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Target Node</th>
                       <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Automation Failure Reason</th>
                       <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">AI Confidence</th>
                       <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">Admin Override</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-white/5 bg-amber-950/10">
                    {kycQueue.map(item => (
                       <tr key={item.id} className="hover:bg-amber-500/5 transition-colors">
                          <td className="px-6 py-5 text-sm font-bold text-white">{item.user}</td>
                          <td className="px-6 py-5">
                             <span className="text-xs text-amber-400 font-medium bg-amber-500/10 px-2 py-1 rounded border border-amber-500/10">{item.status}</span>
                          </td>
                          <td className="px-6 py-5 text-center">
                             <div className="inline-flex items-center justify-center w-10 h-10 rounded-full border-2 border-slate-700 text-[10px] font-black text-slate-400">
                                {item.confidence}
                             </div>
                          </td>
                          <td className="px-6 py-5 text-right">
                             <div className="flex justify-end gap-2">
                                <button onClick={() => handleAction('KYC ' + item.id, 'Override Approve')} className="p-2.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 hover:bg-emerald-500 hover:text-white rounded-xl transition-all hover:scale-110 active:scale-95" title="Force Approve (Trust User)">
                                   <CheckCircle className="w-4 h-4" />
                                </button>
                                <button onClick={() => handleAction('KYC ' + item.id, 'Reject KYC')} className="p-2.5 bg-rose-500/10 border border-rose-500/20 text-rose-500 hover:bg-rose-500 hover:text-white rounded-xl transition-all hover:scale-110 active:scale-95" title="Reject Identity Submission">
                                   <XCircle className="w-4 h-4" />
                                </button>
                             </div>
                          </td>
                       </tr>
                    ))}
                 </tbody>
              </table>
           </div>
        </div>

        {/* Autonomous Defense Grid */}
        <div className="glass-card shadow-xl p-0 overflow-hidden flex flex-col h-full lg:col-span-2 border border-emerald-500/10 mt-8">
           <div className="p-6 border-b border-white/5 bg-emerald-950/20 flex justify-between items-center">
              <div>
                 <h2 className="text-lg font-black text-emerald-100 tracking-tight flex items-center gap-2"><Zap className="w-5 h-5 text-emerald-500"/> Autonomous Defense Grid</h2>
                 <p className="text-[10px] text-emerald-400/70 font-bold uppercase tracking-widest mt-1">Pre-programmed decision trees reducing manual load.</p>
              </div>
              <button className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-emerald-400 text-[10px] font-black uppercase tracking-widest hover:bg-emerald-500 hover:text-white transition-all">
                 <Settings className="w-3 h-3" /> Configure Grid
              </button>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6 bg-emerald-950/5">
              
              {/* Automation 1 */}
              <div className="p-5 border border-white/5 bg-black/20 rounded-2xl relative overflow-hidden group">
                 <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500"></div>
                 <div className="flex justify-between items-start mb-3">
                    <h3 className="text-sm font-black text-white flex items-center gap-2"><Shield className="w-4 h-4 text-emerald-400" /> Three-Strike KYC Ban</h3>
                    <div className="w-8 h-4 bg-emerald-500 rounded-full relative shadow-[0_0_10px_rgba(16,185,129,0.3)]"><div className="w-3 h-3 bg-white rounded-full absolute right-0.5 top-0.5"></div></div>
                 </div>
                 <p className="text-[11px] text-slate-400 font-medium leading-relaxed mb-4">If a user fails AI-verification 3 times consecutively, automatically flag the device node as fraudulent and freeze account creation.</p>
                 <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-widest">
                    <span className="text-slate-500">Current Load</span>
                    <span className="text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">Blocked 42 Nodes Today</span>
                 </div>
              </div>

              {/* Automation 2 */}
              <div className="p-5 border border-white/5 bg-black/20 rounded-2xl relative overflow-hidden group">
                 <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500"></div>
                 <div className="flex justify-between items-start mb-3">
                    <h3 className="text-sm font-black text-white flex items-center gap-2"><TrendingUp className="w-4 h-4 text-emerald-400" /> Velocity Auto-Lock</h3>
                    <div className="w-8 h-4 bg-emerald-500 rounded-full relative shadow-[0_0_10px_rgba(16,185,129,0.3)]"><div className="w-3 h-3 bg-white rounded-full absolute right-0.5 top-0.5"></div></div>
                 </div>
                 <p className="text-[11px] text-slate-400 font-medium leading-relaxed mb-4">If an IP attempts &gt;5 peer-to-peer transfers under $2.00 in 60 seconds (Card Testing), immediately revoke transfer privileges.</p>
                 <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-widest">
                    <span className="text-slate-500">Current Load</span>
                    <span className="text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">Secured $4,200 Today</span>
                 </div>
              </div>

              {/* Automation 3 */}
              <div className="p-5 border border-white/5 bg-black/20 rounded-2xl relative overflow-hidden group opacity-60">
                 <div className="absolute top-0 left-0 w-1 h-full bg-slate-500"></div>
                 <div className="flex justify-between items-start mb-3">
                    <h3 className="text-sm font-black text-slate-300 flex items-center gap-2"><UserMinus className="w-4 h-4 text-slate-400" /> Dormant Account Purge</h3>
                    <div className="w-8 h-4 bg-white/10 rounded-full relative"><div className="w-3 h-3 bg-slate-400 rounded-full absolute left-0.5 top-0.5"></div></div>
                 </div>
                 <p className="text-[11px] text-slate-400 font-medium leading-relaxed mb-4">If an account has $0.00 balance and no logins for 365 days, transition to cold storage and free up active server nodes.</p>
                 <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-widest">
                    <span className="text-slate-500">Current Load</span>
                    <span className="text-slate-400 bg-white/5 px-2 py-0.5 rounded border border-white/10">Disabled</span>
                 </div>
              </div>

           </div>
        </div>

      </div>
    </div>
  );
};

export default Operations;
