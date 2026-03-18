import { useMenuStore, selectCardsBalance } from '../../store';
import { BalanceDisplay } from '../ui/BalanceDisplay';

interface CardBalanceProps {
  loading?: boolean;
}

export function CardBalance({ loading }: CardBalanceProps) {
  const cardsBalance = useMenuStore(selectCardsBalance);

  return (
    <div
      className="flex flex-col w-full p-4 rounded-[14px] items-start justify-center"
      style={{ background: 'radial-gradient(84% 120% at 50% 100%, rgba(102, 26, 255, 0.35) 0%, rgba(102, 26, 255, 0) 100%), rgb(21, 17, 31)' }}
    >
      <div className="flex flex-col py-1.5 gap-1.5">
        <span className="text-sm text-white/64 tracking-[-0.02em]">
          Общий баланс карт
        </span>
        <BalanceDisplay balance={cardsBalance} loading={loading} size="md" />
      </div>
    </div>
  );
}
