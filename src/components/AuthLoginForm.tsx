import React, { useState } from 'react';
import { UserType } from '../types/user';
import { UserTypeService } from '../lib/userTypeService';
import { LocalMultiTierDatabase } from '../lib/localStorage';
import { UserTypeSelector } from './UserTypeSelector';

interface LoginFormProps {
  onLoginSuccess: (user: any, database: LocalMultiTierDatabase) => void;
}

const AuthLoginForm: React.FC<LoginFormProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [userType, setUserType] = useState<UserType | null>(null);
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      if (mode === 'register') {
        if (!userType) throw new Error('Please select a user type');
        await UserTypeService.createUser(email, password, name || email.split('@')[0], userType);
      }
      const { user, database } = await UserTypeService.login(email, password);
      onLoginSuccess(user, database);
    } catch (err: any) {
      setError(err?.message || 'Operation failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="w-full max-w-md bg-white shadow rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-4 text-center">Syllabox AI</h1>
        <div className="flex justify-center mb-4">
          <div className="inline-flex rounded-md shadow-sm" role="group">
            <button type="button" onClick={() => setMode('login')} className={`px-4 py-2 text-sm font-medium border ${mode==='login'?'bg-blue-600 text-white':'bg-white text-gray-700'} rounded-l-md`}>Login</button>
            <button type="button" onClick={() => setMode('register')} className={`px-4 py-2 text-sm font-medium border ${mode==='register'?'bg-blue-600 text-white':'bg-white text-gray-700'} rounded-r-md`}>Register</button>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'register' && (
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input value={name} onChange={(e)=>setName(e.target.value)} className="mt-1 w-full border rounded px-3 py-2" placeholder="Your name" />
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input type="email" value={email} onChange={(e)=>setEmail(e.target.value)} className="mt-1 w-full border rounded px-3 py-2" placeholder="you@example.com" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} className="mt-1 w-full border rounded px-3 py-2" placeholder="••••••••" required />
          </div>
          {mode === 'register' && (
            <div>
              <UserTypeSelector selectedType={userType} onTypeSelect={(t)=>setUserType(t)} />
            </div>
          )}
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded">
            {loading ? 'Please wait...' : (mode === 'login' ? 'Login' : 'Create account')}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AuthLoginForm;
