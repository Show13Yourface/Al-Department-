
import { User, Book, BorrowRecord, Notice, UserRole, UserStatus } from '../types';

const STORAGE_KEYS = {
  USERS: 'mbstu_users',
  BOOKS: 'mbstu_books',
  BORROWS: 'mbstu_borrows',
  NOTICES: 'mbstu_notices',
  VERIFIED_EMAILS: 'mbstu_verified_emails'
};

// Initial Data
const INITIAL_BOOKS: Book[] = [
  { id: '1', title: 'Macroeconomics', author: 'N. Gregory Mankiw', isbn: '978-1464182891', copies: 5, available: 3, category: 'Core Economics' },
  { id: '2', title: 'Principles of Economics', author: 'Alfred Marshall', isbn: '978-1607963288', copies: 2, available: 1, category: 'Foundation' },
  { id: '3', title: 'Capital in the Twenty-First Century', author: 'Thomas Piketty', isbn: '978-0674430006', copies: 3, available: 3, category: 'Development' }
];

const INITIAL_NOTICES: Notice[] = [
  { id: '1', title: 'Semester Final Examination Schedule', content: 'The final examination for the 4th Year 2nd Semester will start from June 15th.', date: '2024-05-20', category: 'Exam', author: 'Dept. Head' },
  { id: '2', title: 'New Research Seminar', content: 'Dr. Rahim will present a seminar on "Digital Economy Trends" this Friday.', date: '2024-05-22', category: 'Academic', author: 'Coordinator' }
];

export const db = {
  getUsers: (): User[] => JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]'),
  
  saveUser: (user: User) => {
    const users = db.getUsers();
    const existingIndex = users.findIndex(u => u.id === user.id);
    if (existingIndex > -1) {
      users[existingIndex] = user;
    } else {
      users.push(user);
    }
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  },

  getBooks: (): Book[] => {
    const stored = localStorage.getItem(STORAGE_KEYS.BOOKS);
    if (!stored) {
      localStorage.setItem(STORAGE_KEYS.BOOKS, JSON.stringify(INITIAL_BOOKS));
      return INITIAL_BOOKS;
    }
    return JSON.parse(stored);
  },

  saveBooks: (books: Book[]) => {
    localStorage.setItem(STORAGE_KEYS.BOOKS, JSON.stringify(books));
  },

  getBorrows: (): BorrowRecord[] => JSON.parse(localStorage.getItem(STORAGE_KEYS.BORROWS) || '[]'),

  saveBorrow: (record: BorrowRecord) => {
    const borrows = db.getBorrows();
    const idx = borrows.findIndex(b => b.id === record.id);
    if (idx > -1) borrows[idx] = record;
    else borrows.push(record);
    localStorage.setItem(STORAGE_KEYS.BORROWS, JSON.stringify(borrows));
  },

  getNotices: (): Notice[] => {
    const stored = localStorage.getItem(STORAGE_KEYS.NOTICES);
    if (!stored) {
      localStorage.setItem(STORAGE_KEYS.NOTICES, JSON.stringify(INITIAL_NOTICES));
      return INITIAL_NOTICES;
    }
    return JSON.parse(stored);
  },

  // Verification List (Mocking Excel Import)
  getVerifiedEmails: (): {email: string, role: UserRole}[] => 
    JSON.parse(localStorage.getItem(STORAGE_KEYS.VERIFIED_EMAILS) || '[]'),
  
  addVerifiedEmails: (list: {email: string, role: UserRole}[]) => {
    const current = db.getVerifiedEmails();
    const updated = [...current, ...list.filter(item => !current.find(c => c.email === item.email))];
    localStorage.setItem(STORAGE_KEYS.VERIFIED_EMAILS, JSON.stringify(updated));
  }
};
