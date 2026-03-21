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
         setMessage({ type: 'error', text: 'Access Denied.' });
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
    if (!window.confirm(`Are you sure you want to ${action} this user?`)) return;
    
    setActionLoading(userId);
    try {
      const token = localStorage.getItem('token');
      if (action === 'purge') {
        await axios.delete(`/api/admin/users/${userId}`, { headers: { 'Authorization': `Bearer ${token}` } });
        setMessage({ type: 'success', text: 'User permanently deleted.' });
      } else {
        await axios.post(`/api/admin/users/${userId}/action`, { action }, { headers: { 'Authorization': `Bearer ${token}` } });
        if (action === 'freeze') setMessage({ type: 'warning', text: 'User access frozen.' });
        else if (action === 'unfreeze') setMessage({ type: 'success', text: 'User access restored.' });
        else if (action === 'verify') setMessage({ type: 'success', text: 'Identity successfully verified.' });
        else if (action === 'flag') setMessage({ type: 'warning', text: 'User flagged for review.' });
        else setMessage({ type: 'warning', text: 'User access revoked.' });
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
    <div className="flex items-center justify-center h-[60vh]">
      <RefreshCw className="w-8 h-8 text-[var(--primary-color)] animate-spin" />
    </div>
  );

  return (
    <div className="space-y-6 pb-20 max-w-[1600px] mx-auto animate-in fade-in duration-500">
      {/* Notifications */}
      {message && (
        <div className={`fixed bottom-10 right-10 z-[120] p-4 rounded-xl border flex items-center gap-3 shadow-lg ${
          message.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500' : 
          message.type === 'error' ? 'bg-rose-500/10 border-rose-500/30 text-rose-500' : 'bg-amber-500/10 border-amber-500/30 text-amber-500'
        }`}>
          {message.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <ShieldAlert className="w-5 h-5" />}
          <span className="font-medium text-sm">{message.text}</span>
        </div>
      )}

      {/* Add Employee Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 text-color">
           <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowAddModal(false)}></div>
           <div className="relative w-full max-w-lg bg-surface-card border border-surface-border rounded-2xl p-6 shadow-xl animate-in zoom-in-95">
              <div className="flex justify-between items-start mb-6">
                 <div>
                    <h2 className="text-xl font-bold flex items-center gap-2">
                       <UserPlus className="w-5 h-5 text-[var(--primary-color)]" /> Authorized Personnel
                    </h2>
                    <p className="text-color-secondary text-sm mt-1">Grant administrative access to internal team members.</p>
                 </div>
                 <button onClick={() => setShowAddModal(false)} className="p-1 hover:bg-surface-hover rounded-lg transition-colors">
                    <X className="w-5 h-5 text-color-secondary" />
                 </button>
              </div>

              <form onSubmit={handleAddEmployee} className="space-y-5">
                 <div className="space-y-1.5">
                    <label className="text-sm font-medium text-color-secondary">Organization Email</label>
                    <input 
                       type="email" 
                       required
                       placeholder="employee@paywiseapp.com"
                       value={newEmployee.email}
                       onChange={(e) => setNewEmployee({...newEmployee, email: e.target.value})}
                       className="w-full px-4 py-2.5 bg-surface-section border border-surface-border rounded-lg text-color text-sm focus:outline-none focus:border-[var(--primary-color)] transition-colors"
                    />
                 </div>
                 <div className="space-y-1.5">
                    <label className="text-sm font-medium text-color-secondary">Username</label>
                    <input 
                       type="text" 
                       placeholder="E.g. jdoe"
                       value={newEmployee.username}
                       onChange={(e) => setNewEmployee({...newEmployee, username: e.target.value})}
                       className="w-full px-4 py-2.5 bg-surface-section border border-surface-border rounded-lg text-color text-sm focus:outline-none focus:border-[var(--primary-color)] transition-colors"
                    />
                 </div>
                 <div className="space-y-1.5">
                    <label className="text-sm font-medium text-color-secondary">Access Role</label>
                    <select 
                       value={newEmployee.role}
                       onChange={(e) => setNewEmployee({...newEmployee, role: e.target.value})}
                       className="w-full px-4 py-2.5 bg-surface-section border border-surface-border rounded-lg text-color text-sm focus:outline-none focus:border-[var(--primary-color)] transition-colors appearance-none"
                    >
                       {isRoot && <option value="super_admin">Super Admin</option>}
                       <option value="admin">Admin</option>
                       <option value="moderator">Moderator</option>
                       <option value="read_only">Read Only</option>
                    </select>
                 </div>

                 <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full py-2.5 bg-[var(--primary-color)] text-color rounded-lg text-sm font-medium hover:opacity-80 transition-colors mt-2 disabled:opacity-50"
                 >
                    {isSubmitting ? 'Syncing...' : 'Authorize Personnel'}
                 </button>
              </form>
           </div>
        </div>
      )}

      {/* Header & Tabs */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-color mb-2">User Directory</h1>
          <div className="flex gap-4 border-b border-surface-border">
            <button 
              onClick={() => setActiveTab('users')}
              className={`pb-3 px-1 text-sm font-medium transition-colors border-b-2 ${activeTab === 'users' ? 'text-[var(--primary-color)] border-indigo-400' : 'text-color-secondary border-transparent hover:text-color-secondary'}`}
            >
              Users ({users.length})
            </button>
            {canSeeCouncil && (
              <button 
                onClick={() => setActiveTab('council')}
                className={`pb-3 px-1 text-sm font-medium transition-colors border-b-2 ${activeTab === 'council' ? 'text-[var(--primary-color)] border-indigo-400' : 'text-color-secondary border-transparent hover:text-color-secondary'}`}
              >
                Team ({staff.length})
              </button>
            )}
          </div>
        </div>
        
        <div className="flex gap-3 w-full md:w-auto mt-4 md:mt-0">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-color-secondary" />
            <input 
              type="text" 
              placeholder={`Search ${activeTab}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-surface-card border border-surface-border rounded-lg text-sm text-color focus:outline-none focus:border-[var(--primary-color)] transition-colors"
            />
          </div>
          {canModifyCouncil && activeTab === 'council' && (
             <button 
               onClick={() => setShowAddModal(true)}
               className="px-4 py-2 bg-[var(--primary-color)] text-color rounded-lg hover:opacity-80 transition-colors flex items-center gap-2 text-sm font-medium"
             >
               <Plus className="w-4 h-4" />
               <span className="hidden sm:inline">Add Member</span>
             </button>
          )}
          <button 
            onClick={fetchData}
            className="p-2 bg-surface-card border border-surface-border rounded-lg text-color-secondary hover:text-color transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${loading && 'animate-spin'}`} />
          </button>
        </div>
      </div>

      {/* Table Section */}
      <div className={`bg-surface-card border border-surface-border rounded-2xl shadow-sm overflow-hidden ${!isRoot ? 'no-screenshot' : ''}`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-surface-section/50 border-b border-surface-border">
              <tr>
                <th className="px-6 py-4 text-xs font-semibold text-color-secondary uppercase tracking-wider">User</th>
                <th className="px-6 py-4 text-xs font-semibold text-color-secondary uppercase tracking-wider">Contact</th>
                <th className="px-6 py-4 text-xs font-semibold text-color-secondary uppercase tracking-wider">{activeTab === 'council' ? 'Role' : 'Joined'}</th>
                <th className="px-6 py-4 text-xs font-semibold text-color-secondary uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-color-secondary uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2d323b]">
              {filteredData.map((user) => (
                <tr 
                  key={user._id} 
                  onClick={() => activeTab === 'users' && setSelectedUser(user)}
                  className={`group transition-colors ${activeTab === 'users' ? 'cursor-pointer hover:bg-surface-section/50' : 'hover:bg-surface-section/50'}`}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${
                        user.adminRole === 'root' 
                          ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' 
                          : user.adminRole ? 'bg-indigo-500/10 text-[var(--primary-color)] border border-[var(--primary-color)]/20' : 'bg-[#2d323b] text-color-secondary'
                      }`}>
                        {user.username?.substring(0, 1).toUpperCase() || 'U'}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                           <p className="text-sm font-semibold text-color">{user.username}</p>
                           {user.adminRole === 'root' && <Crown className="w-3.5 h-3.5 text-amber-500" />}
                           {activeTab === 'council' && user.adminRole !== 'root' && <Shield className="w-3.5 h-3.5 text-[var(--primary-color)]" />}
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">UID: {getPIIDisplay(user._id, 'uid', user._id)}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="space-y-1">
                      <div 
                        className={`flex items-center gap-2 text-sm text-color-secondary ${canSeePII ? 'cursor-pointer hover:text-[var(--primary-color)] transition-colors' : ''}`}
                        onClick={canSeePII ? (e) => toggleReveal(user._id, e) : undefined}
                      >
                        <Mail className="w-3.5 h-3.5 text-slate-500" />
                        {getPIIDisplay(user.email, 'email', user._id)}
                      </div>
                      <div 
                        className={`flex items-center gap-2 text-xs text-slate-500 ${canSeePII && user.phone ? 'cursor-pointer hover:text-[var(--primary-color)] transition-colors' : ''}`}
                        onClick={canSeePII && user.phone ? (e) => toggleReveal(user._id, e) : undefined}
                      >
                        <Phone className="w-3.5 h-3.5 text-slate-600" />
                        {getPIIDisplay(user.phone || 'N/A', 'phone', user._id)}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-color-secondary">
                    {activeTab === 'council' ? (
                       <div className="flex items-center gap-2">
                           {canModifyCouncil && user.email !== currentUser.email && (isRoot || (user.adminRole !== 'root' && user.adminRole !== 'super_admin')) ? (
                            <div className="flex items-center gap-2">
                                <select 
                                  value={editingRole[user._id] || user.adminRole}
                                  onChange={(e) => setEditingRole({...editingRole, [user._id]: e.target.value})}
                                  className="bg-surface-section border border-surface-border rounded-lg py-1 px-2 text-xs text-[var(--primary-color)] focus:outline-none focus:border-[var(--primary-color)] transition-colors"
                                >
                                  {isRoot && <option value="super_admin">Super Admin</option>}
                                  <option value="admin">Admin</option>
                                  <option value="moderator">Moderator</option>
                                  <option value="read_only">Read Only</option>
                                </select>
                              {editingRole[user._id] && editingRole[user._id] !== user.adminRole && (
                                <button 
                                  onClick={() => handleUpdateRole(user)}
                                  disabled={actionLoading === user._id}
                                  className="p-1.5 bg-emerald-500/10 text-emerald-500 rounded-md hover:bg-emerald-500 hover:text-color transition-colors"
                                >
                                  {actionLoading === user._id ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                                </button>
                              )}
                            </div>
                          ) : (
                            getRoleLabel(user.adminRole)
                          )}
                       </div>
                    ) : (
                      new Date(user.createdAt).toLocaleDateString()
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col gap-1 w-fit">
                       {user.isVerified ? (
                          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-500 text-xs font-medium">
                             <CheckCircle2 className="w-3 h-3" /> Active
                          </span>
                       ) : (
                          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-rose-500/10 text-rose-500 text-xs font-medium">
                             <AlertTriangle className="w-3 h-3" /> Flagged
                          </span>
                       )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                    <div className="flex justify-end gap-2">
                      {canManageUsers && user.email !== currentUser.email ? (
                        <>
                          <button 
                            onClick={(e) => { e.stopPropagation(); handleAction(user._id, user.isVerified === false ? 'unfreeze' : 'freeze'); }}
                            disabled={actionLoading === user._id}
                            className="p-1.5 text-color-secondary hover:text-[var(--primary-color)] hover:bg-surface-section rounded-lg transition-colors border border-transparent hover:border-surface-border"
                            title={user.isVerified === false ? 'Unfreeze' : 'Freeze'}
                          >
                            <Snowflake className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={(e) => { e.stopPropagation(); handleAction(user._id, 'revoke'); }}
                            disabled={actionLoading === user._id}
                            className="p-1.5 text-color-secondary hover:text-amber-500 hover:bg-surface-section rounded-lg transition-colors border border-transparent hover:border-surface-border"
                            title="Ban User"
                          >
                            <Ban className="w-4 h-4" />
                          </button>
                          {['root', 'super_admin'].includes(userRole) && (
                            <button 
                              onClick={(e) => { e.stopPropagation(); handleAction(user._id, 'purge'); }}
                              disabled={actionLoading === user._id}
                              className="p-1.5 text-color-secondary hover:text-rose-500 hover:bg-surface-section rounded-lg transition-colors border border-transparent hover:border-surface-border"
                              title="Delete User"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </>
                      ) : user.email === currentUser.email ? (
                        <span className="text-xs text-slate-500 bg-surface-section px-2 py-1 rounded-md border border-surface-border">You</span>
                      ) : null}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {(filteredData.length === 0 && !loading) && (
          <div className="p-12 text-center text-color-secondary">
             <div className="flex justify-center mb-4">
               <UserX className="w-10 h-10 text-slate-600" />
             </div>
             <p className="text-sm font-medium">No users found.</p>
          </div>
        )}
      </div>

      {/* User Management Slide-over Modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-[150] flex justify-end text-color">
          <div className="absolute inset-0 bg-black/50" onClick={() => setSelectedUser(null)}></div>
          <div className="relative w-full max-w-md bg-surface-card h-full overflow-y-auto animate-in slide-in-from-right duration-300 shadow-2xl flex flex-col border-l border-surface-border">
            {/* Header */}
            <div className="sticky top-0 bg-surface-card border-b border-surface-border p-6 z-10 flex justify-between items-start">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${
                  selectedUser.isVerified ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-500' : 'bg-rose-500/10 border border-rose-500/20 text-rose-500'
                }`}>
                  {selectedUser.username?.substring(0, 1).toUpperCase() || 'U'}
                </div>
                <div>
                  <h2 className="text-xl font-bold flex items-center gap-2">
                    {selectedUser.username}
                  </h2>
                  <p className="text-color-secondary text-xs mt-1">UID: {getPIIDisplay(selectedUser._id, 'uid', selectedUser._id)}</p>
                </div>
              </div>
              <button onClick={() => setSelectedUser(null)} className="p-1.5 bg-surface-section border border-surface-border hover:bg-surface-hover rounded-lg transition-colors">
                <X className="w-5 h-5 text-color-secondary" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-6 flex-1">
              <h3 className="text-sm font-semibold text-color border-b border-surface-border pb-2">User Details</h3>
              
              <div className="space-y-4">
                 <div className="flex justify-between items-center bg-surface-section p-3 rounded-lg border border-surface-border">
                   <span className="text-sm text-color-secondary flex items-center gap-2"><Mail className="w-4 h-4"/> Email Status</span>
                   <span className="text-sm font-medium text-color">{getPIIDisplay(selectedUser.email, 'email', selectedUser._id)}</span>
                 </div>
                 <div className="flex justify-between items-center bg-surface-section p-3 rounded-lg border border-surface-border">
                   <span className="text-sm text-color-secondary flex items-center gap-2"><Phone className="w-4 h-4"/> Phone Status</span>
                   <span className="text-sm font-medium text-color">{getPIIDisplay(selectedUser.phone || 'N/A', 'phone', selectedUser._id)}</span>
                 </div>
                 <div className="flex justify-between items-center bg-surface-section p-3 rounded-lg border border-surface-border">
                   <span className="text-sm text-color-secondary flex items-center gap-2"><Calendar className="w-4 h-4"/> Joined</span>
                   <span className="text-sm font-medium text-color">{new Date(selectedUser.createdAt).toLocaleDateString()}</span>
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
