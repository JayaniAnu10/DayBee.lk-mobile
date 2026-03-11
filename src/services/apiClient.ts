import axios, { AxiosInstance } from 'axios';
import * as SecureStore from 'expo-secure-store';

const BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://daybee.jayanidahanayake.me/api';

let isRefreshing = false;
let failedQueue: Array<{ resolve: (value: any) => void; reject: (reason?: any) => void }> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

export const apiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  timeout: 15000,
});

const refreshClient = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  timeout: 5000,
});

// Request interceptor - attach access token
apiClient.interceptors.request.use(async (config) => {
  try {
    const token = await SecureStore.getItemAsync('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (e) {
    // ignore
  }
  return config;
});

// Response interceptor - handle token refresh
apiClient.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers['Authorization'] = 'Bearer ' + token;
            return apiClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      return new Promise((resolve, reject) => {
        refreshClient
          .post('/auth/refresh')
          .then(async (res) => {
            const newToken = res.data.token;
            await SecureStore.setItemAsync('accessToken', newToken);
            originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
            processQueue(null, newToken);
            resolve(apiClient(originalRequest));
          })
          .catch(async (err) => {
            processQueue(err, null);
            await SecureStore.deleteItemAsync('accessToken');
            reject(err);
          })
          .finally(() => {
            isRefreshing = false;
          });
      });
    }

    return Promise.reject(error);
  }
);

// Generic API client class
export class APIClient<T> {
  endpoint: string;

  constructor(endpoint: string) {
    this.endpoint = endpoint;
  }

  get = (): Promise<T> => {
    return apiClient.get<T>(this.endpoint).then((res) => res.data);
  };

  getAll = (params?: Record<string, any>): Promise<T> => {
    return apiClient.get<T>(this.endpoint, { params }).then((res) => res.data);
  };

  getById = (id: string): Promise<T> => {
    return apiClient.get<T>(`${this.endpoint}/${id}`).then((res) => res.data);
  };

  post = <D = any>(data?: D): Promise<T> => {
    return apiClient.post<T>(this.endpoint, data).then((res) => res.data);
  };

  postForm = (formData: FormData): Promise<T> => {
    return apiClient
      .post<T>(this.endpoint, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then((res) => res.data);
  };

  put = <D = any>(data?: D): Promise<T> => {
    return apiClient.put<T>(this.endpoint, data).then((res) => res.data);
  };

  putForm = (formData: FormData): Promise<T> => {
    return apiClient
      .put<T>(this.endpoint, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then((res) => res.data);
  };

  patch = (id?: string, params?: Record<string, any>): Promise<T> => {
    const url = id ? `${this.endpoint}/${id}` : this.endpoint;
    return apiClient.patch<T>(url, null, { params }).then((res) => res.data);
  };

  patchData = (data?: any): Promise<T> => {
    return apiClient.patch<T>(this.endpoint, data).then((res) => res.data);
  };

  delete = (id?: string): Promise<T> => {
    const url = id ? `${this.endpoint}/${id}` : this.endpoint;
    return apiClient.delete<T>(url).then((res) => res.data);
  };
}

export default APIClient;
