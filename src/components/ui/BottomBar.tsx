import type { ReactNode } from 'react';
import { Fixed } from './FixedLayer';

interface BottomBarProps {
  children: ReactNode;
}

export function BottomBar({ children }: BottomBarProps) {
  return (
    <Fixed>
      <div
        data-fixed
        className="fixed z-50 justify-center rounded-[56px] bg-surface p-1.5 gap-1.5 bottom-4 left-1/2 -translate-x-1/2 w-full max-w-[calc(100%-32px)] flex"
      >
        {children}
      </div>
    </Fixed>
  );
}
