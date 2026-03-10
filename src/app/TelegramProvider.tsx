import { createContext, useContext, type ReactNode } from 'react';
import { useTelegram } from '../hooks/useTelegram';

type TelegramContextValue = ReturnType<typeof useTelegram>;

const TelegramContext = createContext<TelegramContextValue | null>(null);

export function TelegramProvider({ children }: { children: ReactNode }) {
  const telegram = useTelegram();

  if (!telegram.isReady) return null;

  return (
    <TelegramContext.Provider value={telegram}>
      {children}
    </TelegramContext.Provider>
  );
}

export function useTelegramContext(): TelegramContextValue {
  const ctx = useContext(TelegramContext);
  if (!ctx) {
    throw new Error('useTelegramContext must be used within TelegramProvider');
  }
  return ctx;
}
