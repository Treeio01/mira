import { Skeleton } from '../ui/Skeleton';

interface IssueCategorySkeletonProps {
  count?: number;
}

export function IssueCategorySkeleton({ count = 3 }: IssueCategorySkeletonProps) {
  return (
    <>
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="flex flex-col gap-3 bg-[#181424] rounded-lg p-4">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full rounded-lg" />
        </div>
      ))}
    </>
  );
}
