import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { API_CONFIG } from '../constants/api';
import { Application, Job, LoginCredentials, RegisterData, User } from '../constants/types';

const api = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  login: async (credentials: LoginCredentials) => {
    const response = await api.post('/auth/login', credentials);
    if (response.data.token) {
      await AsyncStorage.setItem('authToken', response.data.token);
    }
    return response.data;
  },

  register: async (userData: RegisterData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  logout: async () => {
    await AsyncStorage.removeItem('authToken');
  },

  getToken: async () => {
    return await AsyncStorage.getItem('authToken');
  },
};

// Job APIs
export const jobAPI = {
  getAllJobs: async (): Promise<Job[]> => {
    const response = await api.get('/jobs');
    return response.data;
  },

  getJobById: async (id: number): Promise<Job> => {
    const response = await api.get(`/jobs/${id}`);
    return response.data;
  },

  searchJobs: async (query: string): Promise<Job[]> => {
    const response = await api.get(`/jobs/search?q=${query}`);
    return response.data;
  },

  getJobsByCategory: async (category: string): Promise<Job[]> => {
    const response = await api.get(`/jobs/category/${category}`);
    return response.data;
  },
};

// User APIs
export const userAPI = {
  getProfile: async (): Promise<User> => {
    const response = await api.get('/user/profile');
    return response.data;
  },

  updateProfile: async (data: Partial<User>): Promise<User> => {
    const response = await api.put('/user/profile', data);
    return response.data;
  },

  uploadResume: async (file: any) => {
    const formData = new FormData();
    formData.append('resume', file);
    const response = await api.post('/user/resume', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};

// Application APIs
export const applicationAPI = {
  apply: async (jobId: number, coverLetter?: string) => {
    const response = await api.post('/applications', { jobId, coverLetter });
    return response.data;
  },

  getMyApplications: async (): Promise<Application[]> => {
    const response = await api.get('/applications/my');
    return response.data;
  },

  getApplicationById: async (id: number): Promise<Application> => {
    const response = await api.get(`/applications/${id}`);
    return response.data;
  },

  cancelApplication: async (id: number) => {
    const response = await api.delete(`/applications/${id}`);
    return response.data;
  },
};

export default api;