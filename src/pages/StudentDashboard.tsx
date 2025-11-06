import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { LocalMultiTierDatabase } from '../lib/localDatabase';
import { BookOpen, Calendar, Award, Clock, Users, TrendingUp, Home, Menu, X, GraduationCap } from 'lucide-react';
import { toast } from 'react-hot-toast';

type ViewType = 'overview' | 'schedule' | 'assignments' | 'progress';

interface Lesson {
  id: string;
  title: string;
  subject: string;
  teacherName: string;
  content: string;
  completed: boolean;
  dueDate?: string;
  createdAt: string;
}

interface Assignment {
  id: string;
  title: string;
  subject: string;
  teacherName: string;
  description: string;
  dueDate: string;
  status: 'pending' | 'submitted' | 'graded';
  score?: number;
  maxScore?: number;
}

const StudentDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [activeView, setActiveView] = useState<ViewType>('overview');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Student data state
  const [studentData, setStudentData] = useState<any>(null);
  const [enrolledClasses, setEnrolledClasses] = useState<any[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadStudentData = () => {
    if (!user?.id) return;
    
    setIsLoading(true);
    try {
      const data = LocalMultiTierDatabase.getStudentData(user.id);
      setStudentData(data);
    } catch (error) {
      console.error('Error loading student data:', error);
      toast.error('Failed to load student data');
    } finally {
      setIsLoading(false);
    }
  };

  const loadEnrolledClasses = () => {
    if (!user?.id) return;
    
    try {
      const classes = LocalMultiTierDatabase.getEnrolledClassesForStudent(user.id);
      setEnrolledClasses(classes);
    } catch (error) {
      console.error('Error loading enrolled classes:', error);
    }
  };

  const loadLessonsAndAssignments = () => {
    if (!user?.id) return;
    
    try {
      const classContent = LocalMultiTierDatabase.getStudentClassContent(user.id);
      
      // Separate lessons and assignments
      const lessonsData: Lesson[] = classContent
        .filter(content => content.type === 'lesson')
        .map(content => {
          const classInfo = enrolledClasses.find(cls => cls.id === content.classId);
          return {
            id: content.id,
            title: content.title,
            subject: classInfo?.subject || 'Unknown',
            teacherName: classInfo?.teacherName || 'Unknown Teacher',
            content: content.content,
            completed: false, // This would be tracked in a real system
            dueDate: content.dueDate,
            createdAt: content.publishedAt
          };
        });

      const assignmentsData: Assignment[] = classContent
        .filter(content => content.type === 'assignment')
        .map(content => {
          const classInfo = enrolledClasses.find(cls => cls.id === content.classId);
          return {
            id: content.id,
            title: content.title,
            subject: classInfo?.subject || 'Unknown',
            teacherName: classInfo?.teacherName || 'Unknown Teacher',
            description: content.content,
            dueDate: content.dueDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
            status: 'pending' as const
          };
        });

      setLessons(lessonsData);
      setAssignments(assignmentsData);
    } catch (error) {
      console.error('Error loading lessons and assignments:', error);
    }
  };

  useEffect(() => {
    loadStudentData();
  }, [user]);

  useEffect(() => {
    loadEnrolledClasses();
  }, [user]);

  useEffect(() => {
    if (enrolledClasses.length > 0) {
      loadLessonsAndAssignments();
    }
  }, [enrolledClasses]);

  const handleLogout = () => {
    logout();
  };

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: Home },
    { id: 'schedule', label: 'Schedule', icon: Calendar },
    { id: 'assignments', label: 'Assignments', icon: BookOpen },
    { id: 'progress', label: 'Progress', icon: TrendingUp },
  ];

  // Calculate stats
  const stats = {
    enrolledClasses: enrolledClasses.length,
    completedLessons: lessons.filter(l => l.completed).length,
    pendingAssignments: assignments.filter(a => a.status === 'pending').length,
    studyTime: studentData?.totalStudyTime || 0
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
              >
                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
              <h1 className="ml-2 text-xl font-semibold text-gray-900">Syllabox AI - Student Portal</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">Welcome, {user?.name}</span>
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <div className="w-full md:w-64">
            <nav className="bg-white rounded-lg shadow-sm p-4">
              <ul className="space-y-2">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <li key={item.id}>
                      <button
                        onClick={() => setActiveView(item.id as ViewType)}
                        className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                          activeView === item.id
                            ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                        }`}
                      >
                        <Icon className="mr-3 h-5 w-5" />
                        {item.label}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {activeView === 'overview' && (
              <div className="space-y-6">
                {/* Welcome Section */}
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg p-6">
                  <h2 className="text-2xl font-bold mb-2">Welcome back, {user?.name}!</h2>
                  <p className="text-blue-100">
                    {stats.enrolledClasses > 0 
                      ? `You are enrolled in ${stats.enrolledClasses} class${stats.enrolledClasses > 1 ? 'es' : ''}. Keep up the great work!`
                      : 'You have not enrolled in any classes yet. Contact your teacher to get started!'
                    }
                  </p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-white p-6 rounded-lg shadow-sm">
                    <div className="flex items-center">
                      <GraduationCap className="h-8 w-8 text-blue-600" />
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Enrolled Classes</p>
                        <p className="text-2xl font-bold text-gray-900">{stats.enrolledClasses}</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white p-6 rounded-lg shadow-sm">
                    <div className="flex items-center">
                      <BookOpen className="h-8 w-8 text-green-600" />
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Completed Lessons</p>
                        <p className="text-2xl font-bold text-gray-900">{stats.completedLessons}</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white p-6 rounded-lg shadow-sm">
                    <div className="flex items-center">
                      <Clock className="h-8 w-8 text-orange-600" />
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Pending Assignments</p>
                        <p className="text-2xl font-bold text-gray-900">{stats.pendingAssignments}</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white p-6 rounded-lg shadow-sm">
                    <div className="flex items-center">
                      <TrendingUp className="h-8 w-8 text-purple-600" />
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Study Time (hours)</p>
                        <p className="text-2xl font-bold text-gray-900">{Math.round(stats.studyTime / 60)}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recent Classes */}
                {enrolledClasses.length > 0 && (
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Classes</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {enrolledClasses.slice(0, 4).map((cls) => (
                        <div key={cls.id} className="border border-gray-200 rounded-lg p-4">
                          <h4 className="font-medium text-gray-900">{cls.name}</h4>
                          <p className="text-sm text-gray-500">{cls.subject}</p>
                          <p className="text-sm text-gray-600 mt-2">
                            Teacher: {cls.teacherName}
                          </p>
                          <div className="mt-3">
                            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                              {cls.students.length} students
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeView === 'schedule' && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Class Schedule</h2>
                {enrolledClasses.length > 0 ? (
                  <div className="space-y-4">
                    {enrolledClasses.map((cls) => (
                      <div key={cls.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">{cls.name}</h3>
                            <p className="text-gray-600">{cls.subject}</p>
                            <p className="text-sm text-gray-500 mt-1">
                              Teacher: {cls.teacherName}
                            </p>
                            <p className="text-sm text-gray-500">
                              Created: {new Date(cls.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="text-right">
                            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                              {cls.students.length} students
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">You are not enrolled in any classes yet.</p>
                    <p className="text-sm text-gray-500 mt-2">Contact your teacher to get enrolled in classes.</p>
                  </div>
                )}
              </div>
            )}

            {activeView === 'assignments' && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Assignments</h2>
                {assignments.length > 0 ? (
                  <div className="space-y-4">
                    {assignments.map((assignment) => (
                      <div key={assignment.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900">{assignment.title}</h3>
                            <p className="text-gray-600">{assignment.subject}</p>
                            <p className="text-sm text-gray-500 mt-1">
                              Teacher: {assignment.teacherName}
                            </p>
                            <p className="text-sm text-gray-600 mt-2">
                              {assignment.description}
                            </p>
                          </div>
                          <div className="text-right ml-4">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              assignment.status === 'pending' 
                                ? 'bg-yellow-100 text-yellow-800'
                                : assignment.status === 'submitted'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-green-100 text-green-800'
                            }`}>
                              {assignment.status}
                            </span>
                            <p className="text-sm text-gray-500 mt-2">
                              Due: {new Date(assignment.dueDate).toLocaleDateString()}
                            </p>
                            {assignment.score && (
                              <p className="text-sm font-medium text-gray-900 mt-1">
                                Score: {assignment.score}/{assignment.maxScore}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No assignments available yet.</p>
                    <p className="text-sm text-gray-500 mt-2">Your teachers will publish assignments soon.</p>
                  </div>
                )}
              </div>
            )}

            {activeView === 'progress' && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Learning Progress</h2>
                
                <div className="space-y-6">
                  {/* Learning Path */}
                  {studentData?.learningPath && studentData.learningPath.length > 0 ? (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Learning Path</h3>
                      <div className="space-y-4">
                        {studentData.learningPath.map((path: any, index: number) => (
                          <div key={index} className="border border-gray-200 rounded-lg p-4">
                            <div className="flex justify-between items-center mb-2">
                              <h4 className="font-medium text-gray-900">{path.subject}</h4>
                              <span className="text-sm text-gray-500">Level {path.currentLevel}</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                              <div 
                                className="bg-blue-600 h-2 rounded-full" 
                                style={{ width: `${path.progress}%` }}
                              ></div>
                            </div>
                            <p className="text-sm text-gray-600">
                              Next milestone: {path.nextMilestone}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">No learning path data available yet.</p>
                      <p className="text-sm text-gray-500 mt-2">Complete more lessons to see your progress.</p>
                    </div>
                  )}

                  {/* Achievements */}
                  {studentData?.achievements && studentData.achievements.length > 0 ? (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Achievements</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {studentData.achievements.map((achievement: any) => (
                          <div key={achievement.id} className="border border-gray-200 rounded-lg p-4">
                            <div className="flex items-center mb-2">
                              <Award className="h-5 w-5 text-yellow-500 mr-2" />
                              <h4 className="font-medium text-gray-900">{achievement.title}</h4>
                            </div>
                            <p className="text-sm text-gray-600">{achievement.description}</p>
                            <p className="text-xs text-gray-500 mt-2">
                              Earned: {new Date(achievement.earnedAt).toLocaleDateString()}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Award className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">No achievements yet.</p>
                      <p className="text-sm text-gray-500 mt-2">Keep learning to unlock achievements!</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;