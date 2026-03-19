import { useRouteError } from 'react-router-dom';

export function RouteErrorBoundary() {
  const error = useRouteError();

  return (
    <div className="flex flex-col items-center justify-center h-full gap-4 p-4" role="alert">
      <span className="text-white/80 font-semibold text-lg">Что-то пошло не так</span>
      <span className="text-white/50 text-sm text-center">
        {error instanceof Error ? error.message : 'Произошла непредвиденная ошибка'}
      </span>
      <button
        onClick={() => window.location.reload()}
        className="px-6 py-3 bg-primary rounded-lg text-white font-medium text-sm active:scale-[0.97] transition-transform"
      >
        Перезагрузить
      </button>
    </div>
  );
}
