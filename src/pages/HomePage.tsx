import { useEffect } from 'react';
import { BalanceCard } from '../components/sections/BalanceCard';
import { CardBalance } from '../components/sections/CardBalance';
import { FavoriteCards } from '../components/sections/FavoriteCards';
import { QuickActions } from '../components/sections/QuickActions';
import { Skeleton } from '../components/ui/Skeleton';
import { ErrorMessage } from '../components/ui/ErrorMessage';
import { useMenuStore, selectMenuLoading, selectMenuError } from '../store';

function HomePageSkeleton() {
  return (
    <div className="flex flex-col p-4 gap-4 w-full h-full mb-18">
      <div className="flex flex-col w-full gap-2.5">
        {/* BalanceCard skeleton */}
        <div className="rounded-2xl overflow-hidden p-5 flex flex-col gap-4 bg-white/[0.04]">
          <div className="flex flex-col gap-2">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-10 w-48" />
          </div>
          <div className="flex justify-between">
            <Skeleton className="h-11 w-40 rounded-lg" />
            <Skeleton className="h-11 w-24 rounded-lg" />
          </div>
        </div>
        {/* CardBalance skeleton */}
        <div className="rounded-[14px] p-4 bg-white/[0.04]">
          <div className="flex flex-col gap-2 py-1.5">
            <Skeleton className="h-3.5 w-32" />
            <Skeleton className="h-8 w-28" />
          </div>
        </div>
        <Skeleton className="h-12 w-full rounded-lg" />
      </div>
      {/* FavoriteCards skeleton */}
      <div className="flex flex-col gap-3.5">
        <Skeleton className="h-6 w-36" />
        <div className="flex gap-1.5">
          <Skeleton className="h-24 w-14 rounded-xl" />
          <Skeleton className="h-24 w-36 rounded-xl" />
          <Skeleton className="h-24 w-36 rounded-xl" />
        </div>
      </div>
    </div>
  );
}

export function HomePage() {
  const fetchMenu = useMenuStore((s) => s.fetchMenu);
  const isLoading = useMenuStore(selectMenuLoading);
  const error = useMenuStore(selectMenuError);

  useEffect(() => {
    fetchMenu();
  }, [fetchMenu]);

  if (isLoading) {
    return <HomePageSkeleton />;
  }

  if (error) {
    return (
      <div className="flex flex-col p-4 gap-4 w-full h-full mb-18 items-center justify-center">
        <ErrorMessage message={error} onRetry={fetchMenu} />
      </div>
    );
  }

  return (
    <div className="flex flex-col p-4 gap-4 w-full h-full mb-18">
      <div className="flex flex-col w-full gap-2.5">
        <BalanceCard />
        <CardBalance />
        <button className="p-3 bg-[#661AFF] rounded-lg flex justify-center items-center">
          <span className="font-medium text-white leading-[140%] tracking-[-0.02em]">
            Выпустить карту
          </span>
        </button>
      </div>
      <FavoriteCards />
      <QuickActions />
    </div>
  );
}
