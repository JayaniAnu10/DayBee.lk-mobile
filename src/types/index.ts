export type UserRole = 'ADMIN' | 'USER';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  isEmployer: boolean;
  isJobseeker: boolean;
}

export interface AuthState {
  accessToken: string | null;
  user: User | null;
}

export interface Job {
  id: string;
  title: string;
  description?: string;
  category: string;
  location: string;
  jobType: string;
  deadline: string;
  postedDate: string;
  minSalary: number;
  maxSalary?: number;
  jobSchedules: JobSchedule[];
  accommodation?: string;
  totalVacancies: number;
  employer: string;
  isUrgent: boolean;
  requirements?: string;
  latitude?: number;
  longitude?: number;
  requiredGender?: string;
  status?: string;
}

export interface JobSchedule {
  id: string;
  startDatetime: string;
  endDatetime: string;
  requiredWorkers: number;
}

export interface JobSeekerProfile {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  gender: string;
  dateOfBirth: string;
  bio: string;
  address: string;
  profilePicture: string;
  skills: string;
  nic: string;
  contact: string;
}

export interface EmployerProfile {
  userId: string;
  companyName: string;
  registrationID: string;
  contactPerson: string;
  phone: string;
  address: string;
  industry: string;
  website: string;
  description: string;
  logo: string;
  email: string;
}

export interface Application {
  id: string;
  jobId: string;
  jobTitle?: string;
  jobseeker: string;
  scheduleId: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  appliedAt: string;
}

export interface Notification {
  id: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  type: string;
}

export interface Rating {
  id: string;
  rating: number;
  comment: string;
  ratedBy: string;
  createdAt: string;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}

export interface JobListing {
  jobs: PageResponse<Job>;
  totalJobs: number;
}

export interface Complaint {
  id: string;
  subject: string;
  description: string;
  status: string;
  createdAt: string;
  type: string;
}

export interface AdminUser {
  id: string;
  email: string;
  role: string;
  status: string;
  createdAt: string;
  isEmployer: boolean;
  isJobseeker: boolean;
}

export interface EmployerStats {
  totalJobs: number;
  totalApplications: number;
  pendingApplications: number;
  approvedApplications: number;
}

export interface JobSeekerStats {
  totalApplications: number;
  upcomingJobs: number;
  completedJobs: number;
  averageRating: number;
}
