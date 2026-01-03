
export enum UserRole {
  ADMIN = 'Admin',
  STUDENT = 'Student',
  TEACHER = 'Teacher',
  ALUMNI = 'Alumni',
  GUEST = 'Guest'
}

export enum UserStatus {
  ACTIVE = 'Active',
  PENDING = 'Pending Approval',
  INACTIVE = 'Inactive'
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  status: UserStatus;
  batch?: string;
  section?: string;
  designation?: string;
  graduationYear?: string;
  avatar?: string;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  isbn: string;
  copies: number;
  available: number;
  category: string;
}

export interface BorrowRecord {
  id: string;
  bookId: string;
  bookTitle: string;
  userId: string;
  userName: string;
  issueDate: string;
  returnDate?: string;
  status: 'Requested' | 'Issued' | 'Returned' | 'Late';
}

export interface Notice {
  id: string;
  title: string;
  content: string;
  date: string;
  category: 'Academic' | 'Exam' | 'Event' | 'General';
  author: string;
}
