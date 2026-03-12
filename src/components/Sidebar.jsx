import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users as UsersIcon, 
  BarChart3, 
  Settings as SettingsIcon,
  ChevronLeft,
  LogOut,
  Shield,
  TrendingUp,
  Activity
} from 'lucide-react';

const Sidebar = ({ isOpen, toggle }) => {
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
  const userRole = currentUser.adminRole || 'read_only';

  const allNavItems = [
    { icon: LayoutDashboard, label: 'Overview', path: '/', roles: ['root', 'super_admin', 'admin', 'moderator', 'read_only'] },
    { icon: UsersIcon, label: 'Identity', path: '/users', roles: ['root', 'super_admin', 'admin', 'moderator', 'read_only'] },
    { icon: BarChart3, label: 'Analytics', path: '/stats', roles: ['root', 'super_admin', 'admin', 'read_only'] },
    { icon: TrendingUp, label: 'Growth', path: '/growth', roles: ['root', 'super_admin', 'admin', 'read_only'] },
    { icon: Activity, label: 'Operations', path: '/operations', roles: ['root', 'super_admin', 'admin', 'moderator'] },
    { icon: SettingsIcon, label: 'Core Config', path: '/settings', roles: ['root', 'super_admin'] },
  ];

  const filteredNavItems = allNavItems.filter(item => item.roles.includes(userRole));

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/login';
  };

  const getRoleLabel = (role) => {
    const roles = {
      root: 'ROOT',
      super_admin: 'SUP-ADMIN',
      admin: 'ADMIN',
      moderator: 'MOD',
      read_only: 'READ'
    };
    return roles[role] || role;
  };

  return (
    <aside 
      className={`bg-slate-950 border-r border-white/5 transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] flex flex-col z-50 absolute inset-y-0 left-0 lg:relative ${
        isOpen ? 'translate-x-0 w-72' : '-translate-x-full w-72 lg:translate-x-0 lg:w-24'
      }`}
    >
      <div className={`h-24 flex items-center border-b border-white/5 ${isOpen ? 'px-8 justify-start' : 'justify-center'}`}>
        <div className={`flex items-center gap-4 overflow-hidden group ${!isOpen && 'justify-center'}`}>
          <img src="/logo.png" alt="Paywise" className="w-10 h-10 md:w-12 md:h-12 flex-shrink-0 rounded-2xl object-cover group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-indigo-500/20" />
          {isOpen && (
            <div className="flex flex-col animate-in fade-in slide-in-from-left-4 duration-500">
              <span className="font-black text-white text-xl tracking-tighter">PAYWISE</span>
              <div className="flex items-center gap-1.5">
                 <Shield className="w-3 h-3 text-indigo-500" />
                 <span className="text-[9px] font-black text-indigo-500 uppercase tracking-[0.2em]">{getRoleLabel(userRole)} ACCESS</span>
              </div>
            </div>
          )}
        </div>
      </div>

      <nav className="flex-1 py-10 px-4 space-y-2">
        {filteredNavItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `
              nav-link group relative
              ${isActive 
                ? 'bg-white/10 text-white shadow-xl border border-white/10' 
                : 'text-slate-500 hover:text-white hover:bg-white/5'}
            `}
          >
            <item.icon className={`w-5 h-5 transition-transform duration-300 group-hover:scale-110 ${isOpen ? '' : 'mx-auto'}`} />
            {isOpen && <span className="font-bold text-sm tracking-tight">{item.label}</span>}
            {!isOpen && (
               <div className="absolute left-20 bg-indigo-600 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap font-bold z-[60]">
                 {item.label}
               </div>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="p-6 space-y-4">
        <button 
          onClick={handleLogout}
          className={`flex items-center gap-3 w-full px-4 py-3 rounded-2xl text-rose-500 hover:bg-rose-500/10 transition-all font-bold text-sm ${!isOpen && 'justify-center'}`}
        >
          <LogOut className="w-5 h-5" />
          {isOpen && <span>Terminate Session</span>}
        </button>

        <button 
          onClick={toggle}
          className={`w-full flex items-center justify-center p-3 hover:bg-white/5 rounded-2xl transition-all border border-transparent hover:border-white/5 group ${!isOpen && 'hidden lg:flex'}`}
        >
          <ChevronLeft className={`w-5 h-5 text-slate-500 transition-transform duration-500 group-hover:text-white ${!isOpen && 'rotate-180'}`} />
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
