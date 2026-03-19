import { memo } from 'react';
import { Skeleton } from '../ui/Skeleton';

export const CardListItemSkeleton = memo(function CardListItemSkeleton() {
  return (
    <div className="flex p-1.5 w-full items-start justify-between bg-surface rounded-2xl border border-[#2A223E]">
      <div className="flex gap-3 items-center">
        <Skeleton className="h-22 w-36 rounded-xl" />
        <div className="flex flex-col gap-1.5">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-3.5 w-16" />
          <Skeleton className="h-3 w-10" />
        </div>
      </div>
    </div>
  );
});
