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
import { useTheme } from '../context/ThemeContext';

const Sidebar = ({ isOpen, toggle }) => {
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
  const userRole = currentUser.adminRole || 'read_only';
  
  const { setIsSettingsOpen } = useTheme();

  const allNavItems = [
    { icon: LayoutDashboard, label: 'Overview', path: '/', roles: ['root', 'super_admin', 'admin', 'moderator', 'read_only'] },
    { icon: UsersIcon, label: 'Users & Identity', path: '/users', roles: ['root', 'super_admin', 'admin', 'moderator', 'read_only'] },
    { icon: BarChart3, label: 'Analytics', path: '/stats', roles: ['root', 'super_admin', 'admin', 'read_only'] },
    { icon: TrendingUp, label: 'Growth', path: '/growth', roles: ['root', 'super_admin', 'admin', 'read_only'] },
    { icon: Activity, label: 'Operations', path: '/operations', roles: ['root', 'super_admin', 'admin', 'moderator'] },
    { icon: SettingsIcon, label: 'Settings', path: '/settings', roles: ['root', 'super_admin'] },
  ];

  const filteredNavItems = allNavItems.filter(item => item.roles.includes(userRole));
  // const hasSettingsAccess = ['root', 'super_admin'].includes(userRole); // This is no longer needed

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
      className={`bg-surface-card border-r border-surface-border transition-all duration-300 ease-in-out flex flex-col z-50 absolute inset-y-0 left-0 lg:relative ${
        isOpen ? 'translate-x-0 w-[260px]' : '-translate-x-full w-[260px] lg:translate-x-0 lg:w-[88px]'
      }`}
    >
      <div className={`h-20 flex items-center border-b border-surface-border ${isOpen ? 'px-6 justify-start' : 'justify-center'}`}>
        <div className={`flex items-center gap-3 overflow-hidden ${!isOpen && 'justify-center'}`}>
          <div className="w-10 h-10 bg-[var(--primary-color)] rounded-lg flex items-center justify-center shadow-lg flex-shrink-0 p-2 border border-white/10">
            <img src="/logo.png" alt="Paywise" className="w-full h-full object-contain brightness-0 invert" style={{ filter: 'brightness(0) invert(1)' }} />
          </div>
          {isOpen && (
            <div className="flex flex-col animate-in fade-in duration-300">
              <span className="font-bold text-color text-lg tracking-tight">Paywise Admin</span>
              <span className="text-xs font-medium text-color-secondary uppercase tracking-widest">{getRoleLabel(userRole)}</span>
            </div>
          )}
        </div>
      </div>

      <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto overflow-x-hidden custom-scrollbar">
        {filteredNavItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            title={!isOpen ? item.label : undefined}
            className={({ isActive }) => `
              flex items-center gap-3 px-3 py-3 rounded-xl transition-colors relative group
              ${isActive 
                ? 'bg-[var(--primary-color)]/10 text-[var(--primary-color)] font-semibold' 
                : 'text-color-secondary font-medium hover:text-color hover:bg-surface-hover'
              }
            `}
          >
            <item.icon className={`w-5 h-5 flex-shrink-0 ${!isOpen && 'mx-auto'}`} />
            {isOpen && <span className="text-sm">{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-surface-border space-y-2">
        <button 
          onClick={handleLogout}
          className={`flex items-center gap-3 w-full px-3 py-3 rounded-xl text-color-secondary hover:bg-rose-500/10 hover:text-rose-500 transition-colors font-medium text-sm group ${!isOpen && 'justify-center'}`}
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {isOpen && <span>Sign Out</span>}
        </button>

        <button 
          onClick={toggle}
          className={`w-full flex items-center justify-center p-3 hover:bg-surface-hover text-color-secondary hover:text-color rounded-xl transition-colors ${!isOpen && 'hidden lg:flex'}`}
        >
          <ChevronLeft className={`w-5 h-5 transition-transform duration-300 ${!isOpen && 'rotate-180'}`} />
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;

