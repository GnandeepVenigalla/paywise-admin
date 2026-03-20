import React, { useState } from 'react';
import { Save, Shield, HardDrive, Zap, Rocket, History, AlertTriangle } from 'lucide-react';

const SettingToggle = ({ title, description, enabled, onChange }) => (
  <div className="flex items-center justify-between py-5 group border-b border-[#2d323b] last:border-0">
    <div>
      <p className="text-sm font-semibold text-white">{title}</p>
      <p className="text-xs text-slate-400 mt-1">{description}</p>
    </div>
    <button 
      onClick={onChange}
      className={`w-12 h-6 rounded-full relative transition-colors duration-300 ${enabled ? 'bg-indigo-600' : 'bg-[#2d323b]'}`}
    >
      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 ${enabled ? 'translate-x-7' : 'translate-x-1'}`}></div>
    </button>
  </div>
);

const Settings = () => {
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
  const isRoot = currentUser.adminRole === 'root' || currentUser.email === 'gnandeep.venigalla@paywiseapp.com';

  const [toggles, setToggles] = useState({
    tfa: true,
    maintenance: false,
    shadowMode: true,
    expFee: false
  });

  const [message, setMessage] = useState('');

  const auditLogs = [
    { id: 1, time: '10:42 AM', admin: 'System Admin', action: 'Modified System Settings' },
    { id: 2, time: 'Yesterday', admin: 'Root', action: 'Toggled Maintenance Mode OFF' },
  ];

  const handleApply = () => {
     setMessage('Settings successfully updated.');
     setTimeout(() => setMessage(''), 3000);
  };

  return (
    <div className="max-w-5xl space-y-6 pb-20 animate-in fade-in duration-500 mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-6">
         <div>
            <h1 className="text-2xl font-bold text-white mb-2">Platform Settings</h1>
            <p className="text-slate-400 text-sm">Configure core backend toggles and flags.</p>
         </div>
      </div>

      {message && (
        <div className="bg-emerald-600/10 border border-emerald-500/30 px-6 py-4 rounded-xl flex items-center text-emerald-500 font-medium shadow-sm animate-in fade-in">
          <span className="text-sm">{message}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <section className="bg-[#1e232b] border border-[#2d323b] rounded-2xl shadow-sm overflow-hidden">
            <div className="p-6 border-b border-[#2d323b] bg-[#171a21]/50 flex items-center gap-3">
              <Shield className="w-5 h-5 text-indigo-500" />
              <h2 className="text-lg font-semibold text-white">Access Control</h2>
            </div>
            <div className="p-6">
              <SettingToggle 
                title="Strict Domain Validation" 
                description="Enforce @paywiseapp.com for all management nodes" 
                enabled={true} 
                onChange={() => {}}
              />
              <SettingToggle 
                title="Developer Mode" 
                description="Expose extra telemetry across the application" 
                enabled={toggles.tfa} 
                onChange={() => setToggles({...toggles, tfa: !toggles.tfa})}
              />
            </div>
          </section>

          <section className="bg-[#1e232b] border border-[#2d323b] rounded-2xl shadow-sm overflow-hidden">
            <div className="p-6 border-b border-[#2d323b] bg-[#171a21]/50 flex items-center gap-3">
              <HardDrive className="w-5 h-5 text-emerald-500" />
              <h2 className="text-lg font-semibold text-white">System Storage</h2>
            </div>
            <div className="p-6 space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Log Capacity Limit</label>
                <select className="w-full px-4 py-2.5 bg-[#171a21] border border-[#2d323b] rounded-lg text-white text-sm focus:outline-none focus:border-indigo-500 transition-colors appearance-none">
                   <option>Standard (30 Days)</option>
                   <option>Extended (90 Days)</option>
                </select>
              </div>
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <section className="bg-[#1e232b] border border-[#2d323b] rounded-2xl shadow-sm overflow-hidden">
            <div className="p-6 border-b border-[#2d323b] bg-[#171a21]/50 flex items-center gap-3">
              <Zap className="w-5 h-5 text-amber-500" />
              <h2 className="text-lg font-semibold text-white">System Status</h2>
            </div>
            <div className="p-6 space-y-6">
               <div className="bg-[#171a21] border border-[#2d323b] rounded-xl p-4">
                  <div className="flex justify-between items-center text-sm font-medium mb-3">
                     <span className="text-slate-400">Database Uptime</span>
                     <span className="text-emerald-500">100.00%</span>
                  </div>
                  <div className="flex gap-1 h-6">
                     {[...Array(24)].map((_, i) => (
                        <div key={i} className="flex-1 bg-emerald-500/20 border border-emerald-500/10 rounded-sm"></div>
                     ))}
                  </div>
               </div>
               
               <SettingToggle 
                 title="Maintenance Mode" 
                 description="Display maintenance banner on client apps" 
                 enabled={toggles.maintenance} 
                 onChange={() => setToggles({...toggles, maintenance: !toggles.maintenance})}
               />
            </div>
          </section>

          <section className="bg-[#1e232b] border border-[#2d323b] rounded-2xl shadow-sm overflow-hidden">
            <div className="p-6 border-b border-[#2d323b] bg-[#171a21]/50 flex items-center gap-3">
              <Rocket className="w-5 h-5 text-fuchsia-500" />
              <h2 className="text-lg font-semibold text-white">Feature Flags</h2>
            </div>
            <div className="p-6">
              <SettingToggle 
                title="Shadow Deployment" 
                description="Deploy A/B tests to a 5% sample cohort" 
                enabled={toggles.shadowMode} 
                onChange={() => setToggles({...toggles, shadowMode: !toggles.shadowMode})}
              />
              <SettingToggle 
                title="Experimental Fees" 
                description="Test new fee algorithms" 
                enabled={toggles.expFee} 
                onChange={() => setToggles({...toggles, expFee: !toggles.expFee})}
              />
            </div>
          </section>

          <div className="bg-[#1e232b] border border-indigo-500/30 rounded-2xl p-6 flex items-center justify-between shadow-sm">
             <div>
                <p className="text-white font-semibold text-sm">Unsaved Changes</p>
                <p className="text-sm text-slate-400">Review config before applying.</p>
             </div>
             <button onClick={handleApply} className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors">
                Apply Settings
             </button>
          </div>
        </div>
      </div>
      
      {/* Root Access Controls */}
      {isRoot && (
        <section className="bg-rose-950/20 border border-rose-500/30 rounded-2xl shadow-sm overflow-hidden mt-6">
          <div className="p-6 border-b border-rose-500/20 flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-rose-500" />
            <div>
              <h2 className="text-lg font-semibold text-rose-500">Danger Zone</h2>
              <p className="text-sm text-rose-500/70">Irreversible administrative actions.</p>
            </div>
          </div>
          <div className="p-6 flex items-center justify-between">
            <div>
               <p className="text-sm font-semibold text-white">Execute Full Database Wipe</p>
               <p className="text-sm text-slate-400 mt-1">This will permanently destroy all records.</p>
            </div>
            <button 
               onClick={() => { if(window.confirm('CRITICAL WARNING: This will permanently wipe the entire backend. Type "CONFIRM" to proceed.') && prompt('Type CONFIRM')==='CONFIRM') alert('Database Wipe Initiated.'); }}
               className="px-6 py-2 bg-rose-600 text-white rounded-lg text-sm font-medium hover:bg-rose-700 transition-colors"
            >
               Wipe Database
            </button>
          </div>
        </section>
      )}

      {/* Admin Audit Trail */}
      {isRoot && (
      <section className="bg-[#1e232b] border border-[#2d323b] rounded-2xl shadow-sm overflow-hidden mt-6">
        <div className="p-6 border-b border-[#2d323b] bg-[#171a21]/50 flex items-center gap-3">
          <History className="w-5 h-5 text-amber-500" />
          <h2 className="text-lg font-semibold text-white">System Audit Log</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-[#1e232b] border-b border-[#2d323b]">
              <tr>
                <th className="px-6 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Time</th>
                <th className="px-6 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Admin</th>
                <th className="px-6 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Action Executed</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2d323b] bg-[#1e232b]">
               {auditLogs.map(log => (
                  <tr key={log.id} className="hover:bg-[#171a21]/50 transition-colors">
                     <td className="px-6 py-4 text-sm text-slate-400 whitespace-nowrap">{log.time}</td>
                     <td className="px-6 py-4 text-sm font-medium text-slate-200">{log.admin}</td>
                     <td className="px-6 py-4 text-sm text-slate-300">{log.action}</td>
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
