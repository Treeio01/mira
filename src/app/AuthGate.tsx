import { useEffect, type ReactNode } from 'react';
import { useAuthStore } from '../store';

export function AuthGate({ children }: { children: ReactNode }) {
  const isInitialized = useAuthStore((s) => s.isInitialized);
  const isAuthed = useAuthStore((s) => s.isAuthed);
  const isLoading = useAuthStore((s) => s.isLoading);
  const error = useAuthStore((s) => s.error);
  const register = useAuthStore((s) => s.register);

  useEffect(() => {
    register();
  }, [register]);

  // Загрузка — чёрный экран с лоадером
  if (!isInitialized || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="flex flex-col items-center gap-4" role="status" aria-label="Загрузка">
          <div className="w-8 h-8 border-2 border-white/20 border-t-primary rounded-full animate-spin" />
          <span className="text-white/50 text-sm">Загрузка...</span>
        </div>
      </div>
    );
  }

  // Ошибка авторизации
  if (!isAuthed || error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black px-6" role="alert">
        <div className="flex flex-col items-center gap-4 text-center max-w-xs">
          <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center">
            <span className="text-2xl text-white">⚠</span>
          </div>
          <span className="text-white font-semibold text-lg">
            Не удалось авторизоваться
          </span>
          <span className="text-white/50 text-sm leading-relaxed">
            {error || 'Попробуйте перезапустить приложение через Telegram'}
          </span>
          <button
            onClick={() => register()}
            className="mt-2 px-6 py-3 bg-primary rounded-lg text-white font-medium text-sm active:scale-[0.97] transition-transform"
          >
            Попробовать снова
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
