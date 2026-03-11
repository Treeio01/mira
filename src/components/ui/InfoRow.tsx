import type { ReactNode } from 'react';
import { CopyButton } from './CopyButton';

interface InfoRowProps {
  label: string;
  value: ReactNode;
  copyValue?: string;
  action?: ReactNode;
}

export function InfoRow({ label, value, copyValue, action }: InfoRowProps) {
  const showAction = action ?? (copyValue ? <CopyButton text={copyValue} /> : null);

  return (
    <div className="flex w-full bg-[#181424] items-center justify-between rounded-lg gap-2.5 py-3 px-4">
      <span className="text-[#A095BD] overflow-hidden text-sm font-medium leading-[140%] tracking-[-0.02em] whitespace-nowrap text-ellipsis">
        {label}
      </span>
      {showAction ? (
        <div className="flex gap-1.5 items-center">
          <span className="text-white whitespace-nowrap text-ellipsis overflow-hidden text-sm font-medium leading-[140%] tracking-[-0.02em]">
            {value}
          </span>
          {showAction}
        </div>
      ) : (
        <span className="text-white whitespace-nowrap text-ellipsis overflow-hidden text-sm font-medium leading-[140%] tracking-[-0.02em]">
          {value}
        </span>
      )}
    </div>
  );
}
