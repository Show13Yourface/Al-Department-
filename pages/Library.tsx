
import React, { useState, useEffect } from 'react';
import { User, Book, BorrowRecord, UserRole } from '../types';
import { db } from '../services/db';

interface LibraryProps {
  user: User;
}

const Library: React.FC<LibraryProps> = ({ user }) => {
  const [books, setBooks] = useState<Book[]>([]);
  const [myBorrows, setMyBorrows] = useState<BorrowRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    setBooks(db.getBooks());
    setMyBorrows(db.getBorrows().filter(b => b.userId === user.id));
  }, [user.id]);

  const requestBook = (book: Book) => {
    if (book.available === 0) {
      alert("No copies available right now.");
      return;
    }
    
    const newRecord: BorrowRecord = {
      id: Math.random().toString(36).substr(2, 9),
      bookId: book.id,
      bookTitle: book.title,
      userId: user.id,
      userName: user.name,
      issueDate: new Date().toISOString().split('T')[0],
      status: 'Requested'
    };

    db.saveBorrow(newRecord);
    setMessage(`Request submitted for "${book.title}". Please visit the department library for collection.`);
    setMyBorrows(prev => [...prev, newRecord]);
    
    // Auto-clear message
    setTimeout(() => setMessage(null), 5000);
  };

  const filteredBooks = books.filter(b => 
    b.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    b.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      {message && (
        <div className="bg-sky-50 border border-sky-100 text-sky-700 p-4 rounded-xl flex items-center justify-between">
          <span className="font-medium">{message}</span>
          <button onClick={() => setMessage(null)} className="text-sky-400 hover:text-sky-600">×</button>
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <input 
            type="text" 
            placeholder="Search by title or author..."
            className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-sky-500 outline-none transition-all"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
          <svg className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"></circle><path d="M21 21l-4.35-4.35"></path></svg>
        </div>
        
        <div className="flex gap-2 bg-white p-1 rounded-xl border border-slate-200 shadow-sm">
          <button className="px-4 py-2 text-sm font-bold bg-slate-900 text-white rounded-lg">All Books</button>
          <button className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 rounded-lg transition-colors">Available</button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-xl font-bold text-slate-900">Catalogue</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {filteredBooks.map(book => (
              <div key={book.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between hover:shadow-lg transition-all group">
                <div>
                  <div className="w-full h-48 bg-slate-50 rounded-xl mb-4 flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-sky-500/10 to-indigo-500/10"></div>
                    <svg className="text-slate-300 group-hover:scale-110 transition-transform" width="64" height="64" fill="none" stroke="currentColor" strokeWidth="1" viewBox="0 0 24 24"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>
                    <div className="absolute bottom-3 left-3 flex gap-1">
                      <span className="px-2 py-0.5 bg-white/80 backdrop-blur rounded text-[10px] font-bold text-slate-600 uppercase tracking-tighter shadow-sm">
                        {book.category}
                      </span>
                    </div>
                  </div>
                  <h3 className="font-bold text-slate-900 mb-1 group-hover:text-sky-600 transition-colors">{book.title}</h3>
                  <p className="text-sm text-slate-500 mb-4">{book.author}</p>
                </div>
                <div className="flex items-center justify-between border-t border-slate-50 pt-4 mt-2">
                  <div className="text-xs">
                    <span className="text-slate-400">Available: </span>
                    <span className={`font-bold ${book.available > 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {book.available}/{book.copies}
                    </span>
                  </div>
                  <button 
                    onClick={() => requestBook(book)}
                    disabled={book.available === 0}
                    className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                      book.available > 0 
                      ? 'bg-slate-900 text-white hover:bg-sky-500' 
                      : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    Request Issue
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="text-xl font-bold text-slate-900">Borrow History</h2>
          {myBorrows.length === 0 ? (
            <div className="bg-white p-12 rounded-2xl border border-dashed border-slate-200 text-center text-slate-400">
              <p className="text-sm">You haven't requested any books yet.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {myBorrows.map(record => (
                <div key={record.id} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-bold text-slate-900 leading-tight">{record.bookTitle}</h4>
                    <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
                      record.status === 'Requested' ? 'bg-amber-100 text-amber-600' :
                      record.status === 'Issued' ? 'bg-green-100 text-green-600' :
                      record.status === 'Returned' ? 'bg-slate-100 text-slate-600' : 'bg-red-100 text-red-600'
                    }`}>
                      {record.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-400 mt-3">
                    <p>Requested: {record.issueDate}</p>
                    {record.returnDate && <p>Returned: {record.returnDate}</p>}
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="bg-amber-50 p-6 rounded-2xl border border-amber-100">
            <h3 className="text-amber-800 font-bold text-sm mb-2 flex items-center gap-2">
              <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/></svg>
              Library Rules
            </h3>
            <ul className="text-xs text-amber-700 space-y-2 list-disc pl-4">
              <li>Max 2 books per student at a time.</li>
              <li>Standard issue period is 14 days.</li>
              <li>Late return fee: 5 BDT per day.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Library;
