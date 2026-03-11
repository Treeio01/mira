import { memo } from 'react';

interface SkeletonProps {
  className?: string;
}

export const Skeleton = memo(function Skeleton({ className = 'h-4 w-full' }: SkeletonProps) {
  return (
    <div
      className={`relative overflow-hidden rounded-lg bg-white/[0.06] ${className}`}
    >
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />
    </div>
  );
});
