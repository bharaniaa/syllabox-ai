//Main App Component for Syllabox AI
// Multi-tier database system with role-based access control

import React, { useState, useEffect } from 'react';
import { User, UserType } from './types/user';
import { UserTypeService } from './lib/userTypeService';
import { LocalMultiTierDatabase } from './lib/localDatabase';
import { LoginForm } from './components/LoginForm';
import { UserTypeBadge } from './components/UserTypeSelector';

// Dashboard Components for each user type
const AdminDashboard: React.FC<{ user: User; database: LocalMultiTierDatabase | null }> = ({ user, database }) => {
  const [systemData, setSystemData] = useState<any>(null);
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    if (database) {
      try {
        // Load admin data (only accessible to admin)
        const adminData = database.getSystemData();
        setSystemData(adminData);
        
        // Load all users (admin only)
        const allUsers = UserTypeService.getAllUsers();
        setUsers(allUsers);
      } catch (error) {
        console.error('Error loading admin data:', error);
      }
    }
  }, [database]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="px-4 py-6 sm:px-0">
          <div className="border-4 border-dashed border-gray-200 rounded-lg p-6">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">🎓 Syllabox AI</h1>
              <h2 className="text-2xl font-semibold text-gray-700 mb-4">Admin Dashboard</h2>
              <div className="flex items-center justify-center space-x-4 mb-6">
                <p className="text-gray-600">Welcome, <span className="font-semibold">{user.name}</span></p>
                <UserTypeBadge userType={user.userType} />
              </div>
              <button
                onClick={() => {
                  UserTypeService.logout();
                  window.location.reload();
                }}
                className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
              >
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* System Analytics */}
        <div className="px-4 py-6 sm:px-0">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-2">System Analytics</h3>
              <p className="text-gray-600">Total Users: {users.length}</p>
              <p className="text-gray-600">Active Users: {systemData?.activeUsers || 0}</p>
              <p className="text-gray-600">System Health: {systemData?.systemHealth || 'Unknown'}</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-2">User Distribution</h3>
              <p className="text-gray-600">Admins: {users.filter(u => u.userType === 'admin').length}</p>
              <p className="text-gray-600">Staff: {users.filter(u => u.userType === 'staff').length}</p>
              <p className="text-gray-600">Students: {users.filter(u => u.userType === 'student').length}</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-2">System Status</h3>
              <p className="text-gray-600">Last Backup: {systemData?.lastBackup ? new Date(systemData.lastBackup).toLocaleDateString() : 'N/A'}</p>
              <p className="text-gray-600">Analytics: {systemData?.featureFlags?.enableAdvancedAnalytics ? 'Enabled' : 'Disabled'}</p>
            </div>
          </div>
        </div>

        {/* User List */}
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium leading-6 text-gray-900">All Users</h3>
              <div className="mt-4 space-y-4">
                {users.map(user => (
                  <div key={user.id} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-gray-600">{user.email}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <UserTypeBadge userType={user.userType} />
                      <span className={`text-sm ${user.isActive ? 'text-green-600' : 'text-red-600'}`}>
                        {user.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const StaffDashboard: React.FC<{ user: User; database: LocalMultiTierDatabase | null }> = ({ user, database }) => {
  const [educationalData, setEducationalData] = useState<any>(null);

  useEffect(() => {
    if (database) {
      try {
        // Load staff data (only accessible to staff)
        const staffData = database.getEducationalData();
        setEducationalData(staffData);
      } catch (error) {
        console.error('Error loading staff data:', error);
      }
    }
  }, [database]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="px-4 py-6 sm:px-0">
          <div className="border-4 border-dashed border-gray-200 rounded-lg p-6">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">🎓 Syllabox AI</h1>
              <h2 className="text-2xl font-semibold text-gray-700 mb-4">Staff Dashboard</h2>
              <div className="flex items-center justify-center space-x-4 mb-6">
                <p className="text-gray-600">Welcome, <span className="font-semibold">{user.name}</span></p>
                <UserTypeBadge userType={user.userType} />
              </div>
              <button
                onClick={() => {
                  UserTypeService.logout();
                  window.location.reload();
                }}
                className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
              >
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Educational Content */}
        <div className="px-4 py-6 sm:px-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-2">My Content</h3>
              <p className="text-gray-600">Lessons Created: {educationalData?.lessonsCreated || 0}</p>
              <p className="text-gray-600">Quizzes Created: {educationalData?.quizzesCreated || 0}</p>
              <p className="text-gray-600">Assessments: {educationalData?.assessmentsCreated || 0}</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-2">Management</h3>
              <p className="text-gray-600">Courses Owned: {educationalData?.coursesOwned?.length || 0}</p>
              <p className="text-gray-600">Students Managed: {educationalData?.studentsManaged?.length || 0}</p>
              <p className="text-gray-600">Last Activity: {educationalData?.lastActivity ? new Date(educationalData.lastActivity).toLocaleDateString() : 'N/A'}</p>
            </div>
          </div>
        </div>

        {/* Lesson Plans */}
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium leading-6 text-gray-900">My Lesson Plans</h3>
              <div className="mt-4 space-y-4">
                {educationalData?.lessonPlans?.length > 0 ? (
                  educationalData.lessonPlans.map((lesson: any) => (
                    <div key={lesson.id} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                      <div>
                        <p className="font-medium">{lesson.title}</p>
                        <p className="text-gray-600">{lesson.subject}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          lesson.status === 'published' ? 'bg-green-100 text-green-800' :
                          lesson.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {lesson.status}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-600 text-center py-4">No lesson plans created yet</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const StudentDashboard: React.FC<{ user: User; database: LocalMultiTierDatabase | null }> = ({ user, database }) => {
  const [progressData, setProgressData] = useState<any>(null);

  useEffect(() => {
    if (database) {
      try {
        // Load student progress (only accessible to student)
        const studentData = database.getProgressData();
        setProgressData(studentData);
      } catch (error) {
        console.error('Error loading student data:', error);
      }
    }
  }, [database]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="px-4 py-6 sm:px-0">
          <div className="border-4 border-dashed border-gray-200 rounded-lg p-6">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">🎓 Syllabox AI</h1>
              <h2 className="text-2xl font-semibold text-gray-700 mb-4">Student Dashboard</h2>
              <div className="flex items-center justify-center space-x-4 mb-6">
                <p className="text-gray-600">Welcome, <span className="font-semibold">{user.name}</span></p>
                <UserTypeBadge userType={user.userType} />
              </div>
              <button
                onClick={() => {
                  UserTypeService.logout();
                  window.location.reload();
                }}
                className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
              >
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Progress Overview */}
        <div className="px-4 py-6 sm:px-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-2">My Progress</h3>
              <p className="text-gray-600">Courses Enrolled: {progressData?.coursesEnrolled?.length || 0}</p>
              <p className="text-gray-600">Quizzes Completed: {progressData?.quizScores?.length || 0}</p>
              <p className="text-gray-600">Current Streak: {progressData?.currentStreak || 0} days</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-2">Learning Stats</h3>
              <p className="text-gray-600">Assignments Completed: {progressData?.assignmentsCompleted || 0}</p>
              <p className="text-gray-600">Total Study Time: {progressData?.totalStudyTime || 0} minutes</p>
              <p className="text-gray-600">Achievements: {progressData?.achievements?.length || 0}</p>
            </div>
          </div>
        </div>

        {/* Quiz Scores */}
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium leading-6 text-gray-900">My Quiz Scores</h3>
              <div className="mt-4 space-y-4">
                {progressData?.quizScores?.length > 0 ? (
                  progressData.quizScores.map((score: any, index: number) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                      <div>
                        <p className="font-medium">Quiz {score.quizId}</p>
                        <p className="text-gray-600">Completed: {new Date(score.completedAt).toLocaleDateString()}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{score.score}/{score.maxScore}</p>
                        <p className="text-gray-600">{Math.round((score.score / score.maxScore) * 100)}%</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-600 text-center py-4">No quizzes completed yet</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main App Component
function App() {
  const [user, setUser] = useState<User | null>(null);
  const [database, setDatabase] = useState<LocalMultiTierDatabase | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session on app load
    const currentUser = UserTypeService.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
      // Initialize database for current user
      const db = new LocalMultiTierDatabase({
        userType: currentUser.userType,
        userId: currentUser.id,
        sessionId: 'current'
      });
      setDatabase(db);
    }
    setIsLoading(false);
  }, []);

  const handleLoginSuccess = (loggedInUser: User, db: LocalMultiTierDatabase) => {
    setUser(loggedInUser);
    setDatabase(db);
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading Syllabox AI...</p>
        </div>
      </div>
    );
  }

  // Show login form if not authenticated
  if (!user || !database) {
    return <LoginForm onLoginSuccess={handleLoginSuccess} />;
  }

  // Show appropriate dashboard based on user type
  switch (user.userType) {
    case 'admin':
      return <AdminDashboard user={user} database={database} />;
    case 'staff':
      return <StaffDashboard user={user} database={database} />;
    case 'student':
      return <StudentDashboard user={user} database={database} />;
    default:
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
            <p className="text-gray-600">Unknown user type: {user.userType}</p>
            <button
              onClick={() => {
                UserTypeService.logout();
                window.location.reload();
              }}
              className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Go to Login
            </button>
          </div>
        </div>
      );
  }
}

export default App;