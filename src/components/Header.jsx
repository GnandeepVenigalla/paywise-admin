import React from 'react';
import { Search, Bell, Menu, User, Activity } from 'lucide-react';

const Header = ({ toggleSidebar }) => {
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
  
  return (
    <header className="h-24 flex items-center justify-between px-4 lg:px-10 relative z-40 border-b border-white/5 lg:border-none">
      <div className="flex items-center gap-6 flex-1">
        <button 
          onClick={toggleSidebar}
          className="lg:hidden p-3 bg-white/5 border border-white/10 rounded-2xl text-white"
        >
          <Menu className="w-6 h-6" />
        </button>
        
        <div className="relative max-w-xl w-full hidden md:block group">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
          <input 
            type="text" 
            placeholder="Search kernel, logs, user nodes..."
            className="w-full pl-14 pr-6 py-4 bg-white/5 border border-white/5 rounded-2xl text-sm font-bold text-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500/30 transition-all placeholder:text-slate-600"
          />
          <div className="absolute right-4 top-1/2 -translate-y-1/2 px-2 py-1 bg-white/5 rounded-lg border border-white/10 text-[10px] font-black text-slate-500 tracking-tighter">
            ⌘ + K
          </div>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="hidden lg:flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
          <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Sys Level: Nominal</span>
        </div>

        <button className="p-3 bg-white/5 border border-white/5 text-slate-400 hover:text-white hover:bg-white/10 rounded-2xl transition-all relative group">
          <Bell className="w-5 h-5" />
          <span className="absolute top-3 right-3 w-2 h-2 bg-indigo-500 rounded-full border-2 border-slate-950 group-hover:scale-125 transition-transform"></span>
        </button>
        
        <div className="flex items-center gap-4 pl-4 border-l border-white/10">
          <div className="flex flex-col items-end hidden sm:flex">
            <span className="text-sm font-black text-white">{currentUser.username || 'System Admin'}</span>
            <span className="text-[10px] text-indigo-500 font-black uppercase tracking-[0.2em]">{currentUser.adminRole || 'Node 01'}</span>
          </div>
          <div className="w-12 h-12 bg-gradient-to-br from-indigo-500/20 to-violet-600/20 border border-white/10 rounded-2xl flex items-center justify-center text-indigo-400 shadow-inner overflow-hidden relative group">
            <User className="w-6 h-6 group-hover:scale-110 transition-transform" />
            <div className="absolute inset-0 bg-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
