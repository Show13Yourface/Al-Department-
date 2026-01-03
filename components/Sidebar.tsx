
import React from 'react';
import { User, UserRole } from '../types';
import { Icons } from '../constants';

interface SidebarProps {
  user: User;
  activeTab: string;
  onTabChange: (tab: any) => void;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ user, activeTab, onTabChange, onLogout }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Icons.Dashboard, roles: [UserRole.ADMIN, UserRole.STUDENT, UserRole.TEACHER, UserRole.ALUMNI] },
    { id: 'library', label: 'Library', icon: Icons.Library, roles: [UserRole.ADMIN, UserRole.STUDENT, UserRole.TEACHER] },
    { id: 'academic', label: 'Academic', icon: Icons.Blog, roles: [UserRole.ADMIN, UserRole.STUDENT, UserRole.TEACHER] },
    { id: 'admin', label: 'Admin Hub', icon: Icons.Admin, roles: [UserRole.ADMIN] },
  ];

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-slate-900 text-white hidden lg:flex flex-col z-50">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-sky-500 rounded-lg flex items-center justify-center font-bold text-xl">E</div>
          <div>
            <h2 className="font-bold text-sm tracking-tight">MBSTU</h2>
            <p className="text-[10px] text-slate-400 uppercase tracking-widest">Economics Dept</p>
          </div>
        </div>

        <nav className="space-y-1">
          {menuItems.map((item) => (
            item.roles.includes(user.role) && (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  activeTab === item.id 
                    ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/20' 
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <item.icon />
                <span className="font-medium">{item.label}</span>
              </button>
            )
          ))}
        </nav>
      </div>

      <div className="mt-auto p-6">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-all duration-200 border border-transparent hover:border-red-500/20"
        >
          <Icons.Logout />
          <span className="font-medium">Sign Out</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
