// Local Multi-Tier Database for Complete Data Isolation
// Each user type has completely separate data storage

import { User, UserType, StaffEducationalData, StudentProgressData, AdminSystemData, Class, StudentEnrollment, ClassContent, AuditLog } from '../types/user';

class LocalMultiTierDatabase {
  private generateId(): string {
    return 'id_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
  }

  private getStorageKey(userType: UserType, userId?: string): string {
    return `syllabox_${userType}_${userId || 'default'}`;
  }

  private getUserData<T>(userType: UserType, userId?: string): T | null {
    const key = this.getStorageKey(userType, userId);
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  }

  private setUserData<T>(userType: UserType, data: T, userId?: string): void {
    const key = this.getStorageKey(userType, userId);
    localStorage.setItem(key, JSON.stringify(data));
  }

  // Admin Methods
  getAdminData(): AdminSystemData {
    let data = this.getUserData<AdminSystemData>('admin');
    if (!data) {
      data = {
        totalUsers: 0,
        activeUsers: 0,
        systemHealth: 'Good',
        lastBackup: new Date().toISOString(),
        featureFlags: {
          enableAdvancedAnalytics: true,
          enableBulkOperations: true,
          enableSystemMonitoring: true,
        },
        auditSettings: {
          logLevel: 'info',
          retentionDays: 30,
        },
      };
      this.setUserData('admin', data);
    }
    return data;
  }

  updateAdminSystemHealth(health: string): void {
    const data = this.getAdminData();
    data.systemHealth = health;
    this.setUserData('admin', data);
  }

  // Staff Methods
  getStaffData(userId: string): StaffEducationalData {
    let data = this.getUserData<StaffEducationalData>('staff', userId);
    if (!data) {
      data = {
        id: this.generateId(),
        userId,
        lessonsCreated: 0,
        quizzesCreated: 0,
        assessmentsCreated: 0,
        coursesOwned: [],
        studentsManaged: [],
        lessonPlans: [],
        quizBank: [],
        lastActivity: new Date().toISOString(),
      };
      this.setUserData('staff', data, userId);
    }
    return data;
  }

  // Student Methods
  getStudentData(userId: string): StudentProgressData {
    let data = this.getUserData<StudentProgressData>('student', userId);
    if (!data) {
      data = {
        id: this.generateId(),
        userId,
        coursesEnrolled: [],
        quizScores: [],
        assignmentsCompleted: 0,
        totalStudyTime: 0,
        currentStreak: 0,
        achievements: [],
        learningPath: [],
        lastActivity: new Date().toISOString(),
      };
      this.setUserData('student', data, userId);
    }
    return data;
  }

  // Class Management Methods
  createClass(teacherId: string, teacherName: string, classData: Omit<Class, 'id' | 'teacherId' | 'teacherName' | 'createdAt' | 'students'>): Class {
    const allClasses = this.getAllClasses();
    const newClass: Class = {
      ...classData,
      id: this.generateId(),
      teacherId,
      teacherName,
      createdAt: new Date().toISOString(),
      students: [],
    };
    
    allClasses.push(newClass);
    this.setAllClasses(allClasses);
    
    // Update teacher's educational data
    const staffData = this.getStaffData(teacherId);
    staffData.coursesOwned.push(newClass.id);
    staffData.lastActivity = new Date().toISOString();
    this.setUserData('staff', staffData, teacherId);
    
    return newClass;
  }

  getClasses(): Class[] {
    return this.getAllClasses();
  }

  getClassesForTeacher(teacherId: string): Class[] {
    const allClasses = this.getAllClasses();
    return allClasses.filter(cls => cls.teacherId === teacherId);
  }

  enrollStudentInClass(teacherId: string, classId: string, studentEmail: string): { success: boolean; message: string; enrollment?: StudentEnrollment } {
    // Verify student exists and is student type
    const students = this.getUserData<User[]>('students') || [];
    const student = students.find(s => s.email === studentEmail);
    
    if (!student) {
      return { success: false, message: 'Student not found with this email address' };
    }

    // Verify class exists and belongs to teacher
    const allClasses = this.getAllClasses();
    const targetClass = allClasses.find(cls => cls.id === classId);
    
    if (!targetClass) {
      return { success: false, message: 'Class not found' };
    }
    
    if (targetClass.teacherId !== teacherId) {
      return { success: false, message: 'You can only enroll students in your own classes' };
    }

    // Check if already enrolled
    const existingEnrollment = this.getClassEnrollments(classId)
      .find(enrollment => enrollment.studentEmail === studentEmail);
    
    if (existingEnrollment) {
      return { success: false, message: 'Student is already enrolled in this class' };
    }

    // Create enrollment
    const enrollment: StudentEnrollment = {
      id: this.generateId(),
      classId,
      studentId: student.id,
      studentEmail,
      studentName: student.name,
      teacherId,
      enrolledAt: new Date().toISOString(),
      status: 'active'
    };

    // Store enrollment
    const allEnrollments = this.getAllEnrollments();
    allEnrollments.push(enrollment);
    this.setAllEnrollments(allEnrollments);

    // Update class student list
    targetClass.students.push({
      id: student.id,
      name: student.name,
      email: studentEmail,
      enrolledAt: enrollment.enrolledAt
    });
    this.updateClass(targetClass);

    // Update student's enrolled courses
    this.addClassToStudentProgress(student.id, classId);

    return { success: true, message: 'Student enrolled successfully', enrollment };
  }

  getClassEnrollments(classId: string): StudentEnrollment[] {
    const allEnrollments = this.getAllEnrollments();
    return allEnrollments.filter(enrollment => enrollment.classId === classId);
  }

  getStudentsForTeacher(teacherId: string): Array<{ class: Class; enrollments: StudentEnrollment[] }> {
    const teacherClasses = this.getClassesForTeacher(teacherId);
    return teacherClasses.map(cls => ({
      class: cls,
      enrollments: this.getClassEnrollments(cls.id)
    }));
  }

  addClassToStudentProgress(studentId: string, classId: string): void {
    const studentData = this.getStudentData(studentId);
    if (!studentData.coursesEnrolled.includes(classId)) {
      studentData.coursesEnrolled.push(classId);
      studentData.lastActivity = new Date().toISOString();
      this.setUserData('student', studentData, studentId);
    }
  }

  getEnrolledClassesForStudent(studentId: string): Class[] {
    const studentData = this.getStudentData(studentId);
    const allClasses = this.getAllClasses();
    return allClasses.filter(cls => studentData.coursesEnrolled.includes(cls.id));
  }

  publishClassContent(teacherId: string, classId: string, content: Omit<ClassContent, 'id' | 'teacherId' | 'classId' | 'publishedAt'>): ClassContent {
    const newContent: ClassContent = {
      ...content,
      id: this.generateId(),
      teacherId,
      classId,
      publishedAt: new Date().toISOString()
    };

    const allContent = this.getAllClassContent();
    allContent.push(newContent);
    this.setAllClassContent(allContent);

    return newContent;
  }

  getPublishedClassContent(classId: string): ClassContent[] {
    const allContent = this.getAllClassContent();
    return allContent.filter(content => content.classId === classId && content.status === 'published');
  }

  getStudentClassContent(studentId: string): ClassContent[] {
    const studentClasses = this.getEnrolledClassesForStudent(studentId);
    const classIds = studentClasses.map(cls => cls.id);
    const allContent = this.getAllClassContent();
    return allContent.filter(content => 
      classIds.includes(content.classId) && 
      content.status === 'published'
    );
  }

  // Private helper methods for class management
  private getAllClasses(): Class[] {
    return this.getUserData<Class[]>('classes') || [];
  }

  private setAllClasses(classes: Class[]): void {
    this.setUserData('classes', classes);
  }

  private getAllEnrollments(): StudentEnrollment[] {
    return this.getUserData<StudentEnrollment[]>('enrollments') || [];
  }

  private setAllEnrollments(enrollments: StudentEnrollment[]): void {
    this.setUserData('enrollments', enrollments);
  }

  private getAllClassContent(): ClassContent[] {
    return this.getUserData<ClassContent[]>('class_content') || [];
  }

  private setAllClassContent(content: ClassContent[]): void {
    this.setUserData('class_content', content);
  }

  private updateClass(updatedClass: Class): void {
    const allClasses = this.getAllClasses();
    const index = allClasses.findIndex(cls => cls.id === updatedClass.id);
    if (index !== -1) {
      allClasses[index] = updatedClass;
      this.setAllClasses(allClasses);
    }
  }

  // Utility Methods
  getSystemStats(): {
    totalUsers: number;
    totalClasses: number;
    totalEnrollments: number;
    totalContent: number;
  } {
    const students = this.getUserData<User[]>('students') || [];
    const staff = this.getUserData<User[]>('staff') || [];
    const allClasses = this.getAllClasses();
    const allEnrollments = this.getAllEnrollments();
    const allContent = this.getAllClassContent();

    return {
      totalUsers: students.length + staff.length + 1, // +1 for admin
      totalClasses: allClasses.length,
      totalEnrollments: allEnrollments.length,
      totalContent: allContent.length
    };
  }

  clearAllData(): void {
    const keys = Object.keys(localStorage).filter(key => key.startsWith('syllabox_'));
    keys.forEach(key => localStorage.removeItem(key));
  }

  // User management (for demo purposes)
  addUser(user: User): void {
    const userType = user.userType;
    const key = this.getStorageKey(userType);
    const users = this.getUserData<User[]>(userType) || [];
    users.push(user);
    this.setUserData(userType, users);
  }

  getUsersByType(userType: UserType): User[] {
    return this.getUserData<User[]>(userType) || [];
  }
}

export const LocalMultiTierDatabase = new LocalMultiTierDatabase();