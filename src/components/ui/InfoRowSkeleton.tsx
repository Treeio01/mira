import { memo } from 'react';
import { Skeleton } from './Skeleton';

export const InfoRowSkeleton = memo(function InfoRowSkeleton() {
  return (
    <div className="flex w-full bg-[#181424] items-center justify-between rounded-lg gap-2.5 py-3 px-4">
      <Skeleton className="h-5 w-24" />
      <Skeleton className="h-5 w-32" />
    </div>
  );
});
