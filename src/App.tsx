// src/App.tsx
import React, { useEffect, useState } from 'react';
import LoginForm from './components/AuthLoginForm';
import { UserTypeBadge } from './components/UserTypeSelector';
import { UserTypeService } from './lib/userTypeService';
import { User } from './types/user';
import { LocalMultiTierDatabase } from './lib/localStorage';

function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [database, setDatabase] = useState<LocalMultiTierDatabase | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = UserTypeService.getCurrentUser();
    if (user) {
      const db = new LocalMultiTierDatabase({
        userType: user.userType,
        userId: user.id,
        sessionId: 'current'
      });
      setCurrentUser(user);
      setDatabase(db);
    }
    setLoading(false);
  }, []);

  const handleLoginSuccess = (user: User, userDatabase: LocalMultiTierDatabase) => {
    setCurrentUser(user);
    setDatabase(userDatabase);
  };

  const handleLogout = () => {
    UserTypeService.logout();
    setCurrentUser(null);
    setDatabase(null);
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!currentUser || !database) {
    return <LoginForm onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <h1 className="text-3xl font-bold text-gray-900">Syllabox AI</h1>
              <div className="ml-4">
                <UserTypeBadge userType={currentUser.userType} />
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Welcome, {currentUser.name}</span>
              <button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium">
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2">Dashboard</h2>
          <p className="text-gray-700">You are logged in as <span className="font-medium">{currentUser.userType}</span>.</p>
        </div>
      </main>
    </div>
  );
}

export default App;