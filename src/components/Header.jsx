import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Search, Bell, Menu, User, Settings as SettingsIcon, X, Check, AlertTriangle, Info, CheckCircle2 } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const Header = ({ toggleSidebar }) => {
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
  const { setIsSettingsOpen } = useTheme();
  
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  // Fetch notifications
  const fetchNotifications = async () => {
    try {
      const response = await axios.get('/api/admin/notifications', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      setNotifications(response.data.notifications || []);
      setUnreadCount(response.data.unreadCount || 0);
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 60000); // Check every minute
    return () => clearInterval(interval);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Mark single notification as read
  const handleMarkAsRead = async (id, e) => {
    e.stopPropagation();
    try {
      await axios.put(`/api/admin/notifications/${id}/read`, {}, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      fetchNotifications();
    } catch (err) {
      console.error(err);
    }
  };

  // Mark all as read
  const handleMarkAllAsRead = async () => {
    try {
      await axios.put('/api/admin/notifications/read-all', {}, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      fetchNotifications();
      setShowDropdown(false);
    } catch (err) {
      console.error(err);
    }
  };

  const getIconForType = (type) => {
    switch(type) {
      case 'error': return <AlertTriangle className="w-5 h-5 text-rose-500" />;
      case 'warning': return <AlertTriangle className="w-5 h-5 text-amber-500" />;
      case 'success': return <CheckCircle2 className="w-5 h-5 text-emerald-500" />;
      default: return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  const getBgForType = (type) => {
    switch(type) {
      case 'error': return 'bg-rose-500/10 border-rose-500/20';
      case 'warning': return 'bg-amber-500/10 border-amber-500/20';
      case 'success': return 'bg-emerald-500/10 border-emerald-500/20';
      default: return 'bg-blue-500/10 border-blue-500/20';
    }
  };

  return (
    <header className="h-20 bg-surface-card flex items-center justify-between px-4 lg:px-8 relative z-40 border-b border-surface-border">
      <div className="flex items-center gap-6 flex-1">
        <button 
          onClick={toggleSidebar}
          className="lg:hidden p-2 text-color-secondary hover:text-color transition-colors"
        >
          <Menu className="w-6 h-6" />
        </button>
        
        <div className="relative max-w-md w-full hidden sm:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-color-secondary" />
          <input 
            type="text" 
            placeholder="Search..."
            className="w-full pl-10 pr-4 py-2 bg-surface-body border border-surface-border rounded-lg text-sm text-color focus:outline-none focus:border-[var(--primary-color)] transition-colors placeholder:text-color-secondary"
          />
        </div>
      </div>

      <div className="flex items-center gap-4 sm:gap-6">
        
        {/* Notifications Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => setShowDropdown(!showDropdown)}
            className={`relative p-2 transition-colors ${showDropdown ? 'text-color' : 'text-color-secondary hover:text-color'}`}
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 min-w-[12px] h-3 px-1 flex items-center justify-center bg-rose-500 text-white text-[8px] font-bold rounded-full border-2 border-surface-card animate-pulse">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {showDropdown && (
            <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-surface-card border border-surface-border shadow-2xl rounded-2xl overflow-hidden z-[100] animate-in slide-in-from-bottom-2 fade-in duration-200">
              <div className="flex items-center justify-between p-4 border-b border-surface-border bg-surface-section">
                <h3 className="font-semibold text-color">Notifications</h3>
                {unreadCount > 0 && (
                  <button onClick={handleMarkAllAsRead} className="text-xs font-medium text-[var(--primary-color)] hover:underline">
                    Mark all as read
                  </button>
                )}
              </div>
              
              <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                {notifications.length === 0 ? (
                  <div className="p-8 text-center text-color-secondary flex flex-col items-center">
                    <CheckCircle2 className="w-10 h-10 mb-2 opacity-20" />
                    <p className="text-sm">You are all caught up!</p>
                  </div>
                ) : (
                  <div className="divide-y divide-surface-border">
                    {notifications.map((notif) => (
                      <div 
                        key={notif._id} 
                        className={`p-4 flex gap-4 transition-colors ${notif.isRead ? 'bg-surface-card hover:bg-surface-hover' : 'bg-surface-hover/50 hover:bg-surface-hover'}`}
                      >
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center border flex-shrink-0 ${getBgForType(notif.type)}`}>
                          {getIconForType(notif.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start mb-1">
                            <h4 className={`text-sm font-semibold truncate pr-2 ${notif.isRead ? 'text-color-secondary' : 'text-color'}`}>
                              {notif.title}
                            </h4>
                            <span className="text-[10px] text-color-secondary whitespace-nowrap">
                              {new Date(notif.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                            </span>
                          </div>
                          <p className={`text-xs break-words line-clamp-2 ${notif.isRead ? 'text-color-secondary/80' : 'text-color-secondary'}`}>
                            {notif.message}
                          </p>
                        </div>
                        {!notif.isRead && (
                          <div className="flex-shrink-0 flex items-center justify-center ml-2">
                            <button 
                              onClick={(e) => handleMarkAsRead(notif._id, e)}
                              className="p-1 rounded-full text-color-secondary hover:text-[var(--primary-color)] hover:bg-[var(--primary-color)]/10 transition-colors"
                              title="Mark as read"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <button 
          onClick={() => setIsSettingsOpen(true)}
          className="p-2 text-color-secondary hover:text-color transition-colors hidden sm:block"
        >
           <SettingsIcon className="w-5 h-5 animate-[spin_4s_linear_infinite]" />
        </button>
        
        <div className="flex items-center gap-3 pl-4 sm:pl-6 border-l border-surface-border">
          <div className="flex flex-col items-end hidden md:flex">
            <span className="text-sm font-semibold text-color">{currentUser.username || 'System Admin'}</span>
            <span className="text-xs text-color-secondary capitalize">{currentUser.adminRole || 'Administrator'}</span>
          </div>
          <button className="w-10 h-10 rounded-full bg-[var(--primary-color)]/10 border border-[var(--primary-color)]/20 flex items-center justify-center text-[var(--primary-color)] hover:bg-[var(--primary-color)]/20 transition-colors">
            <User className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
