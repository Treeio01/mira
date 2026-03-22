import { useMemo } from 'react';
import type { TransactionItem } from '../../services/api';
import { TransactionItemRow } from './TransactionItem';
import { Skeleton } from '../ui/Skeleton';

interface TransactionListProps {
  items: TransactionItem[];
  loading: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
}

interface DateGroup {
  label: string;
  transactions: TransactionItem[];
}

const MONTHS_RU = [
  'января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
  'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря',
];

function formatGroupDate(timestamp: number): string {
  const date = new Date(timestamp * 1000);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const target = new Date(date.getFullYear(), date.getMonth(), date.getDate());

  const diffDays = Math.round((today.getTime() - target.getTime()) / 86_400_000);

  if (diffDays === 0) return 'Сегодня';
  if (diffDays === 1) return 'Вчера';

  return `${date.getDate()} ${MONTHS_RU[date.getMonth()]}`;
}

function groupByDate(items: TransactionItem[]): DateGroup[] {
  const map = new Map<string, TransactionItem[]>();

  for (const tx of items) {
    const date = new Date(tx.date_timestamp * 1000);
    const key = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
    const group = map.get(key);
    if (group) {
      group.push(tx);
    } else {
      map.set(key, [tx]);
    }
  }

  return Array.from(map.entries()).map(([, txs]) => ({
    label: formatGroupDate(txs[0].date_timestamp),
    transactions: txs,
  }));
}

export function TransactionList({ items, loading, hasMore, onLoadMore }: TransactionListProps) {
  const groups = useMemo(() => groupByDate(items), [items]);

  if (loading && items.length === 0) {
    return (
      <div className="flex flex-col gap-3">
        <Skeleton className="h-4 w-20 rounded-md" />
        {Array.from({ length: 4 }, (_, i) => (
          <Skeleton key={i} className="h-16 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  if (!loading && items.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <span className="text-text-muted text-sm">Транзакции не найдены</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {groups.map((group) => (
        <div key={group.label} className="flex flex-col gap-2.5">
          <span className="text-white/64  text-xs font-medium leading-[140%] tracking-[-0.02em] px-1">
            {group.label}
          </span>
          <div className="flex flex-col gap-2.5">
            {group.transactions.map((tx, i) => (
              <TransactionItemRow key={tx.transaction_id ?? `${tx.date_timestamp}-${i}`} tx={tx} />
            ))}
          </div>
        </div>
      ))}

      {hasMore && (
        <button
          onClick={onLoadMore}
          disabled={loading}
          className="p-3 rounded-lg bg-white/[0.06] text-white text-sm font-medium active:scale-[0.97] transition-transform disabled:opacity-50"
        >
          {loading ? 'Загрузка...' : 'Показать ещё'}
        </button>
      )}
    </div>
  );
}
