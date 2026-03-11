import { useEffect } from 'react';
import { BalanceCard } from '../components/sections/BalanceCard';
import { CardBalance } from '../components/sections/CardBalance';
import { FavoriteCards } from '../components/sections/FavoriteCards';
import { QuickActions } from '../components/sections/QuickActions';
import { ErrorMessage } from '../components/ui/ErrorMessage';
import { useMenuStore, selectMenuLoading, selectMenuError } from '../store';

export function HomePage() {
  const fetchMenu = useMenuStore((s) => s.fetchMenu);
  const isLoading = useMenuStore(selectMenuLoading);
  const error = useMenuStore(selectMenuError);

  useEffect(() => {
    fetchMenu();
  }, [fetchMenu]);

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
        <BalanceCard loading={isLoading} />
        <CardBalance loading={isLoading} />
        <button className="p-3 bg-[#661AFF] rounded-lg flex justify-center items-center">
          <span className="font-medium text-white leading-[140%] tracking-[-0.02em]">
            Выпустить карту
          </span>
        </button>
      </div>
      <FavoriteCards loading={isLoading} />
      <QuickActions />
    </div>
  );
}
