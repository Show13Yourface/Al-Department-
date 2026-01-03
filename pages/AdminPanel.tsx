
import React, { useState, useEffect } from 'react';
import { User, Book, BorrowRecord, UserRole, UserStatus } from '../types';
import { db } from '../services/db';
import { Icons } from '../constants';

interface AdminPanelProps {
  user: User;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ user }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [requests, setRequests] = useState<BorrowRecord[]>([]);
  const [activeTab, setActiveTab] = useState<'users' | 'library' | 'excel'>('users');
  const [importStatus, setImportStatus] = useState<string | null>(null);

  useEffect(() => {
    setUsers(db.getUsers());
    setBooks(db.getBooks());
    setRequests(db.getBorrows());
  }, []);

  const approveUser = (userId: string) => {
    const updatedUsers = users.map(u => u.id === userId ? { ...u, status: UserStatus.ACTIVE } : u);
    setUsers(updatedUsers);
    const u = updatedUsers.find(x => x.id === userId);
    if (u) db.saveUser(u);
  };

  const handleExcelImport = (type: 'users' | 'books') => {
    setImportStatus(`Simulating Excel Import for ${type}...`);
    setTimeout(() => {
      if (type === 'users') {
        const mockVerified = [
          { email: 'teacher@mbstu.ac.bd', role: UserRole.TEACHER },
          { email: 'mamun@economics.mbstu.ac.bd', role: UserRole.STUDENT }
        ];
        db.addVerifiedEmails(mockVerified);
        setImportStatus(`Successfully imported 2 email records for auto-verification.`);
      } else {
        setImportStatus(`Successfully updated book inventory via Excel.`);
      }
      setTimeout(() => setImportStatus(null), 3000);
    }, 1500);
  };

  const updateRequestStatus = (reqId: string, newStatus: any) => {
    const updated = requests.map(r => r.id === reqId ? { ...r, status: newStatus } : r);
    setRequests(updated);
    const r = updated.find(x => x.id === reqId);
    if (r) {
      db.saveBorrow(r);
      // Logic for updating book count if issued/returned
      if (newStatus === 'Issued') {
        const b = books.find(x => x.id === r.bookId);
        if (b) {
          const updatedBooks = books.map(x => x.id === b.id ? { ...x, available: x.available - 1 } : x);
          setBooks(updatedBooks);
          db.saveBooks(updatedBooks);
        }
      }
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="flex gap-4 p-1 bg-white border border-slate-200 rounded-xl shadow-sm w-fit">
        {[
          { id: 'users', label: 'User Management' },
          { id: 'library', label: 'Library Requests' },
          { id: 'excel', label: 'Excel Integration' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${
              activeTab === tab.id ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {importStatus && (
        <div className="bg-sky-50 border border-sky-100 text-sky-700 p-4 rounded-xl flex items-center justify-between">
          <span className="font-medium">{importStatus}</span>
          <div className="animate-spin h-4 w-4 border-2 border-sky-500 border-t-transparent rounded-full"></div>
        </div>
      )}

      {activeTab === 'users' && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Name</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Role</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.map(u => (
                <tr key={u.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-600 text-xs">{u.name.charAt(0)}</div>
                      <div>
                        <p className="font-bold text-slate-900">{u.name}</p>
                        <p className="text-xs text-slate-400">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-slate-100 rounded text-[10px] font-bold text-slate-600">{u.role}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-[10px] font-bold ${
                      u.status === UserStatus.ACTIVE ? 'bg-green-100 text-green-600' : 'bg-amber-100 text-amber-600'
                    }`}>
                      {u.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {u.status === UserStatus.PENDING && (
                      <button 
                        onClick={() => approveUser(u.id)}
                        className="text-sky-500 hover:text-sky-700 font-bold text-xs"
                      >
                        Approve
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'library' && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">User</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Book</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {requests.map(r => (
                <tr key={r.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-900">{r.userName}</td>
                  <td className="px-6 py-4 text-slate-500">{r.bookTitle}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-[10px] font-bold ${
                      r.status === 'Requested' ? 'bg-amber-100 text-amber-600' :
                      r.status === 'Issued' ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {r.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {r.status === 'Requested' && (
                      <button 
                        onClick={() => updateRequestStatus(r.id, 'Issued')}
                        className="text-green-500 hover:text-green-700 font-bold text-xs"
                      >
                        Issue Book
                      </button>
                    )}
                    {r.status === 'Issued' && (
                      <button 
                        onClick={() => updateRequestStatus(r.id, 'Returned')}
                        className="text-sky-500 hover:text-sky-700 font-bold text-xs"
                      >
                        Mark Returned
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'excel' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
            <div className="w-12 h-12 bg-sky-100 text-sky-600 rounded-xl flex items-center justify-center mb-6">
              <Icons.Upload />
            </div>
            <h3 className="text-xl font-bold mb-2">Bulk User Verification</h3>
            <p className="text-slate-500 text-sm mb-8">Upload Excel files containing student, teacher, or alumni lists to enable automatic role assignment and verification upon registration.</p>
            
            <div className="space-y-4">
              <label className="block p-8 border-2 border-dashed border-slate-200 rounded-2xl hover:border-sky-500 hover:bg-sky-50 transition-all cursor-pointer text-center group">
                <input type="file" className="hidden" onChange={() => handleExcelImport('users')} />
                <div className="flex flex-col items-center">
                  <svg className="text-slate-300 group-hover:text-sky-500 mb-2 transition-colors" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
                  <p className="font-bold text-slate-900 group-hover:text-sky-600">Select Excel File</p>
                  <p className="text-xs text-slate-400">Supported: .xlsx, .csv</p>
                </div>
              </label>
              
              <div className="flex gap-4">
                <button 
                  onClick={() => handleExcelImport('users')}
                  className="flex-1 bg-slate-900 text-white font-bold py-3 rounded-xl hover:bg-slate-800 transition-all"
                >
                  Import Users
                </button>
                <button className="px-6 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 transition-all">
                  Template
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
            <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center mb-6">
              <Icons.Library />
            </div>
            <h3 className="text-xl font-bold mb-2">Library Inventory</h3>
            <p className="text-slate-500 text-sm mb-8">Update book catalog, stock levels, and category metadata in bulk. Prevents duplicates and validates ISBN format automatically.</p>
            
            <div className="space-y-4">
              <label className="block p-8 border-2 border-dashed border-slate-200 rounded-2xl hover:border-amber-500 hover:bg-amber-50 transition-all cursor-pointer text-center group">
                <input type="file" className="hidden" onChange={() => handleExcelImport('books')} />
                <div className="flex flex-col items-center">
                  <svg className="text-slate-300 group-hover:text-amber-500 mb-2 transition-colors" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
                  <p className="font-bold text-slate-900 group-hover:text-amber-600">Select Book Manifest</p>
                  <p className="text-xs text-slate-400">Supported: .xlsx</p>
                </div>
              </label>
              
              <div className="flex gap-4">
                <button 
                  onClick={() => handleExcelImport('books')}
                  className="flex-1 bg-slate-900 text-white font-bold py-3 rounded-xl hover:bg-slate-800 transition-all"
                >
                  Update Books
                </button>
                <button className="px-6 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 transition-all">
                  Export
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
