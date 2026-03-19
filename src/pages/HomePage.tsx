import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BalanceCard } from '../components/sections/BalanceCard';
import { CardBalance } from '../components/sections/CardBalance';
import { FavoriteCards } from '../components/sections/FavoriteCards';
import { QuickActions } from '../components/sections/QuickActions';
import { ErrorMessage } from '../components/ui/ErrorMessage';
import { useMenuStore, selectMenuLoading, selectMenuError } from '../store';
import { ROUTES } from '../lib/routes';

export default function HomePage() {
  const fetchMenu = useMenuStore((s) => s.fetchMenu);
  const navigate = useNavigate();
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
        <button onClick={() => navigate(ROUTES.CARDS_CREATE)} className="p-3 bg-primary rounded-lg flex justify-center items-center">
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
