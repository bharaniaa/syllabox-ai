export interface User {
  id: string;
  email: string;
  role: "admin" | "staff" | "student";
  name: string;
  createdAt: string;
}

export interface Lesson {
  id: string;
  subject: string;
  topic: string;
  objectives: string;
  gradeLevel: string;
  content: any;
  createdBy: string;
  createdAt: string;
  institutionId?: string;
}

export interface Assessment {
  id: string;
  title: string;
  course: string;
  questions: number;
  difficulty: string;
  type: string;
  createdBy: string;
  createdAt: string;
}

export interface LeaveRequest {
  id: string;
  reason: string;
  startDate: string;
  endDate: string;
  type: string;
  status: "pending" | "approved" | "rejected";
  submittedBy: string;
  submittedAt: string;
}

export interface WeeklyPlan {
  id: string;
  staffId: string;
  week: string;
  classes: Array<{
    id: string;
    subject: string;
    grade: string;
    time: string;
    room: string;
    topic: string;
  }>;
  createdAt: string;
}

export interface Staff {
  id: string;
  name: string;
  email: string;
  role: string;
  status: "active" | "on_leave" | "inactive";
  workload: number;
  department: string;
  lastActive: string;
}

const STORAGE_KEYS = {
  USERS: "syllabox_users",
  LESSONS: "syllabox_lessons",
  ASSESSMENTS: "syllabox_assessments",
  LEAVE_REQUESTS: "syllabox_leave_requests",
  WEEKLY_PLANS: "syllabox_weekly_plans",
  STAFF: "syllabox_staff",
  CURRENT_USER: "syllabox_current_user",
};

const getStorageData = <T,>(key: string): T[] => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error(`Error reading from localStorage (${key}):`, error);
    return [];
  }
};

const setStorageData = <T,>(key: string, data: T[]): void => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Error writing to localStorage (${key}):`, error);
  }
};

const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

export const initializeSampleData = (): void => {
  if (getStorageData<Staff>(STORAGE_KEYS.STAFF).length === 0) {
    const sampleStaff: Staff[] = [
      {
        id: "1",
        name: "Dr. Sarah Johnson",
        email: "sarah.johnson@school.edu",
        role: "Mathematics Teacher",
        status: "active",
        workload: 85,
        department: "Mathematics",
        lastActive: "2025-11-05T10:30:00Z",
      },
      {
        id: "2",
        name: "Mr. Michael Chen",
        email: "michael.chen@school.edu",
        role: "Science Teacher",
        status: "active",
        workload: 92,
        department: "Science",
        lastActive: "2025-11-05T11:15:00Z",
      },
      {
        id: "3",
        name: "Ms. Emily Rodriguez",
        email: "emily.rodriguez@school.edu",
        role: "English Teacher",
        status: "on_leave",
        workload: 0,
        department: "English",
        lastActive: "2025-11-01T14:20:00Z",
      },
    ];
    setStorageData(STORAGE_KEYS.STAFF, sampleStaff);
  }

  if (getStorageData<Lesson>(STORAGE_KEYS.LESSONS).length === 0) {
    const sampleLessons: Lesson[] = [
      {
        id: "1",
        subject: "Mathematics",
        topic: "Algebraic Expressions",
        objectives: "Understand variables and constants. Solve simple algebraic equations.",
        gradeLevel: "Grade 8",
        content: { title: "Algebraic Expressions - Grade 8" },
        createdBy: "Dr. Sarah Johnson",
        createdAt: "2025-11-01T09:00:00Z",
      },
      {
        id: "2",
        subject: "Science",
        topic: "Photosynthesis",
        objectives: "Understand the process of photosynthesis. Identify factors affecting plant growth.",
        gradeLevel: "Grade 7",
        content: { title: "Photosynthesis - Grade 7" },
        createdBy: "Mr. Michael Chen",
        createdAt: "2025-11-02T14:30:00Z",
      },
    ];
    setStorageData(STORAGE_KEYS.LESSONS, sampleLessons);
  }
};

export const getStaff = (): Staff[] => {
  return getStorageData<Staff>(STORAGE_KEYS.STAFF);
};

export const addStaff = (staff: Omit<Staff, "id">): Staff => {
  const staffList = getStorageData<Staff>(STORAGE_KEYS.STAFF);
  const newStaff: Staff = {
    ...staff,
    id: generateId(),
  };
  staffList.push(newStaff);
  setStorageData(STORAGE_KEYS.STAFF, staffList);
  return newStaff;
};

export const getLessons = (): Lesson[] => {
  return getStorageData<Lesson>(STORAGE_KEYS.LESSONS);
};

export const addLesson = (lesson: Omit<Lesson, "id">): Lesson => {
  const lessons = getStorageData<Lesson>(STORAGE_KEYS.LESSONS);
  const newLesson: Lesson = {
    ...lesson,
    id: generateId(),
  };
  lessons.push(newLesson);
  setStorageData(STORAGE_KEYS.LESSONS, lessons);
  return newLesson;
};

export const getLeaveRequests = (): LeaveRequest[] => {
  return getStorageData<LeaveRequest>(STORAGE_KEYS.LEAVE_REQUESTS);
};

export const addLeaveRequest = (request: Omit<LeaveRequest, "id" | "status">): LeaveRequest => {
  const requests = getStorageData<LeaveRequest>(STORAGE_KEYS.LEAVE_REQUESTS);
  const newRequest: LeaveRequest = {
    ...request,
    id: generateId(),
    status: "pending",
  };
  requests.push(newRequest);
  setStorageData(STORAGE_KEYS.LEAVE_REQUESTS, requests);
  return newRequest;
};

export const updateLeaveRequestStatus = (id: string, status: "approved" | "rejected"): void => {
  const requests = getStorageData<LeaveRequest>(STORAGE_KEYS.LEAVE_REQUESTS);
  const requestIndex = requests.findIndex((req) => req.id === id);
  if (requestIndex !== -1) {
    requests[requestIndex].status = status;
    setStorageData(STORAGE_KEYS.LEAVE_REQUESTS, requests);
  }
};

export const getAnalyticsData = () => {
  const staff = getStaff();
  const lessons = getLessons();
  const leaveRequests = getLeaveRequests();

  return {
    totalStaff: staff.length,
    activeStaff: staff.filter((s) => s.status === "active").length,
    totalLessons: lessons.length,
    pendingLeaveRequests: leaveRequests.filter((req) => req.status === "pending").length,
    averageWorkload: staff.reduce((sum, s) => sum + s.workload, 0) / (staff.length || 1),
    departmentDistribution: staff.reduce((acc, s) => {
      (acc as any)[s.department] = ((acc as any)[s.department] || 0) + 1;
      return acc;
    }, {} as Record<string, number>),
  };
};
