import { memo } from 'react';

interface SpinnerProps {
  size?: number;
}

export const Spinner = memo(function Spinner({ size = 8 }: SpinnerProps) {
  return (
    <div
      className={`w-${size} h-${size} border-2 border-white/20 border-t-[#661AFF] rounded-full animate-spin`}
    />
  );
});
