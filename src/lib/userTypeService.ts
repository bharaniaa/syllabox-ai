// User Type Service for Authentication and User Management
// Handles user registration, login, and user type assignment

import { User, UserType, AuthSession } from '../types/user';
import { LocalMultiTierDatabase } from './localStorage';

export class UserTypeService {
  private static SESSION_KEY = 'syllabox_current_session';
  private static USERS_KEY = 'syllabox_all_users';

  // User Registration with Type Assignment
  static async createUser(
    email: string, 
    password: string, 
    name: string, 
    userType: UserType
  ): Promise<User> {
    // Check if user already exists
    const existingUser = this.getUserByEmail(email);
    if (existingUser) {
      throw new Error('User already exists with this email');
    }

    // Create new user
    const newUser: User = {
      id: this.generateId(),
      email: email.toLowerCase().trim(),
      name: name.trim(),
      userType,
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
      isActive: true
    };

    // Save user to global user store
    this.saveUser(newUser);

    // Initialize user-specific database
    const database = new LocalMultiTierDatabase({
      userType: userType,
      userId: newUser.id,
      sessionId: this.generateId()
    });

    // Log the registration
    database.logAction('USER_REGISTERED', 'user_registration', {
      userType,
      registrationMethod: 'email'
    });

    return newUser;
  }

  // User Login
  static async login(email: string, password: string): Promise<{ user: User; database: LocalMultiTierDatabase }> {
    // Find user by email
    const user = this.getUserByEmail(email.toLowerCase().trim());
    if (!user) {
      throw new Error('User not found');
    }

    if (!user.isActive) {
      throw new Error('Account is deactivated');
    }

    // In a real app, you'd verify the password hash here
    // For demo purposes, we'll accept any password
    if (!password || password.length < 1) {
      throw new Error('Invalid password');
    }

    // Update last login
    user.lastLogin = new Date().toISOString();
    this.saveUser(user);

    // Create session
    const session: AuthSession = {
      user,
      sessionId: this.generateId(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours
      isActive: true
    };

    localStorage.setItem(this.SESSION_KEY, JSON.stringify(session));

    // Initialize database for this user
    const database = new LocalMultiTierDatabase({
      userType: user.userType,
      userId: user.id,
      sessionId: session.sessionId
    });

    // Log the login
    database.logAction('USER_LOGIN', 'authentication', {
      loginMethod: 'email',
      sessionId: session.sessionId
    });

    return { user, database };
  }

  // User Logout
  static logout(): void {
    const session = this.getCurrentSession();
    if (session) {
      const database = new LocalMultiTierDatabase({
        userType: session.user.userType,
        userId: session.user.id,
        sessionId: session.sessionId
      });
      
      database.logAction('USER_LOGOUT', 'authentication', {
        sessionId: session.sessionId,
        sessionDuration: Date.now() - new Date(session.user.lastLogin).getTime()
      });
    }

    localStorage.removeItem(this.SESSION_KEY);
  }

  // Get Current User
  static getCurrentUser(): User | null {
    const session = this.getCurrentSession();
    return session?.user || null;
  }

  // Get Current Session
  static getCurrentSession(): AuthSession | null {
    const sessionData = localStorage.getItem(this.SESSION_KEY);
    if (!sessionData) return null;

    try {
      const session: AuthSession = JSON.parse(sessionData);
      
      // Check if session is expired
      if (new Date(session.expiresAt) < new Date()) {
        this.logout();
        return null;
      }

      return session;
    } catch (error) {
      console.error('Error parsing session data:', error);
      this.logout();
      return null;
    }
  }

  // Check if user is authenticated
  static isAuthenticated(): boolean {
    return this.getCurrentUser() !== null;
  }

  // Get All Users (Admin only)
  static getAllUsers(): User[] {
    const usersData = localStorage.getItem(this.USERS_KEY);
    return usersData ? JSON.parse(usersData) : [];
  }

  // Get Users by Type
  static getUsersByType(userType: UserType): User[] {
    return this.getAllUsers().filter(user => user.userType === userType);
  }

  // Update User
  static updateUser(updatedUser: User): void {
    this.saveUser(updatedUser);
  }

  // Deactivate User (Admin only)
  static deactivateUser(userId: string): void {
    const users = this.getAllUsers();
    const userIndex = users.findIndex(u => u.id === userId);
    
    if (userIndex >= 0) {
      users[userIndex].isActive = false;
      localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
    }
  }

  // Assign User Type (Admin only)
  static assignUserType(userId: string, newUserType: UserType): void {
    const users = this.getAllUsers();
    const userIndex = users.findIndex(u => u.id === userId);
    
    if (userIndex >= 0) {
      const oldUserType = users[userIndex].userType;
      users[userIndex].userType = newUserType;
      localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
      
      // Log the type change
      const currentUser = this.getCurrentUser();
      if (currentUser?.userType === 'admin') {
        const database = new LocalMultiTierDatabase({
          userType: 'admin',
          userId: currentUser.id,
          sessionId: this.generateId()
        });
        
        database.logAction('USER_TYPE_CHANGED', 'user_management', {
          targetUserId: userId,
          oldUserType,
          newUserType
        });
      }
    }
  }

  // Private helper methods
  private static saveUser(user: User): void {
    const users = this.getAllUsers();
    const existingIndex = users.findIndex(u => u.id === user.id);
    
    if (existingIndex >= 0) {
      users[existingIndex] = user;
    } else {
      users.push(user);
    }
    
    localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
  }

  private static getUserByEmail(email: string): User | null {
    const users = this.getAllUsers();
    return users.find(u => u.email === email) || null;
  }

  private static generateId(): string {
    return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Initialize with demo users (for testing)
  static initializeDemoUsers(): void {
    const existingUsers = this.getAllUsers();
    if (existingUsers.length === 0) {
      // Create demo users
      this.createUser('admin@syllabox.com', 'admin123', 'Admin User', 'admin');
      this.createUser('staff@syllabox.com', 'staff123', 'Staff User', 'staff');
      this.createUser('student@syllabox.com', 'student123', 'Student User', 'student');
    }
  }

  // Get user statistics
  static getUserStatistics(): {
    total: number;
    active: number;
    byType: Record<UserType, number>;
  } {
    const users = this.getAllUsers();
    return {
      total: users.length,
      active: users.filter(u => u.isActive).length,
      byType: {
        admin: users.filter(u => u.userType === 'admin').length,
        staff: users.filter(u => u.userType === 'staff').length,
        student: users.filter(u => u.userType === 'student').length
      }
    };
  }

  // Clear all users (for testing)
  static clearAllUsers(): void {
    localStorage.removeItem(this.USERS_KEY);
    localStorage.removeItem(this.SESSION_KEY);
  }
}