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