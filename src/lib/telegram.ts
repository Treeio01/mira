import type { TelegramInitData, WebApp } from '../types/telegram';

export function getWebApp(): WebApp | null {
  return window.Telegram?.WebApp ?? null;
}

export function parseInitData(initData: string): TelegramInitData | null {
  if (!initData) return null;

  try {
    const params = new URLSearchParams(initData);
    const result: Record<string, unknown> = {};

    for (const [key, value] of params.entries()) {
      try {
        result[key] = JSON.parse(value);
      } catch {
        result[key] = value;
      }
    }

    return result as unknown as TelegramInitData;
  } catch {
    return null;
  }
}

export function getStartParam(): string | null {
  const webapp = getWebApp();
  if (webapp?.initDataUnsafe?.start_param) {
    return webapp.initDataUnsafe.start_param;
  }

  const url = new URL(window.location.href);
  return url.searchParams.get('tgWebAppStartParam');
}

export function getLaunchParams(): Record<string, string> {
  const url = new URL(window.location.href);
  const params: Record<string, string> = {};

  // Стандартные TG WebApp GET-параметры
  const tgKeys = [
    'tgWebAppData',
    'tgWebAppThemeParams',
    'tgWebAppVersion',
    'tgWebAppPlatform',
    'tgWebAppStartParam',
    'tgWebAppShowSettings',
    'tgWebAppBotInline',
  ];

  for (const key of tgKeys) {
    const value = url.searchParams.get(key);
    if (value !== null) {
      params[key] = value;
    }
  }

  // Fragment-параметры (Telegram иногда передаёт данные через hash)
  if (url.hash) {
    const fragment = url.hash.startsWith('#') ? url.hash.slice(1) : url.hash;
    const hashParams = new URLSearchParams(fragment);
    for (const [key, value] of hashParams.entries()) {
      if (!params[key]) {
        params[key] = value;
      }
    }
  }

  return params;
}

export function isTelegramWebApp(): boolean {
  return !!window.Telegram?.WebApp?.initData;
}
