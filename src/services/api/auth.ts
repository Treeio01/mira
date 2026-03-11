import { apiRequest } from './client';
import { tokenStorage } from './token';
import type { RegisterPayload, RegisterResponse } from './types';
import { getWebApp, parseInitData } from '../../lib/telegram';

/**
 * Регистрация / вход через Telegram initData.
 * Отправляет распаршенные поля из WebApp.initData.
 */
export async function register(): Promise<RegisterResponse> {
  const webApp = getWebApp();
  const initData = webApp?.initData;

  if (!initData) {
    throw new Error('Telegram WebApp недоступен');
  }

  const parsed = parseInitData(initData);

  if (!parsed?.user?.id || !parsed.hash) {
    throw new Error('Невалидные данные Telegram');
  }

  const payload: RegisterPayload = {
    query_id: parsed.query_id ?? '',
    user: {
      id: parsed.user.id,
      first_name: parsed.user.first_name ?? null,
      username: parsed.user.username ?? null,
    },
    auth_date: parsed.auth_date,
    hash: parsed.hash,
  };

  const data = await apiRequest<RegisterResponse>('/api/v1/register', {
    body: payload,
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
