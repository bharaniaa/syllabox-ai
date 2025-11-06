// User Types and Interfaces for Multi-Tier Database System

export type UserType = 'admin' | 'staff' | 'student';

export interface User {
  id: string;
  email: string;
  name: string;
  userType: UserType;
  createdAt: string;
  lastLogin: string;
  isActive: boolean;
}

export interface AdminSystemData {
  totalUsers: number;
  activeUsers: number;
  systemHealth: string;
  lastBackup: string;
  featureFlags: {
    enableAdvancedAnalytics: boolean;
    enableBulkOperations: boolean;
    enableSystemMonitoring: boolean;
  };
  auditSettings: {
    logLevel: 'info' | 'warn' | 'error';
    retentionDays: number;
  };
}

export interface StaffEducationalData {
  id: string;
  userId: string;
  lessonsCreated: number;
  quizzesCreated: number;
  assessmentsCreated: number;
  coursesOwned: string[];
  studentsManaged: string[];
  lessonPlans: Array<{
    id: string;
    title: string;
    subject: string;
    createdAt: string;
    status: 'draft' | 'published' | 'archived';
  }>;
  quizBank: Array<{
    id: string;
    title: string;
    subject: string;
    difficulty: 'easy' | 'medium' | 'hard';
    questions: number;
    createdAt: string;
  }>;
  lastActivity: string;
}

export interface StudentProgressData {
  id: string;
  userId: string;
  coursesEnrolled: string[];
  quizScores: Array<{
    quizId: string;
    score: number;
    maxScore: number;
    completedAt: string;
    timeSpent: number;
  }>;
  assignmentsCompleted: number;
  totalStudyTime: number;
  currentStreak: number;
  achievements: Array<{
    id: string;
    title: string;
    description: string;
    earnedAt: string;
  }>;
  learningPath: Array<{
    subject: string;
    currentLevel: number;
    nextMilestone: string;
    progress: number;
  }>;
  lastActivity: string;
}

// Class Management System Interfaces
export interface Class {
  id: string;
  name: string;
  subject: string;
  teacherId: string;
  teacherName: string;
  description: string;
  createdAt: string;
  isActive: boolean;
  students: Array<{
    id: string;
    name: string;
    email: string;
    enrolledAt: string;
  }>;
}

export interface StudentEnrollment {
  id: string;
  classId: string;
  studentId: string;
  studentEmail: string;
  studentName: string;
  teacherId: string;
  enrolledAt: string;
  status: 'active' | 'inactive';
}

export interface ClassContent {
  id: string;
  classId: string;
  teacherId: string;
  type: 'lesson' | 'quiz' | 'assignment';
  title: string;
  content: string;
  publishedAt: string;
  dueDate?: string;
  status: 'draft' | 'published';
}

export interface AuditLog {
  id: string;
  userId: string;
  userType: UserType;
  action: string;
  resource: string;
  details: Record<string, any>;
  timestamp: string;
  ipAddress?: string;
  userAgent?: string;
}

export interface DatabaseConfig {
  userType: UserType;
  userId: string;
  sessionId: string;
}

export interface AuthSession {
  user: User;
  sessionId: string;
  expiresAt: string;
  isActive: boolean;
}