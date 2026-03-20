import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users as UsersIcon, 
  BarChart3, 
  Settings as SettingsIcon,
  ChevronLeft,
  LogOut,
  TrendingUp,
  Activity
} from 'lucide-react';

const Sidebar = ({ isOpen, toggle }) => {
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
  const userRole = currentUser.adminRole || 'read_only';

  const allNavItems = [
    { icon: LayoutDashboard, label: 'Overview', path: '/', roles: ['root', 'super_admin', 'admin', 'moderator', 'read_only'] },
    { icon: UsersIcon, label: 'Users & Identity', path: '/users', roles: ['root', 'super_admin', 'admin', 'moderator', 'read_only'] },
    { icon: BarChart3, label: 'Analytics', path: '/stats', roles: ['root', 'super_admin', 'admin', 'read_only'] },
    { icon: TrendingUp, label: 'Growth', path: '/growth', roles: ['root', 'super_admin', 'admin', 'read_only'] },
    { icon: Activity, label: 'Operations', path: '/operations', roles: ['root', 'super_admin', 'admin', 'moderator'] },
    { icon: SettingsIcon, label: 'Settings', path: '/settings', roles: ['root', 'super_admin'] },
  ];

  const filteredNavItems = allNavItems.filter(item => item.roles.includes(userRole));

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/login';
  };

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

  return (
    <aside 
      className={`bg-[#1e232b] border-r border-[#2d323b] transition-all duration-300 ease-in-out flex flex-col z-50 absolute inset-y-0 left-0 lg:relative ${
        isOpen ? 'translate-x-0 w-[260px]' : '-translate-x-full w-[260px] lg:translate-x-0 lg:w-[88px]'
      }`}
    >
      <div className={`h-20 flex items-center border-b border-[#2d323b] ${isOpen ? 'px-6 justify-start' : 'justify-center'}`}>
        <div className={`flex items-center gap-3 overflow-hidden ${!isOpen && 'justify-center'}`}>
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-lg flex-shrink-0">
            P
          </div>
          {isOpen && (
            <div className="flex flex-col animate-in fade-in duration-300">
              <span className="font-bold text-white text-lg tracking-tight">Paywise Admin</span>
              <span className="text-xs font-medium text-slate-500 uppercase tracking-widest">{getRoleLabel(userRole)}</span>
            </div>
          )}
        </div>
      </div>

      <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto custom-scrollbar">
        {filteredNavItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `
              flex items-center gap-3 px-3 py-3 rounded-xl transition-colors relative group
              ${isActive 
                ? 'bg-blue-500/10 text-blue-500 font-semibold' 
                : 'text-slate-400 font-medium hover:text-white hover:bg-[#2d323b]'
              }
            `}
          >
            <item.icon className={`w-5 h-5 flex-shrink-0 ${!isOpen && 'mx-auto'}`} />
            {isOpen && <span className="text-sm">{item.label}</span>}
            {!isOpen && (
               <div className="absolute left-[calc(100%+12px)] bg-[#1e232b] border border-[#2d323b] text-white text-sm px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-[60] shadow-lg">
                 {item.label}
               </div>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-[#2d323b] space-y-2">
        <button 
          onClick={handleLogout}
          className={`flex items-center gap-3 w-full px-3 py-3 rounded-xl text-slate-400 hover:bg-rose-500/10 hover:text-rose-500 transition-colors font-medium text-sm group ${!isOpen && 'justify-center'}`}
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {isOpen && <span>Sign Out</span>}
        </button>

        <button 
          onClick={toggle}
          className={`w-full flex items-center justify-center p-3 hover:bg-[#2d323b] text-slate-400 hover:text-white rounded-xl transition-colors ${!isOpen && 'hidden lg:flex'}`}
        >
          <ChevronLeft className={`w-5 h-5 transition-transform duration-300 ${!isOpen && 'rotate-180'}`} />
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
