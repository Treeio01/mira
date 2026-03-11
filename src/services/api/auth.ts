import { apiRequest } from './client';
import { tokenStorage } from './token';
import type { RegisterResponse } from './types';
import { getWebApp } from '../../lib/telegram';

export async function register(): Promise<RegisterResponse> {
  const webApp = getWebApp();
  const initData = webApp?.initData;

  if (!initData) {
    throw new Error('Telegram WebApp недоступен');
  }

  const data = await apiRequest<RegisterResponse>('/api/v1/register', {
    body: { init_data: initData },
    skipAuth: true,
  });

  tokenStorage.setToken(data.access_token, data.expires_in);
  return data;
}

export function logout(): void {
  tokenStorage.clear();
}

export function isAuthenticated(): boolean {
  return tokenStorage.hasToken() && !tokenStorage.isExpired();
}
