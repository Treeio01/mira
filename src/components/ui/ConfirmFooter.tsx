import type { ReactNode } from 'react';
import { ErrorAlert } from './ErrorAlert';

interface ConfirmFooterProps {
  total: number;
  totalText?: string;
  buying?: boolean;
  buyError?: string | null;
  disabled?: boolean;
  onConfirm: () => void;
  buttonText?: string;
  wrapped?: boolean;
  children?: ReactNode;
}

export function ConfirmFooter({ total, totalText, buying, buyError, disabled, onConfirm, buttonText = 'Подтвердить покупку', wrapped = true, children }: ConfirmFooterProps) {
  const content = (
    <>
      {children}

      {buyError && <ErrorAlert message={buyError} />}

      <div className="flex justify-between items-center px-1 w-full">
        <span className="text-white/64 font-medium text-[16px] leading-[140%] tracking-[-0.02em]">
          К оплате:
        </span>
        <span className="text-white font-semibold text-[16px] leading-[140%] tracking-[-0.02em]">
          {totalText ?? `$${total.toFixed(2)}`}
        </span>
      </div>

      <button
        onClick={onConfirm}
        disabled={buying || disabled}
        className="flex w-full py-3 justify-center items-center rounded-lg bg-primary active:scale-[0.97] transition-transform disabled:opacity-50"
      >
        <span className="text-white font-medium text-sm leading-[140%] tracking-[-0.02em]">
          {buying ? 'Обработка...' : buttonText}
        </span>
      </button>
    </>
  );

  if (!wrapped) return <div className="flex flex-col gap-4 mt-auto">{content}</div>;

  return (
    <div className="flex flex-col gap-4 items-center bg-surface-alt rounded-lg p-4">
      {content}
    </div>
  );
}
