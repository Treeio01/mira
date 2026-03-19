import { createContext, useContext } from 'react';
import type { useTelegram } from '../hooks/useTelegram';

export type TelegramContextValue = ReturnType<typeof useTelegram>;

export const TelegramContext = createContext<TelegramContextValue | null>(null);

export function useTelegramContext(): TelegramContextValue {
  const ctx = useContext(TelegramContext);
  if (!ctx) {
    throw new Error('useTelegramContext must be used within TelegramProvider');
  }
  return ctx;
}
