
import React, { useState } from 'react';
import { User, UserRole, UserStatus } from '../types';
import { db } from '../services/db';

interface LoginPageProps {
  onLogin: (user: User) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [message, setMessage] = useState<{type: 'error' | 'success', text: string} | null>(null);

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (isRegister) {
      const existing = db.getUsers().find(u => u.email === email);
      if (existing) {
        setMessage({ type: 'error', text: 'Email already registered.' });
        return;
      }

      // Check verification list
      const verified = db.getVerifiedEmails().find(v => v.email === email);
      const newUser: User = {
        id: Math.random().toString(36).substr(2, 9),
        email,
        name,
        role: verified ? verified.role : UserRole.GUEST,
        status: verified ? UserStatus.ACTIVE : UserStatus.PENDING,
      };

      db.saveUser(newUser);
      setMessage({ 
        type: 'success', 
        text: verified ? 'Account created and verified! Logging in...' : 'Account created. Admin approval pending.' 
      });
      
      if (verified) {
        setTimeout(() => onLogin(newUser), 1500);
      } else {
        setIsRegister(false);
      }
    } else {
      // Simple Login
      const user = db.getUsers().find(u => u.email === email);
      if (!user) {
        setMessage({ type: 'error', text: 'User not found.' });
      } else {
        onLogin(user);
      }
    }
  };

  const simulateGoogleLogin = () => {
    const mockEmail = "student@mbstu.ac.bd";
    const existing = db.getUsers().find(u => u.email === mockEmail);
    if (existing) {
      onLogin(existing);
    } else {
      const newUser: User = {
        id: 'google-123',
        email: mockEmail,
        name: 'John Doe (Google)',
        role: UserRole.STUDENT,
        status: UserStatus.ACTIVE,
      };
      db.saveUser(newUser);
      onLogin(newUser);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <div className="md:w-1/2 bg-slate-900 p-12 flex flex-col justify-between text-white relative overflow-hidden">
        <div className="z-10">
          <div className="flex items-center gap-3 mb-12">
            <div className="w-12 h-12 bg-sky-500 rounded-xl flex items-center justify-center font-bold text-2xl">E</div>
            <h1 className="text-2xl font-bold tracking-tight">MBSTU Economics</h1>
          </div>
          <h2 className="text-4xl font-extrabold mb-6 leading-tight">Digital Department <br/>Management System</h2>
          <p className="text-slate-400 text-lg max-w-md">The unified hub for students, teachers, and alumni of the Department of Economics.</p>
        </div>
        
        <div className="z-10 space-y-4">
          <div className="flex gap-4">
            <div className="bg-white/5 p-4 rounded-xl backdrop-blur-sm border border-white/10 flex-1">
              <p className="text-sky-400 font-bold text-2xl mb-1">2.5k+</p>
              <p className="text-xs text-slate-400 uppercase tracking-widest">Active Students</p>
            </div>
            <div className="bg-white/5 p-4 rounded-xl backdrop-blur-sm border border-white/10 flex-1">
              <p className="text-sky-400 font-bold text-2xl mb-1">500+</p>
              <p className="text-xs text-slate-400 uppercase tracking-widest">Alumni Network</p>
            </div>
          </div>
        </div>

        <div className="absolute top-0 right-0 w-96 h-96 bg-sky-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl translate-y-1/4 -translate-x-1/4"></div>
      </div>

      <div className="md:w-1/2 flex items-center justify-center p-8 bg-slate-50">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-slate-900">{isRegister ? 'Create an Account' : 'Welcome Back'}</h3>
            <p className="text-slate-500">Universal access for all department members</p>
          </div>

          {message && (
            <div className={`p-4 rounded-lg mb-6 text-sm font-medium ${message.type === 'error' ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-green-50 text-green-600 border border-green-100'}`}>
              {message.text}
            </div>
          )}

          <form onSubmit={handleAuth} className="space-y-4">
            {isRegister && (
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Full Name</label>
                <input 
                  type="text" required 
                  value={name} onChange={e => setName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-sky-500 outline-none transition-all"
                  placeholder="e.g. Abdullah Al Mamun"
                />
              </div>
            )}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Email Address</label>
              <input 
                type="email" required 
                value={email} onChange={e => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-sky-500 outline-none transition-all"
                placeholder="email@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Password</label>
              <input 
                type="password" required 
                value={password} onChange={e => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-sky-500 outline-none transition-all"
                placeholder="••••••••"
              />
            </div>

            <button 
              type="submit"
              className="w-full bg-slate-900 text-white font-bold py-3 rounded-xl hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/10"
            >
              {isRegister ? 'Register Now' : 'Sign In'}
            </button>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200"></div></div>
            <div className="relative flex justify-center text-xs uppercase"><span className="bg-slate-50 px-2 text-slate-400">Or continue with</span></div>
          </div>

          <button 
            onClick={simulateGoogleLogin}
            className="w-full bg-white border border-slate-200 text-slate-700 font-semibold py-3 rounded-xl hover:bg-slate-50 transition-all flex items-center justify-center gap-2 mb-6 shadow-sm"
          >
            <svg width="20" height="20" viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24s.92 7.54 2.56 10.78l7.97-6.19z"></path><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path></svg>
            Sign in with Google
          </button>

          <p className="text-center text-sm text-slate-500">
            {isRegister ? 'Already have an account?' : "Don't have an account?"}
            <button 
              onClick={() => setIsRegister(!isRegister)}
              className="ml-1 text-sky-600 font-bold hover:underline"
            >
              {isRegister ? 'Sign In' : 'Register'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
