import { memo } from 'react';
import type { TransactionItem as TxItem } from '../../services/api';
import { TransactionIcon } from './TransactionIcon';

interface TransactionItemProps {
  tx: TxItem;
}

const COLOR_MAP: Record<string, string> = {
  green: 'text-[#00FF44]',
  red: 'text-danger-text',
  white: 'text-white',
};

function formatTxDate(dateStr: string): string {
  // API format: "DD-MM-YYYY HH:MM:SS"
  return dateStr.replace(/^(\d{2})-(\d{2})-(\d{4})\s/, '$1.$2.$3, ');
}

export const TransactionItemRow = memo(function TransactionItemRow({ tx }: TransactionItemProps) {
  const amountClass = COLOR_MAP[tx.color] ?? 'text-white';

  return (
    <div className="flex items-center justify-between gap-3 p-3 rounded-[8px] bg-[#181424]">
      <div className="flex gap-3 items-center min-w-0 flex-1">
        <TransactionIcon name={tx.name} color={tx.color} />
        <div className="flex flex-col min-w-0">
          <span className="text-white text-sm font-medium leading-[140%] tracking-[-0.02em] truncate">
            {tx.name}
          </span>
          {tx.merchant && (
            <span className="text-text-hint text-xs leading-[140%] tracking-[-0.02em] truncate">
              {tx.merchant}
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-col items-end shrink-0">
        <span className={`text-sm font-semibold leading-[140%] tracking-[-0.02em] whitespace-nowrap ${amountClass}`}>
          {tx.amount}
        </span>
        <span className="text-text-hint text-xs leading-[140%] tracking-[-0.02em] whitespace-nowrap">
          {formatTxDate(tx.date)}
        </span>
      </div>
    </div>
  );
});
