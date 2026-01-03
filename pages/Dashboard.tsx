
import React from 'react';
import { User, UserRole } from '../types';
import { db } from '../services/db';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface DashboardProps {
  user: User;
}

const Dashboard: React.FC<DashboardProps> = ({ user }) => {
  const notices = db.getNotices();
  const books = db.getBooks();
  
  const stats = [
    { label: 'Library Books', value: books.length, color: 'bg-blue-500' },
    { label: 'Active Notices', value: notices.length, color: 'bg-amber-500' },
    { label: 'My Requests', value: db.getBorrows().filter(b => b.userId === user.id).length, color: 'bg-green-500' },
    { label: 'Upcoming Exams', value: 2, color: 'bg-red-500' },
  ];

  const data = [
    { name: 'Jan', value: 40 },
    { name: 'Feb', value: 30 },
    { name: 'Mar', value: 65 },
    { name: 'Apr', value: 45 },
    { name: 'May', value: 80 },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow group">
            <div className={`w-12 h-12 ${stat.color} rounded-xl mb-4 flex items-center justify-center text-white shadow-lg shadow-blue-500/10`}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"></path></svg>
            </div>
            <p className="text-slate-500 text-sm font-medium">{stat.label}</p>
            <h4 className="text-2xl font-bold text-slate-900 group-hover:scale-110 transition-transform origin-left">{stat.value}</h4>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h3 className="text-lg font-bold mb-6">Library Activity Trends</h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                  <Tooltip 
                    contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}} 
                    cursor={{fill: '#f8fafc'}}
                  />
                  <Bar dataKey="value" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h3 className="text-lg font-bold">Latest Department Notices</h3>
              <button className="text-sky-500 text-sm font-bold hover:underline">View All</button>
            </div>
            <div className="divide-y divide-slate-100">
              {notices.map((notice) => (
                <div key={notice.id} className="p-6 hover:bg-slate-50 transition-colors">
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        notice.category === 'Exam' ? 'bg-red-100 text-red-600' : 
                        notice.category === 'Academic' ? 'bg-sky-100 text-sky-600' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {notice.category}
                      </span>
                      <h4 className="font-bold text-slate-900">{notice.title}</h4>
                      <p className="text-sm text-slate-500 line-clamp-2">{notice.content}</p>
                    </div>
                    <p className="text-xs text-slate-400 whitespace-nowrap">{notice.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-slate-900 text-white p-8 rounded-2xl shadow-xl shadow-slate-900/20 relative overflow-hidden">
            <h3 className="text-xl font-bold mb-4 z-10 relative">Academic Calendar</h3>
            <p className="text-slate-400 mb-6 z-10 relative">Next Important Event: Semester Final Exams starting in 12 days.</p>
            <button className="w-full bg-sky-500 hover:bg-sky-400 text-white font-bold py-3 rounded-xl transition-all z-10 relative">
              View Schedule
            </button>
            <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-sky-500/20 rounded-full blur-2xl"></div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h3 className="text-lg font-bold mb-4">Quick Links</h3>
            <div className="space-y-3">
              {['Result Portal', 'Scholarships', 'Alumni Connect', 'Course Material'].map((link, i) => (
                <a key={i} href="#" className="flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:bg-slate-50 transition-all group">
                  <span className="text-sm font-medium text-slate-700">{link}</span>
                  <svg className="text-slate-400 group-hover:translate-x-1 transition-transform" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7"></path></svg>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
