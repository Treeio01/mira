import { GradientHeader } from '../ui/GradientHeader';
import { Skeleton } from '../ui/Skeleton';
import { EyeIcon } from '../icons/EyeIcon';
import { EyeHiddenIcon } from '../icons/EyeHiddenIcon';
import { PlusIcon } from '../icons/PlusIcon';
import { useMenuStore, useAuthStore, useUiStore, selectMainBalance, selectBalanceVisible } from '../../store';
import { formatBalance } from '../../lib/format';

interface BalanceCardProps {
  title?: string;
  balance?: number;
  loading?: boolean;
}

export function BalanceCard({ title = 'Основной баланс', balance, loading }: BalanceCardProps) {
  const visible = useUiStore(selectBalanceVisible);
  const toggleVisible = useUiStore((s) => s.toggleBalanceVisible);
  const mainBalance = useMenuStore(selectMainBalance);
  const userId = useAuthStore((s) => s.userId);
  const displayBalance = balance ?? mainBalance;
  const { whole, cents } = formatBalance(displayBalance);

  return (
    <GradientHeader className="flex-col gap-2.5">
      <div className="flex flex-col gap-1.5 w-full z-10">
        <span className="text-white/64 font-medium text-sm leading-[140%] tracking-[-0.01em]">
          {title}
        </span>
        <div className="flex items-center gap-4">
          {loading ? (
            <Skeleton className="h-10 w-44" />
          ) : visible ? (
            <span className="font-semibold flex text-[36px] leading-[112%] tracking-[-0.01em] text-white">
              {whole}<span className="text-white/64">{cents}</span>
            </span>
          ) : (
            <span className="font-semibold flex text-[36px] leading-[112%] tracking-[-0.01em] text-white">
              **********
            </span>
          )}
          {!loading && (
            <button onClick={toggleVisible}>
              {visible ? <EyeIcon /> : <EyeHiddenIcon />}
            </button>
          )}
        </div>
      </div>

      <div className="flex w-full justify-between gap-6 z-10">
        <button className="flex px-4 py-3 gap-2.5 items-center bg-[#661AFF] rounded-lg w-max">
          <PlusIcon />
          <span className="text-white font-medium leading-[140%] tracking-[-0.02em] whitespace-nowrap">
            Пополнить баланс
          </span>
        </button>
        {userId && (
          <div className="flex py-3 px-4 rounded-lg bg-black/24 backdrop-blur-[7px] items-center">
            <span className="text-white font-medium text-xs leading-[140%] tracking-[-0.02em] whitespace-nowrap">
              ID: {userId}
            </span>
          </div>
        )}
      </div>
    </GradientHeader>
  );
}
