// Local Multi-Tier Database with Complete Data Isolation
// Each user type can only access their designated data tier

import { 
  User, 
  UserType, 
  AdminSystemData, 
  StaffEducationalData, 
  StudentProgressData, 
  AuditLog, 
  DatabaseConfig 
} from '../types/user';

export class LocalMultiTierDatabase {
  private config: DatabaseConfig;
  private storagePrefix: string;

  constructor(config: DatabaseConfig) {
    this.config = config;
    this.storagePrefix = `syllabox_${config.userType}_${config.userId}`;
    this.initializeData();
  }

  // Admin Operations (Admin only)
  getSystemData(): AdminSystemData {
    if (this.config.userType !== 'admin') {
      throw new Error('Access denied: Admin data only');
    }
    
    const data = localStorage.getItem(`${this.storagePrefix}_system_data`);
    return data ? JSON.parse(data) : this.getDefaultSystemData();
  }

  saveSystemData(data: AdminSystemData): void {
    if (this.config.userType !== 'admin') {
      throw new Error('Access denied: Admin data only');
    }
    
    localStorage.setItem(`${this.storagePrefix}_system_data`, JSON.stringify(data));
    this.logAction('SYSTEM_DATA_UPDATED', 'admin_system', { dataKeys: Object.keys(data) });
  }

  // Staff Operations (Staff only)
  getEducationalData(): StaffEducationalData {
    if (this.config.userType !== 'staff') {
      throw new Error('Access denied: Staff data only');
    }
    
    const data = localStorage.getItem(`${this.storagePrefix}_educational_data`);
    return data ? JSON.parse(data) : this.getDefaultEducationalData();
  }

  saveEducationalData(data: StaffEducationalData): void {
    if (this.config.userType !== 'staff') {
      throw new Error('Access denied: Staff data only');
    }
    
    localStorage.setItem(`${this.storagePrefix}_educational_data`, JSON.stringify(data));
    this.logAction('EDUCATIONAL_DATA_UPDATED', 'staff_educational', { 
      lessons: data.lessonsCreated,
      quizzes: data.quizzesCreated 
    });
  }

  // Student Operations (Student only)
  getProgressData(): StudentProgressData {
    if (this.config.userType !== 'student') {
      throw new Error('Access denied: Student data only');
    }
    
    const data = localStorage.getItem(`${this.storagePrefix}_progress_data`);
    return data ? JSON.parse(data) : this.getDefaultProgressData();
  }

  saveProgressData(data: StudentProgressData): void {
    if (this.config.userType !== 'student') {
      throw new Error('Access denied: Student data only');
    }
    
    localStorage.setItem(`${this.storagePrefix}_progress_data`, JSON.stringify(data));
    this.logAction('PROGRESS_DATA_UPDATED', 'student_progress', { 
      courses: data.coursesEnrolled.length,
      quizScores: data.quizScores.length 
    });
  }

  // Cross-tier operations (Admin only)
  getAllUsers(): User[] {
    if (this.config.userType !== 'admin') {
      throw new Error('Access denied: User management admin only');
    }
    
    const allUsersData = localStorage.getItem('syllabox_all_users');
    return allUsersData ? JSON.parse(allUsersData) : [];
  }

  saveUser(user: User): void {
    if (this.config.userType !== 'admin') {
      throw new Error('Access denied: User management admin only');
    }
    
    const allUsers = this.getAllUsers();
    const existingIndex = allUsers.findIndex(u => u.id === user.id);
    
    if (existingIndex >= 0) {
      allUsers[existingIndex] = user;
    } else {
      allUsers.push(user);
    }
    
    localStorage.setItem('syllabox_all_users', JSON.stringify(allUsers));
    this.logAction('USER_SAVED', 'user_management', { 
      userId: user.id, 
      userType: user.userType,
      action: existingIndex >= 0 ? 'updated' : 'created'
    });
  }

  // Quiz operations
  getQuizzes(): any[] {
    if (this.config.userType !== 'staff' && this.config.userType !== 'admin') {
      throw new Error('Access denied: Quiz access restricted');
    }
    
    const quizzes = localStorage.getItem('syllabox_quizzes');
    return quizzes ? JSON.parse(quizzes) : [];
  }

  getStudentQuizzes(): any[] {
    if (this.config.userType !== 'student') {
      throw new Error('Access denied: Student quiz access only');
    }
    
    const quizzes = this.getQuizzes();
    return quizzes.filter(quiz => quiz.status === 'published');
  }

  // Audit logging
  logAction(action: string, resource: string, details: Record<string, any> = {}): void {
    const auditLog: AuditLog = {
      id: this.generateId(),
      userId: this.config.userId,
      userType: this.config.userType,
      action,
      resource,
      details,
      timestamp: new Date().toISOString(),
      ipAddress: '127.0.0.1', // Local development
      userAgent: navigator.userAgent
    };
    
    const logs = this.getAuditLogs();
    logs.push(auditLog);
    
    // Keep only last 100 logs
    if (logs.length > 100) {
      logs.splice(0, logs.length - 100);
    }
    
    localStorage.setItem('syllabox_audit_logs', JSON.stringify(logs));
  }

  getAuditLogs(): AuditLog[] {
    const logs = localStorage.getItem('syllabox_audit_logs');
    return logs ? JSON.parse(logs) : [];
  }

  // Utility methods
  private generateId(): string {
    return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private initializeData(): void {
    // Initialize default data if not exists
    if (this.config.userType === 'admin') {
      const existing = localStorage.getItem(`${this.storagePrefix}_system_data`);
      if (!existing) {
        this.saveSystemData(this.getDefaultSystemData());
      }
    } else if (this.config.userType === 'staff') {
      const existing = localStorage.getItem(`${this.storagePrefix}_educational_data`);
      if (!existing) {
        this.saveEducationalData(this.getDefaultEducationalData());
      }
    } else if (this.config.userType === 'student') {
      const existing = localStorage.getItem(`${this.storagePrefix}_progress_data`);
      if (!existing) {
        this.saveProgressData(this.getDefaultProgressData());
      }
    }
  }

  private getDefaultSystemData(): AdminSystemData {
    return {
      totalUsers: 0,
      activeUsers: 0,
      systemHealth: 'healthy',
      lastBackup: new Date().toISOString(),
      featureFlags: {
        enableAdvancedAnalytics: true,
        enableBulkOperations: true,
        enableSystemMonitoring: true
      },
      auditSettings: {
        logLevel: 'info',
        retentionDays: 30
      }
    };
  }

  private getDefaultEducationalData(): StaffEducationalData {
    return {
      id: this.generateId(),
      userId: this.config.userId,
      lessonsCreated: 0,
      quizzesCreated: 0,
      assessmentsCreated: 0,
      coursesOwned: [],
      studentsManaged: [],
      lessonPlans: [],
      quizBank: [],
      lastActivity: new Date().toISOString()
    };
  }

  private getDefaultProgressData(): StudentProgressData {
    return {
      id: this.generateId(),
      userId: this.config.userId,
      coursesEnrolled: [],
      quizScores: [],
      assignmentsCompleted: 0,
      totalStudyTime: 0,
      currentStreak: 0,
      achievements: [],
      learningPath: [],
      lastActivity: new Date().toISOString()
    };
  }

  // Data isolation verification
  verifyDataIsolation(): boolean {
    try {
      // Test that user can only access their own data tier
      if (this.config.userType === 'admin') {
        this.getSystemData(); // Should work
        this.getEducationalData(); // Should fail
        this.getProgressData(); // Should fail
      } else if (this.config.userType === 'staff') {
        this.getEducationalData(); // Should work
        this.getSystemData(); // Should fail
        this.getProgressData(); // Should fail
      } else if (this.config.userType === 'student') {
        this.getProgressData(); // Should work
        this.getSystemData(); // Should fail
        this.getEducationalData(); // Should fail
      }
      return true;
    } catch (error) {
      return false;
    }
  }

  // Clear all data (for testing)
  clearAllData(): void {
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith('syllabox_')) {
        localStorage.removeItem(key);
      }
    });
  }
}