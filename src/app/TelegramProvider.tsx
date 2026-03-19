import type { ReactNode } from 'react';
import { useTelegram } from '../hooks/useTelegram';
import { TelegramContext } from './TelegramContext';

export function TelegramProvider({ children }: { children: ReactNode }) {
  const telegram = useTelegram();

  if (!telegram.isReady) return null;

  return (
    <TelegramContext.Provider value={telegram}>
      {children}
    </TelegramContext.Provider>
  );
}
