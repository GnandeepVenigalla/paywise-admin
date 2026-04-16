import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import Stats from './pages/Stats';
import Settings from './pages/Settings';
import Login from './pages/Login';
import Growth from './pages/Growth';
import Operations from './pages/Operations';
import { ThemeProvider } from './context/ThemeContext';
import ThemeConfigurator from './components/ThemeConfigurator';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? 'https://paywise-backend-lemon.vercel.app/api' : '/api');
axios.defaults.baseURL = API_URL;

function App() {
  const [isSidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 1024);
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));
  
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
  const userRole = currentUser.adminRole || 'read_only';
  const isRoot = currentUser.email === 'gnandeep.venigalla@paywiseapp.com';
  const hasSettingsAccess = ['root', 'super_admin'].includes(userRole) || isRoot;
  const hasAnalyticsAccess = userRole !== 'moderator' || isRoot;
  const hasIdentityAccess = ['root', 'super_admin', 'admin', 'moderator'].includes(userRole) || isRoot;
  const hasOperationsAccess = ['root', 'super_admin', 'admin', 'moderator'].includes(userRole) || isRoot;

  useEffect(() => {
    const handleStorageChange = () => {
      setIsAuthenticated(!!localStorage.getItem('token'));
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <ThemeProvider>
      <Router>
        {!isAuthenticated ? (
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        ) : (
          <div className="flex h-screen bg-surface-body overflow-hidden relative theme-transition">
            <Sidebar isOpen={isSidebarOpen} toggle={() => setSidebarOpen(!isSidebarOpen)} />
            
            {/* Mobile Overlay */}
            {isSidebarOpen && (
              <div 
                className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm transition-opacity"
                onClick={() => setSidebarOpen(false)}
              ></div>
            )}

            <div className="flex-1 flex flex-col overflow-hidden relative z-10 w-full">
              <Header toggleSidebar={() => setSidebarOpen(!isSidebarOpen)} />
              
              <main className="flex-1 overflow-x-hidden overflow-y-auto custom-scrollbar p-4 lg:p-8">
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/users" element={hasIdentityAccess ? <Users /> : <Navigate to="/" replace />} />
                  <Route path="/stats" element={hasAnalyticsAccess ? <Stats /> : <Navigate to="/" replace />} />
                  <Route path="/settings" element={hasSettingsAccess ? <Settings /> : <Navigate to="/" replace />} />
                  <Route path="/growth" element={hasAnalyticsAccess ? <Growth /> : <Navigate to="/" replace />} />
                  <Route path="/operations" element={hasOperationsAccess ? <Operations /> : <Navigate to="/" replace />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </main>
            </div>
            
            <ThemeConfigurator />
          </div>
        )}
      </Router>
    </ThemeProvider>
  );
}

export default App;
