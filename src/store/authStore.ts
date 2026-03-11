import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';
import type { User } from '../types';

interface AuthState {
  accessToken: string | null;
  user: User | null;
  isLoading: boolean;
  setAuth: (token: string, user: User) => void;
  clearAuth: () => void;
  setLoading: (loading: boolean) => void;
  loadFromStorage: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  user: null,
  isLoading: true,

  setAuth: async (token: string, user: User) => {
    try {
      await SecureStore.setItemAsync('accessToken', token);
      await SecureStore.setItemAsync('user', JSON.stringify(user));
    } catch (e) {
      // ignore storage errors
    }
    set({ accessToken: token, user });
  },

  clearAuth: async () => {
    try {
      await SecureStore.deleteItemAsync('accessToken');
      await SecureStore.deleteItemAsync('user');
    } catch (e) {
      // ignore
    }
    set({ accessToken: null, user: null });
  },

  setLoading: (loading: boolean) => set({ isLoading: loading }),

  loadFromStorage: async () => {
    try {
      const token = await SecureStore.getItemAsync('accessToken');
      const userStr = await SecureStore.getItemAsync('user');
      if (token && userStr) {
        const user = JSON.parse(userStr);
        set({ accessToken: token, user, isLoading: false });
      } else {
        set({ isLoading: false });
      }
    } catch (e) {
      set({ isLoading: false });
    }
  },
}));
