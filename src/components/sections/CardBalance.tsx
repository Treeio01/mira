import { useMenuStore, useUiStore, selectCardsBalance, selectBalanceVisible } from '../../store';
import { formatBalance } from '../../lib/format';
import { Skeleton } from '../ui/Skeleton';

interface CardBalanceProps {
  loading?: boolean;
}

export function CardBalance({ loading }: CardBalanceProps) {
  const cardsBalance = useMenuStore(selectCardsBalance);
  const visible = useUiStore(selectBalanceVisible);
  const { whole, cents } = formatBalance(cardsBalance);

  return (
    <div
      className="flex flex-col w-full p-4 rounded-[14px] items-start justify-center"
      style={{ background: 'radial-gradient(84% 120% at 50% 100%, rgba(102, 26, 255, 0.35) 0%, rgba(102, 26, 255, 0) 100%), rgb(21, 17, 31)' }}
    >
      <div className="flex flex-col py-1.5 gap-1.5">
        <span className="text-sm text-white/64 tracking-[-0.02em]">
          Общий баланс карт
        </span>
        {loading ? (
          <Skeleton className="h-7 w-28" />
        ) : visible ? (
          <span className="font-semibold flex text-[26px] leading-[112%] tracking-[-0.01em] text-white">
            {whole}<span className="text-white/64">{cents}</span>
          </span>
        ) : (
          <span className="font-semibold flex text-[26px] leading-[112%] tracking-[-0.01em] text-white">
            ******
          </span>
        )}
      </div>
    </div>
  );
}
