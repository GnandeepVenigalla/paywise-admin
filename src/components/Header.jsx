import React from 'react';
import { Search, Bell, Menu, User, Settings } from 'lucide-react';

const Header = ({ toggleSidebar }) => {
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
  
  return (
    <header className="h-20 bg-[#1e232b] flex items-center justify-between px-4 lg:px-8 relative z-40 border-b border-[#2d323b]">
      <div className="flex items-center gap-6 flex-1">
        <button 
          onClick={toggleSidebar}
          className="lg:hidden p-2 text-slate-400 hover:text-white transition-colors"
        >
          <Menu className="w-6 h-6" />
        </button>
        
        <div className="relative max-w-md w-full hidden sm:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input 
            type="text" 
            placeholder="Search..."
            className="w-full pl-10 pr-4 py-2 bg-[#0f111a] border border-[#2d323b] rounded-lg text-sm text-white focus:outline-none focus:border-blue-500 transition-colors placeholder:text-slate-500"
          />
        </div>
      </div>

      <div className="flex items-center gap-4 sm:gap-6">
        <button className="relative p-2 text-slate-400 hover:text-white transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-[#1e232b]"></span>
        </button>
        <button className="p-2 text-slate-400 hover:text-white transition-colors hidden sm:block">
           <Settings className="w-5 h-5" />
        </button>
        
        <div className="flex items-center gap-3 pl-4 sm:pl-6 border-l border-[#2d323b]">
          <div className="flex flex-col items-end hidden md:flex">
            <span className="text-sm font-semibold text-white">{currentUser.username || 'System Admin'}</span>
            <span className="text-xs text-slate-500 capitalize">{currentUser.adminRole || 'Administrator'}</span>
          </div>
          <button className="w-10 h-10 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-500 hover:bg-blue-500/20 transition-colors">
            <User className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
