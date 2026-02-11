export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: number;
  description: string;
  requirements: string[];
  type: 'full-time' | 'part-time' | 'contract';
  postedDate: string;
  category: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  resume?: string;
}

export interface Application {
  id: number;
  jobId: number;
  userId: number;
  status: 'pending' | 'accepted' | 'rejected';
  appliedDate: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  phone?: string;
}