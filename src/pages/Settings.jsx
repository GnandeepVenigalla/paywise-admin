import React, { useState } from 'react';
import { Save, Bell, Shield, Database, Globe, Mail, HardDrive, Lock, ShieldCheck, Zap, Rocket, History } from 'lucide-react';

const SettingToggle = ({ title, description, enabled, onChange }) => (
  <div className="flex items-center justify-between py-6 group">
    <div>
      <p className="text-sm font-black text-white tracking-tight">{title}</p>
      <p className="text-xs text-slate-500 font-medium mt-1">{description}</p>
    </div>
    <button 
      onClick={onChange}
      className={`w-14 h-8 rounded-full relative transition-all duration-300 ${enabled ? 'bg-indigo-600 shadow-[0_0_15px_rgba(79,70,229,0.4)]' : 'bg-white/10'}`}
    >
      <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all duration-300 shadow-lg ${enabled ? 'right-1' : 'left-1'}`}></div>
    </button>
  </div>
);

const Settings = () => {
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
  const isRoot = currentUser.adminRole === 'root' || currentUser.email === 'gnandeep.venigalla@paywiseapp.com';

  const [toggles, setToggles] = useState({
    tfa: true,
    ipWhite: false,
    maintenance: false,
    aiSecurity: true,
    shadowMode: true,
    expFee: false,
    betaAds: false
  });

  const auditLogs = [
    { id: 1, time: '10:42 AM', admin: 'System Admin (Node 01)', action: 'Unfroze User #10' },
    { id: 2, time: '09:14 AM', admin: 'Sarah J. (Moderator)', action: 'Batch Dismissed 4 ALR-882 Alerts' },
    { id: 3, time: 'Yesterday', admin: 'Root System', action: 'Toggled Shadow Mode ON' },
    { id: 4, time: 'Yesterday', admin: 'System Admin (Node 01)', action: 'Updated Log Buffer Capacity to 256GB' }
  ];

  return (
    <div className="max-w-5xl space-y-10 pb-20 animate-in fade-in duration-700 mx-auto">
      <div>
        <div className="flex items-center gap-2 mb-3">
          <span className="bg-emerald-500/10 text-emerald-400 text-[10px] font-black px-3 py-1 rounded-full border border-emerald-500/20 uppercase tracking-widest">Environment Variables</span>
        </div>
        <h1 className="text-5xl font-black text-white tracking-tighter">Core <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-violet-500">Config</span></h1>
        <p className="text-slate-500 mt-2 font-medium">Fine-tuning the Paywise kernel and global security parameters.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="space-y-10">
          <section className="glass-card !p-8">
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-2xl border border-indigo-500/20">
                <Shield className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-black text-white tracking-tight">Access Control</h2>
            </div>
            <div className="divide-y divide-white/[0.03]">
              <SettingToggle 
                title="Strict Domain Validation" 
                description="Enforce @paywiseapp.com for all management nodes" 
                enabled={true} 
                onChange={() => {}}
              />
              <SettingToggle 
                title="Zero-Knowledge OTP" 
                description="Passwordless authentication flow for admin clusters" 
                enabled={true} 
                onChange={() => {}}
              />
              <SettingToggle 
                title="Neural Perimeter Defense" 
                description="AI-driven threat detection on administrative endpoints" 
                enabled={toggles.aiSecurity} 
                onChange={() => setToggles({...toggles, aiSecurity: !toggles.aiSecurity})}
              />
            </div>
          </section>

          <section className="glass-card !p-8">
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 bg-rose-500/10 text-rose-400 rounded-2xl border border-rose-500/20">
                <HardDrive className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-black text-white tracking-tight">Internal Storage</h2>
            </div>
            <div className="grid grid-cols-1 gap-6">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Log Buffer Capacity (GB)</label>
                <input 
                  type="number" 
                  defaultValue={256} 
                  className="w-full px-5 py-4 bg-white/5 border border-white/5 rounded-2xl text-white font-bold focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500/40 transition-all shadow-inner" 
                />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Retention Interval (Cycles)</label>
                <select className="w-full px-5 py-4 bg-white/5 border border-white/5 rounded-2xl text-white font-bold focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500/40 transition-all shadow-inner appearance-none">
                   <option>90 Epochs</option>
                   <option>180 Epochs</option>
                   <option>Infinite Trace</option>
                </select>
              </div>
            </div>
          </section>
        </div>

        <div className="space-y-10">
          <section className="glass-card !p-8">
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 bg-violet-500/10 text-violet-400 rounded-2xl border border-violet-500/20">
                <Zap className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-black text-white tracking-tight">System Status</h2>
            </div>
            <div className="space-y-6">
               <div className="p-6 bg-white/[0.02] border border-white/5 rounded-3xl space-y-4">
                  <div className="flex justify-between items-center text-xs font-black uppercase tracking-widest">
                     <span className="text-slate-500">Database Uptime</span>
                     <span className="text-emerald-400">100.00%</span>
                  </div>
                  <div className="flex gap-1 h-8">
                     {[...Array(24)].map((_, i) => (
                        <div key={i} className="flex-1 bg-emerald-500/20 border border-emerald-500/10 rounded-sm animate-in fade-in zoom-in" style={{animationDelay: `${i * 20}ms`}}></div>
                     ))}
                  </div>
               </div>
               
               <div className="p-6 bg-white/[0.02] border border-white/5 rounded-3xl">
                  <SettingToggle 
                    title="Broadcasting Mode" 
                    description="Display global alerts on client dashboards" 
                    enabled={toggles.maintenance} 
                    onChange={() => setToggles({...toggles, maintenance: !toggles.maintenance})}
                  />
               </div>
            </div>
          </section>

          <section className="glass-card !p-8">
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 bg-fuchsia-500/10 text-fuchsia-400 rounded-2xl border border-fuchsia-500/20">
                <Rocket className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-black text-white tracking-tight">Feature Flags</h2>
            </div>
            <div className="divide-y divide-white/[0.03]">
              <SettingToggle 
                title="Shadow Mode" 
                description="Toggle 'ON' to deploy new tests to 5% of users without redeploying." 
                enabled={toggles.shadowMode} 
                onChange={() => setToggles({...toggles, shadowMode: !toggles.shadowMode})}
              />
              <SettingToggle 
                title="Experimental Transaction Fee" 
                description="Test new transaction fee logic on limited user cohorts." 
                enabled={toggles.expFee} 
                onChange={() => setToggles({...toggles, expFee: !toggles.expFee})}
              />
              <SettingToggle 
                title="Beta Ad Network" 
                description="Route fractional traffic to alternative ad providers." 
                enabled={toggles.betaAds} 
                onChange={() => setToggles({...toggles, betaAds: !toggles.betaAds})}
              />
            </div>
          </section>

          <div className="p-8 bg-gradient-to-br from-indigo-500/5 to-violet-500/5 border border-white/10 rounded-[2.5rem] flex items-center justify-between">
             <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white flex items-center justify-center rounded-2xl shadow-xl">
                   <Save className="w-6 h-6 text-slate-950" />
                </div>
                <div>
                   <p className="text-white font-black tracking-tight">Ready to commit?</p>
                   <p className="text-xs text-slate-500 font-medium">Changes propagate instantly across node clusters.</p>
                </div>
             </div>
             <button className="px-8 py-4 bg-white text-slate-950 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-indigo-50 transition-all shadow-xl active:scale-95">
                Apply Logic
             </button>
          </div>
        </div>
      </div>
      
      {/* Root Access Controls */}
      {isRoot && (
        <section className="glass-card !p-0 overflow-hidden mt-10 border-rose-500/20 shadow-[0_0_30px_rgba(243,24,103,0.1)]">
          <div className="p-8 border-b border-rose-500/10 flex items-center gap-4 bg-rose-500/5">
            <div className="p-3 bg-rose-500/20 text-rose-500 rounded-2xl border border-rose-500/30">
              <Zap className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h2 className="text-xl font-black text-rose-400 tracking-tight">Root Authority: The Kill Switch</h2>
              <p className="text-[10px] text-rose-500/70 font-bold uppercase tracking-widest mt-1">Total system shutdown. Data wipe. Administrative wipe. Proceed with absolute caution.</p>
            </div>
          </div>
          <div className="p-8 bg-rose-950/20 flex items-center justify-between">
            <div>
               <p className="text-sm font-black text-rose-100 uppercase tracking-widest">Execute Total Kernel Wipe</p>
               <p className="text-xs text-rose-400/50 font-medium mt-1">This will permanently destroy the dashboard linkage and wipe the primary datastores.</p>
            </div>
            <button 
               onClick={() => { if(window.confirm('CRITICAL WARNING: This will permanently wipe the entire Paywise backend and dashboard. Types "CONFIRM" to proceed.') && prompt('Type CONFIRM')==='CONFIRM') alert('Database Wipe Initiated. Kernel shutting down...'); }}
               className="px-8 py-4 bg-rose-600 text-white rounded-2xl text-xs font-black uppercase tracking-[0.2em] transition-all shadow-[0_0_20px_rgba(225,29,72,0.4)] hover:bg-rose-500 active:scale-95 border border-rose-400"
            >
               Wipe Database
            </button>
          </div>
        </section>
      )}

      {/* Admin Audit Trail */}
      {isRoot && (
      <section className="glass-card !p-0 overflow-hidden mt-10">
        <div className="p-8 border-b border-white/5 flex items-center gap-4 bg-amber-950/10">
          <div className="p-3 bg-amber-500/10 text-amber-400 rounded-2xl border border-amber-500/20">
            <History className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-black text-amber-100 tracking-tight">Admin Audit Trail</h2>
            <p className="text-[10px] text-amber-400/70 font-bold uppercase tracking-widest mt-1">Immutable log of system modifications and administrative actions.</p>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 bg-black/20">
                <th className="px-8 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Time</th>
                <th className="px-8 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Admin Name</th>
                <th className="px-8 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Action Executed</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 bg-amber-950/5">
               {auditLogs.map(log => (
                  <tr key={log.id} className="hover:bg-amber-500/10 transition-colors group">
                     <td className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">{log.time}</td>
                     <td className="px-8 py-5 text-xs font-bold text-white flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]"></div>
                        {log.admin}
                     </td>
                     <td className="px-8 py-5 text-xs font-medium text-slate-300 group-hover:text-amber-100 transition-colors">{log.action}</td>
                  </tr>
               ))}
            </tbody>
          </table>
        </div>
      </section>
      )}

    </div>
  );
};

export default Settings;
