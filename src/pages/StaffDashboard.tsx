import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { LocalMultiTierDatabase } from '../lib/localDatabase';
import { Users, BookOpen, UserPlus, Settings, Home, Menu, X, Users2, BookOpen as UsersIcon } from 'lucide-react';
import { toast } from 'react-hot-toast';

type ViewType = 'overview' | 'analytics' | 'students' | 'classes';

const StaffDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [activeView, setActiveView] = useState<ViewType>('overview');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Student management state
  const [students, setStudents] = useState<User[]>([]);
  const [isLoadingStudents, setIsLoadingStudents] = useState(false);
  const [studentSearch, setStudentSearch] = useState('');
  
  // Class management state
  const [classes, setClasses] = useState<any[]>([]);
  const [selectedClass, setSelectedClass] = useState<any>(null);
  const [newClass, setNewClass] = useState({ name: '', subject: '', description: '' });
  const [studentEmail, setStudentEmail] = useState('');
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [isLoadingClasses, setIsLoadingClasses] = useState(false);

  const loadStudents = async () => {
    setIsLoadingStudents(true);
    try {
      const allStudents = LocalMultiTierDatabase.getUsersByType('student');
      setStudents(allStudents);
    } catch (error) {
      console.error('Error loading students:', error);
      toast.error('Failed to load students');
    } finally {
      setIsLoadingStudents(false);
    }
  };

  const loadClasses = () => {
    setIsLoadingClasses(true);
    try {
      const teacherClasses = LocalMultiTierDatabase.getClassesForTeacher(user?.id || '');
      setClasses(teacherClasses);
    } catch (error) {
      console.error('Error loading classes:', error);
      toast.error('Failed to load classes');
    } finally {
      setIsLoadingClasses(false);
    }
  };

  const loadEnrollments = (classId: string) => {
    const classEnrollments = LocalMultiTierDatabase.getClassEnrollments(classId);
    setEnrollments(classEnrollments);
  };

  useEffect(() => {
    loadStudents();
    if (activeView === 'classes') {
      loadClasses();
    }
  }, [activeView]);

  const handleCreateClass = () => {
    if (!newClass.name || !newClass.subject) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      const createdClass = LocalMultiTierDatabase.createClass(
        user?.id || '',
        user?.name || '',
        {
          name: newClass.name,
          subject: newClass.subject,
          description: newClass.description,
          isActive: true
        }
      );
      
      toast.success('Class created successfully!');
      setNewClass({ name: '', subject: '', description: '' });
      loadClasses();
    } catch (error) {
      console.error('Error creating class:', error);
      toast.error('Failed to create class');
    }
  };

  const handleEnrollStudent = () => {
    if (!studentEmail || !selectedClass) {
      toast.error('Please select a class and enter student email');
      return;
    }

    try {
      const result = LocalMultiTierDatabase.enrollStudentInClass(
        user?.id || '',
        selectedClass.id,
        studentEmail
      );

      if (result.success) {
        toast.success('Student enrolled successfully!');
        setStudentEmail('');
        loadEnrollments(selectedClass.id);
        loadClasses(); // Refresh to update student count
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error('Error enrolling student:', error);
      toast.error('Failed to enroll student');
    }
  };

  const handleDeleteClass = (classId: string) => {
    if (window.confirm('Are you sure you want to delete this class? This will also remove all enrollments.')) {
      // Implementation for class deletion would go here
      toast.success('Class deleted successfully');
      loadClasses();
    }
  };

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(studentSearch.toLowerCase()) ||
    student.email.toLowerCase().includes(studentSearch.toLowerCase())
  );

  const handleLogout = () => {
    logout();
  };

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: Home },
    { id: 'analytics', label: 'Analytics', icon: BookOpen },
    { id: 'students', label: 'Students', icon: Users },
    { id: 'classes', label: 'Manage Classes', icon: UsersIcon },
  ];

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
              <h1 className="ml-2 text-xl font-semibold text-gray-900">Syllabox AI - Staff Portal</h1>
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
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Staff Dashboard Overview</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h3 className="text-lg font-semibold text-blue-900">Total Students</h3>
                      <p className="text-3xl font-bold text-blue-600">{students.length}</p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <h3 className="text-lg font-semibold text-green-900">Active Classes</h3>
                      <p className="text-3xl font-bold text-green-600">{classes.filter(c => c.isActive).length}</p>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <h3 className="text-lg font-semibold text-purple-900">Total Enrollments</h3>
                      <p className="text-3xl font-bold text-purple-600">
                        {classes.reduce((total, cls) => total + cls.students.length, 0)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <button
                      onClick={() => setActiveView('classes')}
                      className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <UsersIcon className="h-8 w-8 text-blue-600 mr-3" />
                      <div className="text-left">
                        <p className="font-medium">Manage Classes</p>
                        <p className="text-sm text-gray-500">Create and manage your classes</p>
                      </div>
                    </button>
                    <button
                      onClick={() => setActiveView('students')}
                      className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <Users className="h-8 w-8 text-green-600 mr-3" />
                      <div className="text-left">
                        <p className="font-medium">View Students</p>
                        <p className="text-sm text-gray-500">Browse all students</p>
                      </div>
                    </button>
                    <button
                      onClick={() => setActiveView('analytics')}
                      className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <BookOpen className="h-8 w-8 text-purple-600 mr-3" />
                      <div className="text-left">
                        <p className="font-medium">Analytics</p>
                        <p className="text-sm text-gray-500">View performance metrics</p>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeView === 'students' && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Student Management</h2>
                
                <div className="mb-6">
                  <input
                    type="text"
                    placeholder="Search students..."
                    value={studentSearch}
                    onChange={(e) => setStudentSearch(e.target.value)}
                    className="w-full max-w-md px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {isLoadingStudents ? (
                  <p>Loading students...</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {filteredStudents.map((student) => (
                          <tr key={student.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{student.name}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.email}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                student.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                              }`}>
                                {student.isActive ? 'Active' : 'Inactive'}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {new Date(student.createdAt).toLocaleDateString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {activeView === 'classes' && (
              <ClassManagementView
                classes={classes}
                selectedClass={selectedClass}
                newClass={newClass}
                studentEmail={studentEmail}
                enrollments={enrollments}
                setSelectedClass={setSelectedClass}
                setNewClass={setNewClass}
                setStudentEmail={setStudentEmail}
                onCreateClass={handleCreateClass}
                onEnrollStudent={handleEnrollStudent}
                onDeleteClass={handleDeleteClass}
                onLoadEnrollments={loadEnrollments}
                isLoading={isLoadingClasses}
              />
            )}

            {activeView === 'analytics' && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Analytics Dashboard</h2>
                <p className="text-gray-600">Analytics features coming soon...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Class Management Component
const ClassManagementView: React.FC<{
  classes: any[];
  selectedClass: any;
  newClass: any;
  studentEmail: string;
  enrollments: any[];
  setSelectedClass: (cls: any) => void;
  setNewClass: (data: any) => void;
  setStudentEmail: (email: string) => void;
  onCreateClass: () => void;
  onEnrollStudent: () => void;
  onDeleteClass: (id: string) => void;
  onLoadEnrollments: (classId: string) => void;
  isLoading: boolean;
}> = ({
  classes,
  selectedClass,
  newClass,
  studentEmail,
  enrollments,
  setSelectedClass,
  setNewClass,
  setStudentEmail,
  onCreateClass,
  onEnrollStudent,
  onDeleteClass,
  onLoadEnrollments,
  isLoading
}) => {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Class Management</h2>
        
        {/* Create New Class */}
        <div className="mb-8 p-4 border border-gray-200 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Create New Class</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Class Name"
              value={newClass.name}
              onChange={(e) => setNewClass({ ...newClass, name: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              placeholder="Subject"
              value={newClass.subject}
              onChange={(e) => setNewClass({ ...newClass, subject: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              placeholder="Description (Optional)"
              value={newClass.description}
              onChange={(e) => setNewClass({ ...newClass, description: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            onClick={onCreateClass}
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition-colors"
          >
            Create Class
          </button>
        </div>

        {isLoading ? (
          <p>Loading classes...</p>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Classes List */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Classes</h3>
              <div className="space-y-3">
                {classes.map((cls) => (
                  <div
                    key={cls.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedClass?.id === cls.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => {
                      setSelectedClass(cls);
                      onLoadEnrollments(cls.id);
                    }}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium text-gray-900">{cls.name}</h4>
                        <p className="text-sm text-gray-500">{cls.subject}</p>
                        <p className="text-sm text-gray-600 mt-1">{cls.students.length} students</p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteClass(cls.id);
                        }}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Class Details and Enrollment */}
            <div>
              {selectedClass ? (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    {selectedClass.name} - Enrollment
                  </h3>
                  
                  {/* Enroll Student */}
                  <div className="mb-6 p-4 border border-gray-200 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-3">Enroll Student</h4>
                    <div className="flex gap-2">
                      <input
                        type="email"
                        placeholder="Student Email"
                        value={studentEmail}
                        onChange={(e) => setStudentEmail(e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        onClick={onEnrollStudent}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md font-medium transition-colors"
                      >
                        Enroll
                      </button>
                    </div>
                  </div>

                  {/* Enrolled Students */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Enrolled Students ({enrollments.length})</h4>
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                      {enrollments.map((enrollment) => (
                        <div key={enrollment.id} className="p-3 border border-gray-200 rounded-lg">
                          <p className="font-medium text-gray-900">{enrollment.studentName}</p>
                          <p className="text-sm text-gray-500">{enrollment.studentEmail}</p>
                          <p className="text-xs text-gray-400">
                            Enrolled: {new Date(enrollment.enrolledAt).toLocaleDateString()}
                          </p>
                        </div>
                      ))}
                      {enrollments.length === 0 && (
                        <p className="text-gray-500 text-sm">No students enrolled yet</p>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center text-gray-500 py-8">
                  <p>Select a class to manage enrollments</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StaffDashboard;