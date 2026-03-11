import { ApiError } from './types';
import type { ApiErrorResponse, RefreshTokenResponse } from './types';
import { tokenStorage } from './token';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.miracards.net';

let refreshPromise: Promise<RefreshTokenResponse> | null = null;

/**
 * Refresh: отправляет текущий (истёкший) токен,
 * получает новый access_token.
 */
async function refreshToken(): Promise<RefreshTokenResponse> {
  const token = tokenStorage.getAccessToken();
  if (!token) {
    tokenStorage.clear();
    throw new ApiError(401, 'No access token for refresh');
  }

  const res = await fetch(`${BASE_URL}/api/v1/refresh`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    tokenStorage.clear();
    const err = (await res.json().catch(() => ({ detail: 'Refresh failed' }))) as ApiErrorResponse;
    throw new ApiError(res.status, err.detail);
  }

  const data = (await res.json()) as RefreshTokenResponse;
  tokenStorage.setToken(data.access_token, data.expires_in);
  return data;
}

/**
 * Гарантирует валидный токен.
 * Дедуплицирует параллельные refresh-запросы.
 */
async function ensureValidToken(): Promise<string | null> {
  if (!tokenStorage.hasToken()) return null;

  if (tokenStorage.isExpired()) {
    if (!refreshPromise) {
      refreshPromise = refreshToken().finally(() => {
        refreshPromise = null;
      });
    }
    await refreshPromise;
  }

  return tokenStorage.getAccessToken();
}

/**
 * Базовый запрос к API.
 * Авто-подставляет Bearer токен.
 * При 401 — пробует refresh один раз.
 */
export async function apiRequest<T>(
  endpoint: string,
  options: {
    method?: string;
    body?: unknown;
    skipAuth?: boolean;
  } = {},
): Promise<T> {
  const { method = 'POST', body, skipAuth = false } = options;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (!skipAuth) {
    const token = await ensureValidToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    method,
    headers,
    body: body != null ? JSON.stringify(body) : undefined,
  });

  // Авто-refresh при 401
  if (res.status === 401 && !skipAuth && tokenStorage.hasToken()) {
    try {
      if (!refreshPromise) {
        refreshPromise = refreshToken().finally(() => {
          refreshPromise = null;
        });
      }
      const refreshed = await refreshPromise;

      const retryRes = await fetch(`${BASE_URL}${endpoint}`, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${refreshed.access_token}`,
        },
        body: body != null ? JSON.stringify(body) : undefined,
      });

      if (!retryRes.ok) {
        const err = (await retryRes.json().catch(() => ({ detail: `HTTP ${retryRes.status}` }))) as ApiErrorResponse;
        throw new ApiError(retryRes.status, err.detail);
      }

      return retryRes.json() as Promise<T>;
    } catch (e) {
      tokenStorage.clear();
      throw e;
    }
  }

  if (!res.ok) {
    const err = (await res.json().catch(() => ({ detail: `HTTP ${res.status}` }))) as ApiErrorResponse;
    throw new ApiError(res.status, err.detail);
  }

  return res.json() as Promise<T>;
}
