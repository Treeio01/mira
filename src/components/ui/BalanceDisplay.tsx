import { Skeleton } from './Skeleton';
import { useUiStore, selectBalanceVisible } from '../../store';
import { formatBalance } from '../../lib/format';

interface BalanceDisplayProps {
  balance: number;
  loading?: boolean;
  size?: 'lg' | 'md';
  hiddenText?: string;
}

const sizeClasses = {
  lg: 'text-[36px]',
  md: 'text-[26px]',
} as const;

const skeletonClasses = {
  lg: 'h-10 w-44',
  md: 'h-7 w-28',
} as const;

export function BalanceDisplay({
  balance,
  loading,
  size = 'lg',
  hiddenText = '******',
}: BalanceDisplayProps) {
  const visible = useUiStore(selectBalanceVisible);
  const { whole, cents } = formatBalance(balance);

  if (loading) {
    return <Skeleton className={skeletonClasses[size]} />;
  }

  if (!visible) {
    return (
      <span className={`font-semibold flex ${sizeClasses[size]} leading-[112%] tracking-[-0.01em] text-white`}>
        {hiddenText}
      </span>
    );
  }

  return (
    <span className={`font-semibold flex ${sizeClasses[size]} leading-[112%] tracking-[-0.01em] text-white`}>
      {whole}<span className="text-white/64">{cents}</span>
    </span>
  );
}
