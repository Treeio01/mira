import type { ZodType } from 'zod';

import { ApiError } from './types';
import type { ApiErrorResponse, RefreshTokenResponse } from './types';
import { tokenStorage } from './token';

import { env } from '../../lib/env';

const BASE_URL = env.API_BASE_URL;
const REQUEST_TIMEOUT = 15_000;

let refreshPromise: Promise<RefreshTokenResponse> | null = null;

const MAX_RETRIES = 2;
const RETRY_DELAY = 1000;

async function fetchOnce(
  url: string,
  init: RequestInit,
  externalSignal?: AbortSignal,
): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

  const onExternalAbort = () => controller.abort();
  externalSignal?.addEventListener('abort', onExternalAbort);

  try {
    return await fetch(url, { ...init, signal: controller.signal });
  } catch (e) {
    if (e instanceof DOMException && e.name === 'AbortError') {
      if (externalSignal?.aborted) throw e;
      throw new ApiError(0, 'Превышено время ожидания');
    }
    throw new ApiError(0, 'Нет соединения с сервером');
  } finally {
    clearTimeout(timer);
    externalSignal?.removeEventListener('abort', onExternalAbort);
  }
}

async function fetchWithTimeout(
  url: string,
  init: RequestInit,
  externalSignal?: AbortSignal,
): Promise<Response> {
  let lastError: unknown;
  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    if (externalSignal?.aborted) throw new DOMException('Aborted', 'AbortError');
    try {
      const res = await fetchOnce(url, init, externalSignal);
      // Retry on 502/503/504
      if (res.status >= 502 && res.status <= 504 && attempt < MAX_RETRIES) {
        await new Promise((r) => setTimeout(r, RETRY_DELAY * (attempt + 1)));
        continue;
      }
      return res;
    } catch (e) {
      lastError = e;
      if (e instanceof DOMException && e.name === 'AbortError') throw e;
      if (e instanceof ApiError && e.detail === 'Превышено время ожидания') throw e;
      // Network error — retry
      if (attempt < MAX_RETRIES) {
        await new Promise((r) => setTimeout(r, RETRY_DELAY * (attempt + 1)));
        continue;
      }
    }
  }
  throw lastError;
}

async function refreshToken(): Promise<RefreshTokenResponse> {
  const token = tokenStorage.getAccessToken();
  if (!token) {
    tokenStorage.clear();
    throw new ApiError(401, 'No access token for refresh');
  }

  const res = await fetchWithTimeout(`${BASE_URL}/api/v1/refresh`, {
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

export async function apiRequest<T>(
  endpoint: string,
  options: {
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
    body?: unknown;
    skipAuth?: boolean;
    signal?: AbortSignal;
  } = {},
): Promise<T> {
  const { method = 'POST', body, skipAuth = false, signal } = options;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (!skipAuth) {
    const token = await ensureValidToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  const init: RequestInit = {
    method,
    headers,
    body: body != null ? JSON.stringify(body) : undefined,
  };

  const res = await fetchWithTimeout(`${BASE_URL}${endpoint}`, init, signal);

  // Авто-refresh при 401
  if (res.status === 401 && !skipAuth && tokenStorage.hasToken()) {
    if (!refreshPromise) {
      refreshPromise = refreshToken().finally(() => {
        refreshPromise = null;
      });
    }

    try {
      const refreshed = await refreshPromise;
      const retryRes = await fetchWithTimeout(`${BASE_URL}${endpoint}`, {
        ...init,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${refreshed.access_token}`,
        },
      });

      if (!retryRes.ok) {
        const err = (await retryRes.json().catch(() => ({ detail: `HTTP ${retryRes.status}` }))) as ApiErrorResponse;
        throw new ApiError(retryRes.status, err.detail);
      }

      return retryRes.json() as Promise<T>;
    } catch {
      tokenStorage.clear();
      throw new ApiError(401, 'Сессия истекла');
    }
  }

  if (!res.ok) {
    const err = (await res.json().catch(() => ({ detail: `HTTP ${res.status}` }))) as ApiErrorResponse;
    throw new ApiError(res.status, err.detail);
  }

  return res.json() as Promise<T>;
}

export async function apiRequestValidated<T>(
  schema: ZodType<T>,
  endpoint: string,
  options: {
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
    body?: unknown;
    skipAuth?: boolean;
    signal?: AbortSignal;
  } = {},
): Promise<T> {
  const raw = await apiRequest<unknown>(endpoint, options);
  return schema.parse(raw);
}
