
import React from 'react';
import { User, UserRole } from '../types';
import { db } from '../services/db';

const AcademicInfo: React.FC<{ user: User }> = ({ user }) => {
  const notices = db.getNotices();

  const teachers = [
    { name: 'Dr. Md. Nazrul Islam', designation: 'Professor & Chairman', email: 'nazrul@mbstu.ac.bd', research: 'Macroeconomics, Development Economics' },
    { name: 'Dr. Shahinur Rahman', designation: 'Associate Professor', email: 'shahin@mbstu.ac.bd', research: 'Econometrics, Statistics' },
    { name: 'Sultana Razia', designation: 'Assistant Professor', email: 'razia@mbstu.ac.bd', research: 'International Trade' }
  ];

  return (
    <div className="space-y-8 animate-in slide-in-from-left-4 duration-500">
      <section className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100 bg-slate-50/50">
          <h2 className="text-xl font-bold">Faculty Profiles</h2>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teachers.map((t, i) => (
            <div key={i} className="p-6 rounded-2xl border border-slate-100 hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-slate-100 rounded-2xl mb-4 flex items-center justify-center font-bold text-2xl text-slate-400">
                {t.name.charAt(0)}
              </div>
              <h3 className="font-bold text-slate-900 mb-1">{t.name}</h3>
              <p className="text-xs text-sky-600 font-bold uppercase mb-4 tracking-wider">{t.designation}</p>
              <div className="space-y-2">
                <p className="text-xs text-slate-500 flex items-center gap-2">
                  <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                  {t.email}
                </p>
                <p className="text-xs text-slate-400 leading-relaxed">
                  <span className="font-bold text-slate-500">Research:</span> {t.research}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center">
            <h2 className="text-lg font-bold">Upcoming Academic Dates</h2>
          </div>
          <div className="p-6 space-y-4">
            {[
              { event: 'Registration Deadline', date: 'May 30, 2024', status: 'Upcoming' },
              { event: 'Midterm Break', date: 'June 01 - June 07, 2024', status: 'Upcoming' },
              { event: 'Thesis Submission', date: 'August 15, 2024', status: 'Final Year' }
            ].map((ev, i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-slate-50">
                <div>
                  <h4 className="font-bold text-sm text-slate-900">{ev.event}</h4>
                  <p className="text-xs text-slate-500">{ev.date}</p>
                </div>
                <span className="px-2 py-1 bg-white rounded text-[10px] font-bold text-slate-400 border border-slate-100 uppercase">{ev.status}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-slate-900 text-white rounded-2xl p-8 relative overflow-hidden group">
          <h2 className="text-2xl font-bold mb-4 z-10 relative">Department Research Hub</h2>
          <p className="text-slate-400 text-sm mb-6 z-10 relative leading-relaxed">Explore the latest papers, journals, and analytical studies conducted by our faculty and students. Join the digital research archive today.</p>
          <button className="px-6 py-3 bg-white text-slate-900 font-bold rounded-xl group-hover:bg-sky-500 group-hover:text-white transition-all z-10 relative">
            Browse Publications
          </button>
          <div className="absolute top-0 right-0 w-64 h-64 bg-sky-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        </div>
      </section>
    </div>
  );
};

export default AcademicInfo;
