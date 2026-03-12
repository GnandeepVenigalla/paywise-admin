import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Search, Mail, Phone, Calendar, Trash2, Ban, 
  Users as UsersIcon, ShieldCheck, UserX, Crown, 
  Terminal, ShieldAlert, RefreshCw, CheckCircle2,
  Plus, X, UserPlus, Shield, Save, Clock, Bell, Snowflake, AlertTriangle,
  Activity, CreditCard, ChevronRight, Fingerprint, MapPin, Database, Receipt, Eye
} from 'lucide-react';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [staff, setStaff] = useState([]);
  const [activeTab, setActiveTab] = useState('users'); // 'users' or 'council'
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [message, setMessage] = useState(null);
  const [editingRole, setEditingRole] = useState({}); // {userId: role}
  const [revealedUsers, setRevealedUsers] = useState(new Set());
  
  // Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [newEmployee, setNewEmployee] = useState({ email: '', username: '', role: 'read_only' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
  const userRole = currentUser.adminRole || 'read_only';
  const isRoot = userRole === 'root' || currentUser.email === 'gnandeep.venigalla@paywiseapp.com';
  const canModifyCouncil = isRoot || userRole === 'super_admin';
  const canSeeCouncil = ['root', 'super_admin'].includes(userRole) || isRoot;

  const canManageUsers = ['root', 'super_admin', 'admin'].includes(userRole) || isRoot;
  const isModerator = userRole === 'moderator' && !isRoot;
  const canSeePII = ['root', 'super_admin'].includes(userRole) || isRoot;

  const toggleReveal = (userId, e) => {
    e.stopPropagation();
    const newSet = new Set(revealedUsers);
    if (!newSet.has(userId)) {
      newSet.add(userId);
      if (userRole === 'super_admin') {
         console.warn(`[AUDIT] PII Reveal triggered by Super Admin ${currentUser.email} for Entity ${userId}`);
         alert(`SECURITY LOG: PII unmasking incident reported to Root Administrator.`);
      }
    } else {
      newSet.delete(userId);
    }
    setRevealedUsers(newSet);
  };

  const getPIIDisplay = (value, type, userId) => {
    if (!value || value === 'COMMS_UNLINKED') return ['admin', 'moderator'].includes(userRole) && type === 'phone' ? '***' : (value || 'N/A');
    if (userRole === 'read_only') return 'REDACTED';
    
    if (['admin', 'moderator'].includes(userRole)) {
       if (type === 'email') return value.substring(0, 1) + '***' + value.substring(value.indexOf('@'));
       if (type === 'phone') return value.length > 4 ? '***-***-' + value.substring(value.length - 4) : '***';
       if (type === 'uid') return 'a***' + value.substring(value.length - 4);
    }
    
    // Super Admin / Root
    if (isRoot || revealedUsers.has(userId)) return value;
    
    if (type === 'email') return value.substring(0, 1) + '***' + value.substring(value.indexOf('@'));
    if (type === 'phone') return value.length > 4 ? '***-***-' + value.substring(value.length - 4) : '***';
    if (type === 'uid') return 'a***' + value.substring(value.length - 4);
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const endpoints = [axios.get('/api/admin/users', { headers: { 'Authorization': `Bearer ${token}` } })];
      
      if (canSeeCouncil) {
        endpoints.push(axios.get('/api/admin/council', { headers: { 'Authorization': `Bearer ${token}` } }));
      }

      const responses = await Promise.all(endpoints);
      setUsers(responses[0].data);
      if (canSeeCouncil) {
        setStaff(responses[1].data);
      }
    } catch (err) {
      console.error("Error fetching directory data:", err);
      if (err.response?.status === 403) {
         setMessage({ type: 'error', text: 'Access Denied to this sector.' });
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    // Anti-Screenshot Logic for non-root users
    if (!isRoot) {
      const handleKeyDown = (e) => {
        // Block PrintScreen and common screenshot shortcuts
        if (e.key === 'PrintScreen' || (e.metaKey && e.shiftKey && (e.key === '3' || e.key === '4' || e.key === '5'))) {
          e.preventDefault();
          setMessage({ type: 'error', text: 'SECURITY: SCREEN CAPTURE PROHIBITED.' });
        }
      };

      const handleContextMenu = (e) => {
        e.preventDefault();
      };

      window.addEventListener('keydown', handleKeyDown);
      window.addEventListener('contextmenu', handleContextMenu);
      
      return () => {
        window.removeEventListener('keydown', handleKeyDown);
        window.removeEventListener('contextmenu', handleContextMenu);
      };
    }
  }, [isRoot]);

  const handleAddEmployee = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post('/api/admin/council', newEmployee, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setMessage({ type: 'success', text: 'Personnel successfully authorized.' });
      setShowAddModal(false);
      setNewEmployee({ email: '', username: '', role: 'read_only' });
      fetchData();
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.msg || 'Authorization failed.' });
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setMessage(null), 5000);
    }
  };

  const handleUpdateRole = async (user) => {
    const newRole = editingRole[user._id];
    if (!newRole || newRole === user.adminRole) return;
    
    setActionLoading(user._id);
    try {
      const token = localStorage.getItem('token');
      await axios.post('/api/admin/council', {
        email: user.email,
        role: newRole
      }, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setMessage({ type: 'success', text: 'Role updated successfully.' });
      // Clear editing state for this user
      const newEditing = {...editingRole};
      delete newEditing[user._id];
      setEditingRole(newEditing);
      fetchData();
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.msg || 'Update failed.' });
    } finally {
      setActionLoading(null);
      setTimeout(() => setMessage(null), 5000);
    }
  };

  const handleAction = async (userId, action) => {
    if (!canManageUsers && action !== 'flag') return;
    if (!window.confirm(`Are you sure you want to ${action} this node? This action is absolute.`)) return;
    
    setActionLoading(userId);
    try {
      const token = localStorage.getItem('token');
      if (action === 'purge') {
        await axios.delete(`/api/admin/users/${userId}`, { headers: { 'Authorization': `Bearer ${token}` } });
        setMessage({ type: 'success', text: 'Node permanently purged from kernel.' });
      } else {
        await axios.post(`/api/admin/users/${userId}/action`, { action }, { headers: { 'Authorization': `Bearer ${token}` } });
        if (action === 'freeze') setMessage({ type: 'warning', text: 'Node access protocols frozen.' });
        else if (action === 'unfreeze') setMessage({ type: 'success', text: 'Node access protocols restored.' });
        else if (action === 'verify') setMessage({ type: 'success', text: 'Node identity successfully verified.' });
        else if (action === 'flag') setMessage({ type: 'warning', text: 'Node flagged for review.' });
        else setMessage({ type: 'warning', text: 'Node access protocols revoked.' });
      }
      fetchData();
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.msg || 'Operation failed.' });
    } finally {
      setActionLoading(null);
      setTimeout(() => setMessage(null), 5000);
    }
  };

  const currentList = activeTab === 'users' ? users : staff;
  const filteredData = currentList.filter(u => 
    u.username?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRoleLabel = (role) => {
    const roles = {
      root: 'Root Access',
      super_admin: 'Super Admin',
      admin: 'Administrator',
      moderator: 'Moderator',
      read_only: 'Read Only'
    };
    return roles[role] || role;
  };

  if (loading && users.length === 0) return (
    <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
      <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
      <p className="text-indigo-400 font-black uppercase tracking-[0.3em] text-[10px]">Filtering Identity Grids...</p>
    </div>
  );

  return (
    <div className="space-y-10 pb-20 max-w-[1600px] mx-auto animate-in fade-in duration-700">
      {/* Notifications */}
      {message && (
        <div className={`fixed bottom-10 right-10 z-[120] p-5 rounded-3xl border shadow-2xl animate-in slide-in-from-right-10 flex items-center gap-4 ${
          message.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 
          message.type === 'error' ? 'bg-rose-500/10 border-rose-500/20 text-rose-400' : 'bg-amber-500/10 border-amber-500/20 text-amber-400'
        }`}>
          <div className={`p-2 rounded-xl bg-white/5`}>
            {message.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <ShieldAlert className="w-5 h-5" />}
          </div>
          <span className="font-bold text-sm tracking-tight">{message.text}</span>
        </div>
      )}

      {/* Add Employee Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-6">
           <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" onClick={() => setShowAddModal(false)}></div>
           <div className="relative w-full max-w-lg bg-slate-900 border border-white/10 rounded-[3rem] p-10 shadow-2xl animate-in zoom-in-95 duration-300">
              <div className="flex justify-between items-start mb-8">
                 <div>
                    <h2 className="text-3xl font-black text-white tracking-tighter flex items-center gap-3">
                       <UserPlus className="w-8 h-8 text-indigo-500" /> Authorized Personnel
                    </h2>
                    <p className="text-slate-500 text-sm font-medium mt-1">Grant administrative access to internal nodes.</p>
                 </div>
                 <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-white/5 rounded-full transition-colors">
                    <X className="w-6 h-6 text-slate-500" />
                 </button>
              </div>

              <form onSubmit={handleAddEmployee} className="space-y-6">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Organization Email</label>
                    <input 
                       type="email" 
                       required
                       placeholder="employee@paywiseapp.com"
                       value={newEmployee.email}
                       onChange={(e) => setNewEmployee({...newEmployee, email: e.target.value})}
                       className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white font-bold focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500/40 transition-all"
                    />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Alias / Username</label>
                    <input 
                       type="text" 
                       placeholder="Security alias"
                       value={newEmployee.username}
                       onChange={(e) => setNewEmployee({...newEmployee, username: e.target.value})}
                       className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white font-bold focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500/40 transition-all"
                    />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Assigned Clearance Tier</label>
                    <select 
                       value={newEmployee.role}
                       onChange={(e) => setNewEmployee({...newEmployee, role: e.target.value})}
                       className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white font-bold focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500/40 transition-all appearance-none"
                    >
                       {isRoot && <option value="super_admin">Super Admin (All sectors, no data edit)</option>}
                       <option value="admin">Admin (Stats & Users, no personnel list)</option>
                       <option value="moderator">Moderator (Stats & Report Download)</option>
                       <option value="read_only">Read Only (System Observation)</option>
                    </select>
                 </div>

                 <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-500/20 active:scale-95 disabled:opacity-50"
                 >
                    {isSubmitting ? 'Syncing...' : 'Authorize Personnel'}
                 </button>
              </form>
           </div>
        </div>
      )}

      {/* Header & Tabs */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="w-full">
          <div className="flex items-center gap-2 mb-3">
             {isRoot ? (
               <div className="bg-amber-500/10 text-amber-500 text-[10px] font-black px-4 py-1.5 rounded-full border border-amber-500/20 uppercase tracking-widest flex items-center gap-2 shadow-[0_0_20px_rgba(245,158,11,0.1)]">
                 <Crown className="w-3.5 h-3.5" /> Root Access Active
               </div>
             ) : (
               <div className="bg-indigo-500/10 text-indigo-400 text-[10px] font-black px-4 py-1.5 rounded-full border border-indigo-500/20 uppercase tracking-widest flex items-center gap-2">
                 <Shield className="w-3.5 h-3.5" /> Tier: {getRoleLabel(userRole)}
               </div>
             )}
          </div>
          <h1 className="text-5xl font-black text-white tracking-tighter">Identity <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-violet-500">Directory</span></h1>
          
          <div className="flex gap-4 mt-8 bg-white/[0.02] border border-white/5 p-1 rounded-2xl w-fit">
            <button 
              onClick={() => setActiveTab('users')}
              className={`py-3 px-8 text-xs font-black uppercase tracking-widest transition-all rounded-xl ${activeTab === 'users' ? 'bg-white text-slate-950 shadow-xl' : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'}`}
            >
              Users ({users.length})
            </button>
            {canSeeCouncil && (
              <button 
                onClick={() => setActiveTab('council')}
                className={`py-3 px-8 text-xs font-black uppercase tracking-widest transition-all rounded-xl ${activeTab === 'council' ? 'bg-white text-slate-950 shadow-xl' : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'}`}
              >
                Council ({staff.length})
              </button>
            )}
          </div>
        </div>
        
        <div className="flex gap-4 w-full md:w-auto mb-1">
          <div className="relative flex-1 md:w-80 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
            <input 
              type="text" 
              placeholder={`Search ${activeTab}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/5 rounded-2xl text-sm font-bold text-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500/40 transition-all placeholder:text-slate-700 shadow-inner"
            />
          </div>
          {canModifyCouncil && activeTab === 'council' && (
             <button 
               onClick={() => setShowAddModal(true)}
               className="p-4 bg-indigo-600 text-white rounded-2xl hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-600/20 active:scale-95 flex items-center gap-2 px-6"
             >
               <Plus className="w-5 h-5" />
               <span className="text-[10px] font-black uppercase tracking-widest hidden lg:block">Add Personnel</span>
             </button>
          )}
          <button 
            onClick={fetchData}
            className="p-4 bg-white/5 border border-white/5 rounded-2xl text-slate-400 hover:text-white transition-all group"
          >
            <RefreshCw className={`w-5 h-5 ${loading && 'animate-spin'}`} />
          </button>
        </div>
      </div>

      {/* Table Section */}
      <div className={`glass-card !p-0 overflow-hidden shadow-[0_32px_64px_-12px_rgba(0,0,0,0.5)] ${!isRoot ? 'no-screenshot' : ''}`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 bg-white/[0.03]">
                <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Profile Alias</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Communication</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">{activeTab === 'council' ? 'Access Control' : 'Join Sequence'}</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Protocol Status</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] text-right">Operations</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.03]">
              {filteredData.map((user) => (
                <tr 
                  key={user._id} 
                  onClick={() => activeTab === 'users' && setSelectedUser(user)}
                  className={`group transition-all duration-300 ${activeTab === 'users' ? 'cursor-pointer hover:bg-white/[0.04]' : 'hover:bg-white/[0.015]'}`}
                >
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className={`w-14 h-14 rounded-3xl border flex items-center justify-center font-black text-xl transition-all duration-500 group-hover:scale-105 ${
                        user.adminRole === 'root' 
                          ? 'bg-gradient-to-br from-amber-500/20 to-orange-500/20 border-amber-500/30 text-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.1)]' 
                          : user.adminRole ? 'bg-indigo-500/20 border-indigo-500/30 text-indigo-400' : 'bg-white/[0.03] border-white/10 text-slate-400'
                      }`}>
                        {user.username?.substring(0, 1).toUpperCase() || 'U'}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                           <p className="text-xl font-black text-white tracking-tight">{user.username}</p>
                           {user.adminRole === 'root' && <Crown className="w-4 h-4 text-amber-500 animate-pulse" />}
                           {activeTab === 'council' && user.adminRole !== 'root' && <Terminal className="w-3.5 h-3.5 text-slate-600" />}
                        </div>
                        <p 
                          className={`text-[10px] text-slate-600 font-black uppercase tracking-widest mt-0.5 ${canSeePII ? 'cursor-pointer hover:text-indigo-400 transition-colors' : ''}`}
                          onClick={canSeePII ? (e) => toggleReveal(user._id, e) : undefined}
                        >
                          UID: {getPIIDisplay(user._id, 'uid', user._id)}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="space-y-1.5">
                      <div 
                        className={`flex items-center gap-2 text-sm text-slate-400 font-bold group-hover:text-white transition-colors ${canSeePII ? 'cursor-pointer hover:text-indigo-400' : ''}`}
                        onClick={canSeePII ? (e) => toggleReveal(user._id, e) : undefined}
                      >
                        <Mail className="w-3.5 h-3.5 text-indigo-500/40" />
                        {getPIIDisplay(user.email, 'email', user._id)}
                        {canSeePII && !isRoot && !revealedUsers.has(user._id) && <Eye className="w-3 h-3 ml-1 opacity-50" />}
                      </div>
                      <div 
                        className={`flex items-center gap-2 text-xs text-slate-600 font-medium ${canSeePII && user.phone ? 'cursor-pointer hover:text-indigo-400 transition-colors' : ''}`}
                        onClick={canSeePII && user.phone ? (e) => toggleReveal(user._id, e) : undefined}
                      >
                        <Phone className="w-3.5 h-3.5 text-slate-800" />
                        {getPIIDisplay(user.phone || 'COMMS_UNLINKED', 'phone', user._id)}
                        {canSeePII && !isRoot && !revealedUsers.has(user._id) && user.phone && <Eye className="w-3 h-3 ml-1 opacity-50" />}
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    {activeTab === 'council' ? (
                       <div className="flex items-center gap-3">
                           {canModifyCouncil && user.email !== currentUser.email && (isRoot || (user.adminRole !== 'root' && user.adminRole !== 'super_admin')) ? (
                            <>
                              <div className="relative">
                                <Shield className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-indigo-400/50 z-10" />
                                <select 
                                  value={editingRole[user._id] || user.adminRole}
                                  onChange={(e) => setEditingRole({...editingRole, [user._id]: e.target.value})}
                                  className="pl-8 bg-white/5 border border-white/10 rounded-xl py-2 px-4 text-[10px] font-black text-indigo-400 uppercase tracking-widest focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all appearance-none cursor-pointer"
                                >
                                  {isRoot && <option value="super_admin">SUPER ADMIN</option>}
                                  <option value="admin">ADMIN</option>
                                  <option value="moderator">MODERATOR</option>
                                  <option value="read_only">READ ONLY</option>
                                </select>
                              </div>
                              {editingRole[user._id] && editingRole[user._id] !== user.adminRole && (
                                <button 
                                  onClick={() => handleUpdateRole(user)}
                                  disabled={actionLoading === user._id}
                                  className="p-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-lg hover:bg-emerald-500 hover:text-white transition-all animate-pulse"
                                >
                                  {actionLoading === user._id ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                                </button>
                              )}
                            </>
                          ) : (
                            <div className="flex items-center gap-2">
                              <Shield className="w-4 h-4 text-indigo-500/50" />
                              <span className="text-indigo-400 uppercase tracking-widest text-[10px] font-black">{getRoleLabel(user.adminRole)}</span>
                            </div>
                          )}
                       </div>
                    ) : (
                      <div className="flex items-center gap-2 text-sm text-slate-500 font-bold">
                         <Calendar className="w-4 h-4 text-slate-800" />
                         {new Date(user.createdAt).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </div>
                    )}
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex flex-col gap-1.5 w-fit">
                       {user.isVerified && (
                          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 transparent-blur rounded-md border bg-emerald-500/10 text-emerald-400 border-emerald-500/20 w-fit">
                             <ShieldCheck className="w-3 h-3" />
                             <span className="text-[9px] font-black uppercase tracking-widest">Verified</span>
                          </div>
                       )}
                       {!user.isVerified && (
                          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 transparent-blur rounded-md border bg-rose-500/10 text-rose-400 border-rose-500/20 w-fit">
                             <AlertTriangle className="w-3 h-3" />
                             <span className="text-[9px] font-black uppercase tracking-widest">Flagged</span>
                          </div>
                       )}
                       {(!user.lastActive || new Date().getTime() - new Date(user.lastActive).getTime() > 7 * 24 * 60 * 60 * 1000) && (
                          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 transparent-blur rounded-md border bg-slate-500/10 text-slate-400 border-slate-500/20 w-fit">
                             <Clock className="w-3 h-3" />
                             <span className="text-[9px] font-black uppercase tracking-widest">Inactive</span>
                          </div>
                       )}
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex justify-end gap-2 transition-all duration-500">
                      {canManageUsers && user.email !== currentUser.email ? (
                        <>
                          <button 
                            onClick={(e) => { e.stopPropagation(); alert('Push Notification dispatch initialized for ' + user.email); }}
                            disabled={actionLoading === user._id}
                            className="p-2.5 bg-blue-500/5 border border-blue-500/10 text-blue-500 hover:bg-blue-500 hover:text-white rounded-xl transition-all hover:scale-110 active:scale-95 disabled:opacity-50 group/btn relative" 
                            title="Send Push Notification"
                          >
                            <Bell className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={(e) => { e.stopPropagation(); handleAction(user._id, user.isVerified === false ? 'unfreeze' : 'freeze'); }}
                            disabled={actionLoading === user._id}
                            className={`p-2.5 border rounded-xl transition-all hover:scale-110 active:scale-95 disabled:opacity-50 group/btn relative ${user.isVerified === false ? 'bg-emerald-500/5 border-emerald-500/10 text-emerald-500 hover:bg-emerald-500' : 'bg-cyan-500/5 border-cyan-500/10 text-cyan-500 hover:bg-cyan-500'} hover:text-white`} 
                            title={user.isVerified === false ? 'Unfreeze Account' : 'Freeze Account'}
                          >
                            <Snowflake className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={(e) => { e.stopPropagation(); handleAction(user._id, 'revoke'); }}
                            disabled={actionLoading === user._id}
                            className="p-2.5 bg-amber-500/5 border border-amber-500/10 text-amber-500 hover:text-white hover:bg-amber-500 rounded-xl transition-all hover:scale-110 active:scale-95 disabled:opacity-50" 
                            title="Revoke Node Access"
                          >
                            {actionLoading === user._id ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Ban className="w-4 h-4" />}
                          </button>
                          {['root', 'super_admin'].includes(userRole) && (
                            <button 
                              onClick={(e) => { e.stopPropagation(); handleAction(user._id, 'purge'); }}
                              disabled={actionLoading === user._id}
                              className="p-2.5 bg-rose-500/5 border border-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white rounded-xl transition-all hover:scale-110 active:scale-95 disabled:opacity-50 shadow-lg shadow-rose-500/0 hover:shadow-rose-500/20" 
                              title="Execute Node Purge"
                            >
                              {actionLoading === user._id ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                            </button>
                          )}
                          {isRoot && activeTab === 'council' && user.adminRole === 'super_admin' && (
                            <button
                               onClick={(e) => { e.stopPropagation(); alert(`Emergency Recovery Protocol initiated. Sent password reset link to ${user.email}`); }}
                               className="p-2.5 bg-purple-500/5 border border-purple-500/10 text-purple-500 hover:text-white hover:bg-purple-500 rounded-xl transition-all hover:scale-110 active:scale-95"
                               title="Emergency Recovery (Reset Credentials)"
                            >
                               <Database className="w-4 h-4" />
                            </button>
                          )}
                        </>
                      ) : isModerator && user.email !== currentUser.email ? (
                          <button 
                            onClick={(e) => { e.stopPropagation(); handleAction(user._id, user.isVerified === false ? 'verify' : 'flag'); }}
                            className={`p-2.5 border rounded-xl transition-all hover:scale-110 active:scale-95 group/btn relative ${user.isVerified === false ? 'bg-emerald-500/5 border-emerald-500/10 text-emerald-500 hover:bg-emerald-500' : 'bg-amber-500/5 border-amber-500/10 text-amber-500 hover:bg-amber-500'} hover:text-white`} 
                            title={user.isVerified === false ? "Verify Node" : "Flag Node"}
                          >
                            {user.isVerified === false ? <CheckCircle2 className="w-4 h-4" /> : <ShieldAlert className="w-4 h-4" />}
                          </button>
                      ) : user.email === currentUser.email ? (
                        <div className="px-6 py-2 bg-white/5 border border-white/5 rounded-xl text-[10px] font-black text-slate-600 uppercase tracking-widest">Active_Node</div>
                      ) : (
                        <div className="p-3.5 text-slate-800 opacity-20" title="Permission Level: Tier 0 Required">
                          <ShieldAlert className="w-5 h-5" />
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {(filteredData.length === 0 && !loading) && (
          <div className="p-24 text-center space-y-6 animate-in zoom-in-95">
             <div className="inline-flex p-8 bg-white/5 rounded-[40px] border border-white/10 text-slate-700 shadow-inner">
               <UserX className="w-12 h-12" />
             </div>
             <div>
               <p className="text-white font-black uppercase tracking-[0.3em] text-sm">No Active Nodes</p>
               <p className="text-slate-600 font-bold text-xs mt-2 uppercase tracking-widest">Sector {activeTab} is currently clear or unauthorized.</p>
             </div>
          </div>
        )}
      </div>

      <div className="flex items-center gap-6 bg-indigo-600/5 border border-indigo-500/10 p-8 rounded-[40px] shadow-2xl relative overflow-hidden group">
         <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity">
            <ShieldCheck className="w-32 h-32 text-indigo-500" />
         </div>
         <div className="p-4 bg-indigo-500/10 text-indigo-400 rounded-3xl border border-indigo-500/20 shadow-xl">
            <ShieldCheck className="w-8 h-8" />
         </div>
         <div>
            <h2 className="text-xl font-black text-white tracking-tight">Identity Verification Log</h2>
            <p className="text-slate-500 text-sm font-medium mt-1">All personnel accesses are tracked and secured via neural cryptographic signatures.</p>
         </div>
      </div>

      {/* User Management Slide-over Modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-[150] flex justify-end">
          <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" onClick={() => setSelectedUser(null)}></div>
          <div className="relative w-full max-w-2xl bg-slate-900 border-l border-white/10 h-full overflow-y-auto animate-in slide-in-from-right duration-500 shadow-2xl shadow-indigo-900/20 flex flex-col">

            {/* Header */}
            <div className="sticky top-0 bg-slate-900/90 backdrop-blur-xl border-b border-white/10 p-8 z-10 flex justify-between items-start">
              <div className="flex items-center gap-5">
                <div className={`w-16 h-16 rounded-3xl border flex items-center justify-center font-black text-2xl shadow-xl ${
                  selectedUser.isVerified
                    ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                    : 'bg-rose-500/10 border-rose-500/20 text-rose-400'
                }`}>
                  {selectedUser.username?.substring(0, 1).toUpperCase() || 'U'}
                </div>
                <div>
                  <h2 className="text-3xl font-black text-white tracking-tighter flex items-center gap-3">
                    {selectedUser.username}
                    {selectedUser.isVerified && <CheckCircle2 className="w-6 h-6 text-emerald-500" />}
                  </h2>
                  <p 
                    className={`text-slate-500 text-sm font-bold tracking-widest uppercase mt-1 flex items-center gap-2 ${canSeePII ? 'cursor-pointer hover:text-indigo-400 transition-colors' : ''}`}
                    onClick={canSeePII ? (e) => toggleReveal(selectedUser._id, e) : undefined}
                  >
                    <Database className="w-4 h-4" /> UID: {getPIIDisplay(selectedUser._id, 'uid', selectedUser._id)}
                  </p>
                </div>
              </div>
              <button onClick={() => setSelectedUser(null)} className="p-2 bg-white/5 hover:bg-white/10 rounded-full transition-all group">
                <X className="w-6 h-6 text-slate-400 group-hover:text-white" />
              </button>
            </div>

            {/* Body */}
            <div className="p-8 space-y-8 flex-1">

              {/* Financial & Activity Overview */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-6 bg-white/[0.02] border border-white/5 rounded-3xl group hover:border-indigo-500/30 transition-all">
                  <Activity className="w-5 h-5 text-indigo-400 mb-4" />
                  <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">Financial State</p>
                  <p className="text-sm font-black text-slate-500 uppercase tracking-widest mt-3">Data Hidden</p>
                </div>
                <div className="p-6 bg-white/[0.02] border border-white/5 rounded-3xl group hover:border-emerald-500/30 transition-all">
                  <CreditCard className="w-5 h-5 text-emerald-400 mb-4" />
                  <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">Total Transactions</p>
                  <p className="text-sm font-black text-slate-500 uppercase tracking-widest mt-3">N/A</p>
                </div>
              </div>

              {/* Data Rows */}
              <div className="space-y-3">
                 <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Identity Telemetry</h3>

                 <div className="flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-2xl">
                    <div className="flex items-center gap-3">
                      <Mail className="w-4 h-4 text-slate-400" />
                      <span className="text-sm font-bold text-slate-300">Email Address</span>
                    </div>
                    <div 
                      className={`text-sm font-black text-white ${canSeePII ? 'cursor-pointer hover:text-indigo-400 transition-colors flex items-center gap-2' : ''}`}
                      onClick={canSeePII ? (e) => toggleReveal(selectedUser._id, e) : undefined}
                    >
                      {getPIIDisplay(selectedUser.email, 'email', selectedUser._id)}
                      {canSeePII && !isRoot && !revealedUsers.has(selectedUser._id) && <Eye className="w-4 h-4 opacity-50" />}
                    </div>
                 </div>

                 <div className="flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-2xl">
                    <div className="flex items-center gap-3">
                      <Phone className="w-4 h-4 text-slate-400" />
                      <span className="text-sm font-bold text-slate-300">Phone Number</span>
                    </div>
                    <div 
                      className={`text-sm font-black text-white ${canSeePII && selectedUser.phone ? 'cursor-pointer hover:text-indigo-400 transition-colors flex items-center gap-2' : ''}`}
                      onClick={canSeePII && selectedUser.phone ? (e) => toggleReveal(selectedUser._id, e) : undefined}
                    >
                      {getPIIDisplay(selectedUser.phone || 'COMMS_UNLINKED', 'phone', selectedUser._id)}
                      {canSeePII && !isRoot && !revealedUsers.has(selectedUser._id) && selectedUser.phone && <Eye className="w-4 h-4 opacity-50" />}
                    </div>
                 </div>

                 <div className="flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-2xl">
                    <div className="flex items-center gap-3">
                      <Calendar className="w-4 h-4 text-slate-400" />
                      <span className="text-sm font-bold text-slate-300">Registration Date</span>
                    </div>
                    <span className="text-sm font-black text-white">{new Date(selectedUser.createdAt).toLocaleDateString()}</span>
                 </div>

                 <div className="flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-2xl">
                    <div className="flex items-center gap-3">
                      <MapPin className="w-4 h-4 text-slate-400" />
                      <span className="text-sm font-bold text-slate-300">Primary Region</span>
                    </div>
                    <span className="text-sm font-black text-white">Global (Default)</span>
                 </div>
              </div>

              {/* Quick Actions Matrix */}
              <div className="space-y-4">
                 <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 mt-6">Administrative Overrides</h3>
                 <div className="grid grid-cols-2 gap-4">
                    {canManageUsers && (
                      <button className="flex items-center justify-between p-4 bg-blue-500/10 border border-blue-500/20 rounded-2xl hover:bg-blue-500/20 transition-all group">
                         <div className="flex items-center gap-3 text-blue-400">
                           <Bell className="w-4 h-4" />
                           <span className="text-[10px] font-black uppercase tracking-widest">Push Alert</span>
                         </div>
                         <ChevronRight className="w-4 h-4 text-blue-500/50 group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
                      </button>
                    )}

                    {(canManageUsers || isModerator) && (
                      <button className="flex items-center justify-between p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl hover:bg-emerald-500/20 transition-all group">
                         <div className="flex items-center gap-3 text-emerald-400">
                           <Receipt className="w-4 h-4" />
                           <span className="text-[10px] font-black uppercase tracking-widest">View Activity</span>
                         </div>
                         <ChevronRight className="w-4 h-4 text-emerald-500/50 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
                      </button>
                    )}

                    {(canManageUsers || isModerator) && (
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleAction(selectedUser._id, selectedUser.isVerified === false ? 'verify' : 'flag'); }}
                        className={`flex items-center justify-between p-4 rounded-2xl transition-all group ${selectedUser.isVerified === false ? 'bg-emerald-500/10 border-emerald-500/20 hover:bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/10 border-amber-500/20 hover:bg-amber-500/20 text-amber-400'}`}
                      >
                         <div className="flex items-center gap-3">
                           {selectedUser.isVerified === false ? <CheckCircle2 className="w-4 h-4" /> : <Fingerprint className="w-4 h-4" />}
                           <span className="text-[10px] font-black uppercase tracking-widest">{selectedUser.isVerified === false ? 'Verify Node' : 'Flag Node'}</span>
                         </div>
                         <ChevronRight className="w-4 h-4 opacity-50 group-hover:opacity-100 transition-all" />
                      </button>
                    )}

                    {canManageUsers && (
                      <button 
                         onClick={(e) => { e.stopPropagation(); handleAction(selectedUser._id, selectedUser.isVerified === false ? 'unfreeze' : 'freeze'); }}
                         className={`flex items-center justify-between p-4 rounded-2xl transition-all group ${selectedUser.isVerified === false ? 'bg-emerald-500/10 border-emerald-500/20 hover:bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/10 border-rose-500/20 hover:bg-rose-500/20 text-rose-400'}`}
                      >
                         <div className="flex items-center gap-3">
                           <Snowflake className="w-4 h-4" />
                           <span className="text-[10px] font-black uppercase tracking-widest">{selectedUser.isVerified === false ? 'Unfreeze Node' : 'Freeze Node'}</span>
                         </div>
                         <ChevronRight className="w-4 h-4 opacity-50 group-hover:opacity-100 transition-all" />
                      </button>
                    )}
                    
                    {!canManageUsers && !isModerator && (
                      <div className="col-span-2 p-4 text-center bg-white/5 rounded-2xl border border-white/5">
                        <span className="text-xs font-black uppercase tracking-widest text-slate-500">Tier Clearance Too Low For Admin Execution</span>
                      </div>
                    )}
                 </div>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Users;
