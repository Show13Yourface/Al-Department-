
import React, { useState, useEffect, useCallback } from 'react';
import { User, UserRole, UserStatus } from './types';
import { db } from './services/db';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import Sidebar from './components/Sidebar';
import Library from './pages/Library';
import AdminPanel from './pages/AdminPanel';
import AcademicInfo from './pages/AcademicInfo';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [currentTab, setCurrentTab] = useState<'dashboard' | 'library' | 'admin' | 'academic'>('dashboard');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('current_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const handleLogin = (loggedInUser: User) => {
    setUser(loggedInUser);
    localStorage.setItem('current_user', JSON.stringify(loggedInUser));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('current_user');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-900 text-white">
        <div className="animate-pulse text-xl">Loading MBSTU Digital Hub...</div>
      </div>
    );
  }

  if (!user) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar 
        user={user} 
        activeTab={currentTab} 
        onTabChange={setCurrentTab} 
        onLogout={handleLogout} 
      />
      
      <main className="flex-1 lg:ml-64 p-4 md:p-8 transition-all duration-300">
        <header className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              {currentTab === 'dashboard' && 'Department Dashboard'}
              {currentTab === 'library' && 'Economics Library'}
              {currentTab === 'admin' && 'Administration Center'}
              {currentTab === 'academic' && 'Academic Activities'}
            </h1>
            <p className="text-slate-500">Welcome back, {user.name} ({user.role})</p>
          </div>
          
          <div className="flex items-center gap-4 bg-white p-2 px-4 rounded-xl shadow-sm border border-slate-200">
            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold">
              {user.name.charAt(0)}
            </div>
            <div>
              <p className="text-sm font-semibold">{user.name}</p>
              <p className="text-xs text-slate-400 capitalize">{user.status}</p>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto">
          {currentTab === 'dashboard' && <Dashboard user={user} />}
          {currentTab === 'library' && <Library user={user} />}
          {currentTab === 'admin' && <AdminPanel user={user} />}
          {currentTab === 'academic' && <AcademicInfo user={user} />}
        </div>
      </main>
    </div>
  );
};

export default App;
