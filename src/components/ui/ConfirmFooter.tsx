import type { ReactNode } from 'react';
import { ErrorAlert } from './ErrorAlert';

interface ConfirmFooterProps {
  total: number;
  buying: boolean;
  buyError: string | null;
  disabled?: boolean;
  onConfirm: () => void;
  children?: ReactNode;
}

export function ConfirmFooter({ total, buying, buyError, disabled, onConfirm, children }: ConfirmFooterProps) {
  return (
    <div className="flex flex-col gap-4 items-center bg-[#181424] rounded-lg p-4">
      {children}

      {buyError && <ErrorAlert message={buyError} />}

      <div className="flex justify-between items-center px-1 w-full">
        <span className="text-white font-medium text-[16px] leading-[140%] tracking-[-0.02em]">
          К оплате:
        </span>
        <span className="text-white font-medium text-[16px] leading-[140%] tracking-[-0.02em]">
          {total.toFixed(2)}$
        </span>
      </div>

      <button
        onClick={onConfirm}
        disabled={buying || disabled}
        className="flex w-full py-3 justify-center items-center rounded-lg bg-[#661AFF] active:scale-[0.97] transition-transform disabled:opacity-50"
      >
        <span className="text-white font-medium text-sm leading-[140%] tracking-[-0.02em]">
          {buying ? 'Обработка...' : 'Подтвердить покупку'}
        </span>
      </button>
    </div>
  );
}
