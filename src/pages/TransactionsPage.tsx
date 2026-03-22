import { useEffect, useState, useCallback } from 'react';
import { PageHeader } from '../components/ui/PageHeader';
import { BackBottomBar } from '../components/ui/BackBottomBar';
import { ErrorMessage } from '../components/ui/ErrorMessage';
import { TransactionList } from '../components/transactions/TransactionList';
import { DatePickerSheet } from '../components/transactions/DatePickerSheet';
import { TypeFilterSheet } from '../components/transactions/TypeFilterSheet';
import {
  useTransactionsStore,
  selectTransactions,
  selectTransactionsCount,
  selectTransactionsLoading,
  selectTransactionsError,
  selectTransactionFilters,
  useCardsStore,
} from '../store';

export default function TransactionsPage() {
  const items = useTransactionsStore(selectTransactions);
  const count = useTransactionsStore(selectTransactionsCount);
  const loading = useTransactionsStore(selectTransactionsLoading);
  const error = useTransactionsStore(selectTransactionsError);
  const filters = useTransactionsStore(selectTransactionFilters);
  const fetchTransactions = useTransactionsStore((s) => s.fetchTransactions);
  const loadMore = useTransactionsStore((s) => s.loadMore);
  const setFilters = useTransactionsStore((s) => s.setFilters);
  const applyFilters = useTransactionsStore((s) => s.applyFilters);
  const resetFilters = useTransactionsStore((s) => s.resetFilters);

  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [typeFilterOpen, setTypeFilterOpen] = useState(false);

  const fetchCards = useCardsStore((s) => s.fetchCards);

  useEffect(() => {
    fetchTransactions();
    fetchCards();
  }, [fetchTransactions, fetchCards]);

  const handleDateApply = useCallback(
    (from: string | null, to: string | null) => {
      setFilters({ startDate: from, endDate: to });
      applyFilters();
    },
    [setFilters, applyFilters],
  );

  const handleTypeApply = useCallback(
    (selected: string[]) => {
      setFilters({ selected });
      applyFilters();
    },
    [setFilters, applyFilters],
  );

  const hasDateFilter = filters.startDate || filters.endDate;
  const hasAccountFilter = !filters.selected.includes('all');

  return (
    <>
      <div className="flex relative flex-col p-4 gap-4 w-full h-full pb-19">
        <PageHeader title={<>История<br />транзакций</>} />

        <div className="flex gap-1.5">
          <button
            onClick={() => setDatePickerOpen(true)}
            className={`flex w-full justify-center items-center gap-1.5 px-4 py-2.5 rounded-[8px] text-sm font-medium tracking-[-0.02em] transition-colors ${hasDateFilter
                ? 'bg-[#221C33] text-[#B6ACD2]'
                : 'bg-[#221C33] text-[#B6ACD2]'
              }`}
          >
            Дата
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="opacity-60">
              <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button
            onClick={() => setTypeFilterOpen(true)}
            className={`flex w-full justify-center items-center gap-1.5 px-4 py-2.5 rounded-[8px] text-sm font-medium tracking-[-0.02em] transition-colors ${hasAccountFilter
                ? 'bg-[#221C33] text-[#B6ACD2]'
                : 'bg-[#221C33] text-[#B6ACD2]'
              }`}
          >
            Тип
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="opacity-60">
              <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        {/* Content */}
        {error ? (
          <div className="flex flex-col items-center justify-center py-8">
            <ErrorMessage
              message={error}
              onRetry={() => {
                resetFilters();
                fetchTransactions();
              }}
            />
          </div>
        ) : (
          <TransactionList
            items={items}
            loading={loading}
            hasMore={items.length < count}
            onLoadMore={loadMore}
          />
        )}
      </div>

      <BackBottomBar />

      {/* Sheets */}
      <DatePickerSheet
        open={datePickerOpen}
        onClose={() => setDatePickerOpen(false)}
        dateFrom={filters.startDate}
        dateTo={filters.endDate}
        onApply={handleDateApply}
      />
      <TypeFilterSheet
        open={typeFilterOpen}
        onClose={() => setTypeFilterOpen(false)}
        currentFilters={filters.selected}
        onApply={handleTypeApply}
      />
    </>
  );
}
