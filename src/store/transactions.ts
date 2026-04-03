import { create } from 'zustand';
import { getTransactions as apiGetTransactions } from '../services/api';
import type { TransactionItem } from '../services/api';
import { extractErrorMessage } from '../lib/error';

// ── Types ──

export interface TransactionFilters {
  accounts: string[];
  types: string[];
  startDate: string | null;
  endDate: string | null;
  page: number;
}

interface TransactionsState {
  items: TransactionItem[];
  count: number;
  loading: boolean;
  error: string | null;
  filters: TransactionFilters;

  /** @internal */ _abort: AbortController | null;
}

interface TransactionsActions {
  fetchTransactions: () => Promise<void>;
  setFilters: (filters: Partial<TransactionFilters>) => void;
  applyFilters: () => void;
  resetFilters: () => void;
  loadMore: () => Promise<void>;
}

type TransactionsStore = TransactionsState & TransactionsActions;

const defaultFilters: TransactionFilters = {
  accounts: ['all'],
  types: ['all'],
  startDate: null,
  endDate: null,
  page: 1,
};

// ── Store ──

export const useTransactionsStore = create<TransactionsStore>()((set, get) => ({
  items: [],
  count: 0,
  loading: false,
  error: null,
  filters: { ...defaultFilters },
  _abort: null,

  fetchTransactions: async () => {
    get()._abort?.abort();
    const controller = new AbortController();
    set({ _abort: controller, loading: true, error: null });

    const { filters } = get();

    try {
      const data = await apiGetTransactions(
        {
          accounts: filters.accounts,
          filters: filters.types,
          start_date: filters.startDate,
          end_date: filters.endDate,
          page: 1,
        },
        controller.signal,
      );
      if (!controller.signal.aborted) {
        set((s) => ({
          items: data.transactions,
          count: data.count,
          loading: false,
          filters: s.filters.page === 1 ? s.filters : { ...s.filters, page: 1 },
        }));
      }
    } catch (e) {
      if (!controller.signal.aborted) {
        set({ error: extractErrorMessage(e, 'Не удалось загрузить транзакции'), loading: false });
      }
    }
  },

  loadMore: async () => {
    const { loading, items, count, filters } = get();
    if (loading || items.length >= count) return;

    const nextPage = filters.page + 1;
    const controller = new AbortController();
    set({ _abort: controller, loading: true });

    try {
      const data = await apiGetTransactions(
        {
          accounts: filters.accounts,
          filters: filters.types,
          start_date: filters.startDate,
          end_date: filters.endDate,
          page: nextPage,
        },
        controller.signal,
      );
      if (!controller.signal.aborted) {
        set((s) => ({
          items: [...s.items, ...data.transactions],
          count: data.count,
          loading: false,
          filters: { ...s.filters, page: nextPage },
        }));
      }
    } catch (e) {
      if (!controller.signal.aborted) {
        set({ error: extractErrorMessage(e, 'Не удалось загрузить транзакции'), loading: false });
      }
    }
  },

  setFilters: (partial) => {
    set((s) => ({ filters: { ...s.filters, ...partial } }));
  },

  applyFilters: () => {
    get().fetchTransactions();
  },

  resetFilters: () => {
    set({ filters: { ...defaultFilters } });
  },
}));

// ── Selectors ──

export const selectTransactions = (s: TransactionsStore) => s.items;
export const selectTransactionsCount = (s: TransactionsStore) => s.count;
export const selectTransactionsLoading = (s: TransactionsStore) => s.loading;
export const selectTransactionsError = (s: TransactionsStore) => s.error;
export const selectTransactionFilters = (s: TransactionsStore) => s.filters;
