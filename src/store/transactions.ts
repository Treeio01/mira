import { create } from 'zustand';
import { getTransactions as apiGetTransactions } from '../services/api';
import type { TransactionItem } from '../services/api';
import { extractErrorMessage } from '../lib/error';

// ── Types ──

/** API-level filters (sent to server) */
const ACCOUNT_FILTER_KEYS = new Set(['all', 'main_balance']);
function isAccountFilter(key: string): boolean {
  return ACCOUNT_FILTER_KEYS.has(key) || /^card_\{?\d+\}?$/.test(key);
}

/** Client-side type filter matchers (matched against transaction `name`) */
const TYPE_MATCHERS: Record<string, (tx: TransactionItem) => boolean> = {
  topup_balance: (tx) => /пополнение\s*(основ|баланс)/i.test(tx.name),
  topup_cards: (tx) => /пополнение\s*карт/i.test(tx.name),
  purchase: (tx) => /оплата|покупка/i.test(tx.name),
  declined: (tx) => /отклон/i.test(tx.name) || tx.color === 'red',
  commission: (tx) => /комисси/i.test(tx.name),
  other: (tx) => {
    // "other" matches anything that doesn't match above types
    const known = ['topup_balance', 'topup_cards', 'purchase', 'declined', 'commission'] as const;
    return !known.some((k) => TYPE_MATCHERS[k](tx));
  },
};

export interface TransactionFilters {
  /** Combined filter keys from the UI (account + type keys) */
  selected: string[];
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
  selected: ['all'],
  startDate: null,
  endDate: null,
  page: 1,
};

/** Extract API-compatible account filters from combined selection */
function getApiFilters(selected: string[]): string[] {
  if (selected.includes('all')) return ['all'];
  const accountFilters = selected.filter(isAccountFilter);
  return accountFilters.length > 0 ? accountFilters : ['all'];
}

/** Get client-side type filter functions from combined selection */
function getTypeFilters(selected: string[]): ((tx: TransactionItem) => boolean)[] {
  if (selected.includes('all')) return [];
  const typeKeys = selected.filter((k) => !isAccountFilter(k));
  return typeKeys.map((k) => TYPE_MATCHERS[k]).filter(Boolean);
}

function applyClientFilters(items: TransactionItem[], selected: string[]): TransactionItem[] {
  const typeFilters = getTypeFilters(selected);
  if (typeFilters.length === 0) return items;
  return items.filter((tx) => typeFilters.some((fn) => fn(tx)));
}

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
    const apiFilters = getApiFilters(filters.selected);

    try {
      const data = await apiGetTransactions(
        {
          filters: apiFilters,
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
    const apiFilters = getApiFilters(filters.selected);
    set({ _abort: controller, loading: true });

    try {
      const data = await apiGetTransactions(
        {
          filters: apiFilters,
          start_date: filters.startDate,
          end_date: filters.endDate,
          page: nextPage,
        },
        controller.signal,
      );
      if (!controller.signal.aborted) {
        set({
          items: [...get().items, ...data.transactions],
          count: data.count,
          loading: false,
          filters: { ...filters, page: nextPage },
        });
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

export const selectTransactionsRaw = (s: TransactionsStore) => s.items;
export const selectTransactionsCount = (s: TransactionsStore) => s.count;
export const selectTransactionsLoading = (s: TransactionsStore) => s.loading;
export const selectTransactionsError = (s: TransactionsStore) => s.error;
export const selectTransactionFilters = (s: TransactionsStore) => s.filters;

/** Returns unique card accounts from loaded transactions */
let _prevAccountItems: TransactionItem[] = [];
let _prevAccounts: string[] = [];

export const selectCardAccounts = (s: TransactionsStore): string[] => {
  if (s.items === _prevAccountItems) return _prevAccounts;
  _prevAccountItems = s.items;
  const set = new Set<string>();
  for (const tx of s.items) {
    if (tx.account.startsWith('card_')) set.add(tx.account);
  }
  _prevAccounts = Array.from(set);
  return _prevAccounts;
};

/** Returns items with client-side type filters applied (memoized) */
let _prevItems: TransactionItem[] = [];
let _prevSelected: string[] = [];
let _prevResult: TransactionItem[] = [];

export const selectTransactions = (s: TransactionsStore): TransactionItem[] => {
  const { items } = s;
  const { selected } = s.filters;
  if (items === _prevItems && selected === _prevSelected) return _prevResult;
  _prevItems = items;
  _prevSelected = selected;
  _prevResult = applyClientFilters(items, selected);
  return _prevResult;
};
