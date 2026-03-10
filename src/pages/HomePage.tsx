import { BalanceCard } from '../components/sections/BalanceCard';
import { CardBalance } from '../components/sections/CardBalance';
import { FavoriteCards } from '../components/sections/FavoriteCards';
import { QuickActions } from '../components/sections/QuickActions';

export function HomePage() {
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
