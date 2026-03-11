interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

export function ErrorMessage({ message, onRetry }: ErrorMessageProps) {
  return (
    <div className="flex flex-col items-center gap-3">
      <span className="text-white/50 text-sm text-center">{message}</span>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-4 py-2 bg-[#661AFF] rounded-lg text-white text-sm font-medium active:scale-95 transition-transform"
        >
          Повторить
        </button>
      )}
    </div>
  );
}
