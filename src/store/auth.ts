import { create } from 'zustand';
import {
  register as apiRegister,
  logout as apiLogout,
} from '../services/api';
import type { ApiError } from '../services/api';
import { isTelegramWebApp } from '../lib/telegram';

// ── Types ──

interface AuthState {
  isAuthed: boolean;
  isLoading: boolean;
  isNewUser: boolean;
  userId: number | null;
  error: string | null;
  /** Начальная инициализация завершена (успех или ошибка) */
  isInitialized: boolean;
}

interface AuthActions {
  register: () => Promise<void>;
  logout: () => void;
}

type AuthStore = AuthState & AuthActions;

// ── Store ──

export const useAuthStore = create<AuthStore>()((set, get) => ({
  isAuthed: false,
  isLoading: false,
  isNewUser: false,
  userId: null,
  error: null,
  isInitialized: false,

  register: async () => {
    if (get().isLoading) return;

    if (!isTelegramWebApp()) {
      set({
        error: 'Откройте приложение через Telegram',
        isAuthed: false,
        isLoading: false,
        isInitialized: true,
      });
      return;
    }

    set({ isLoading: true, error: null });

    try {
      const data = await apiRegister();
      set({
        isAuthed: true,
        isLoading: false,
        isNewUser: data.is_new_user,
        userId: data.user_id,
        isInitialized: true,
      });
    } catch (e) {
      const detail = (e as ApiError).detail ?? 'Ошибка авторизации';
      set({
        error: detail,
        isAuthed: false,
        isLoading: false,
        isInitialized: true,
      });
    }
  },

  logout: () => {
    apiLogout();
    set({ isAuthed: false, userId: null, isNewUser: false, error: null });
  },
}));

// ── Selectors ──

export const selectIsAuthed = (s: AuthStore) => s.isAuthed;
export const selectAuthLoading = (s: AuthStore) => s.isLoading;
export const selectAuthError = (s: AuthStore) => s.error;
export const selectIsNewUser = (s: AuthStore) => s.isNewUser;
export const selectUserId = (s: AuthStore) => s.userId;
export const selectIsInitialized = (s: AuthStore) => s.isInitialized;
