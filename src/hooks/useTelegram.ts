import { useCallback, useEffect, useMemo, useState } from 'react';
import { getWebApp, parseInitData, getStartParam, getLaunchParams, isTelegramWebApp } from '../lib/telegram';
import type { TelegramInitData, ThemeParams, WebApp } from '../types/telegram';

interface UseTelegramReturn {
  webApp: WebApp | null;
  user: TelegramInitData['user'] | null;
  initData: TelegramInitData | null;
  initDataRaw: string;
  startParam: string | null;
  launchParams: Record<string, string>;
  colorScheme: 'light' | 'dark';
  themeParams: ThemeParams;
  isReady: boolean;
  isTelegram: boolean;
  haptic: WebApp['HapticFeedback'] | null;
  close: () => void;
  expand: () => void;
  showAlert: (message: string) => Promise<void>;
  showConfirm: (message: string) => Promise<boolean>;
}

export function useTelegram(): UseTelegramReturn {
  const [isReady, setIsReady] = useState(false);
  const webApp = useMemo(() => getWebApp(), []);

  useEffect(() => {
    if (webApp) {
      webApp.ready();
      webApp.expand();
      setIsReady(true);
    } else {
      // Не в TG — всё равно готовы
      setIsReady(true);
    }
  }, [webApp]);

  const initDataRaw = webApp?.initData ?? '';
  const initData = useMemo(() => parseInitData(initDataRaw), [initDataRaw]);
  const user = webApp?.initDataUnsafe?.user ?? initData?.user ?? null;
  const startParam = useMemo(() => getStartParam(), []);
  const launchParams = useMemo(() => getLaunchParams(), []);
  const colorScheme = webApp?.colorScheme ?? 'light';
  const themeParams = webApp?.themeParams ?? {};
  const isTelegram = isTelegramWebApp();
  const haptic = webApp?.HapticFeedback ?? null;

  const close = useCallback(() => webApp?.close(), [webApp]);
  const expand = useCallback(() => webApp?.expand(), [webApp]);

  const showAlert = useCallback(
    (message: string) =>
      new Promise<void>((resolve) => {
        if (webApp) {
          webApp.showAlert(message, resolve);
        } else {
          alert(message);
          resolve();
        }
      }),
    [webApp],
  );

  const showConfirm = useCallback(
    (message: string) =>
      new Promise<boolean>((resolve) => {
        if (webApp) {
          webApp.showConfirm(message, (ok) => resolve(ok));
        } else {
          resolve(confirm(message));
        }
      }),
    [webApp],
  );

  return {
    webApp,
    user,
    initData,
    initDataRaw,
    startParam,
    launchParams,
    colorScheme,
    themeParams,
    isReady,
    isTelegram,
    haptic,
    close,
    expand,
    showAlert,
    showConfirm,
  };
}
