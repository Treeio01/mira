interface ErrorAlertProps {
  message: string;
}

export function ErrorAlert({ message }: ErrorAlertProps) {
  return (
    <div role="alert" aria-live="assertive" className="flex w-full items-center gap-2.5 bg-danger-bg border border-danger/20 rounded-lg px-3 py-2.5">
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className="shrink-0">
        <path
          d="M9 1.5C4.86 1.5 1.5 4.86 1.5 9C1.5 13.14 4.86 16.5 9 16.5C13.14 16.5 16.5 13.14 16.5 9C16.5 4.86 13.14 1.5 9 1.5ZM9 10.125C8.6925 10.125 8.4375 9.87 8.4375 9.5625V6.1875C8.4375 5.88 8.6925 5.625 9 5.625C9.3075 5.625 9.5625 5.88 9.5625 6.1875V9.5625C9.5625 9.87 9.3075 10.125 9 10.125ZM9.5625 12.375H8.4375V11.25H9.5625V12.375Z"
          fill="var(--color-danger)"
        />
      </svg>
      <span className="text-danger-text font-medium text-[13px] leading-[140%] tracking-[-0.02em]">
        {message}
      </span>
    </div>
  );
}
