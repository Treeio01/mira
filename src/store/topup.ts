import { create } from 'zustand';
import {
  getTopUpsMethods as apiGetMethods,
  getTopUpsFinalAmount as apiGetFinalAmount,
} from '../services/api';
import type { TopUpMethodItem, GetTopUpsFinalAmountResponse } from '../services/api';
import { extractErrorMessage } from '../lib/error';
import { createStaleTracker } from '../lib/stale';

// ── Types ──

interface TopUpState {
  methods: TopUpMethodItem[];
  usdToRub: number | null;
  methodsLoading: boolean;
  methodsError: string | null;

  finalAmount: GetTopUpsFinalAmountResponse | null;
  finalLoading: boolean;
  finalError: string | null;
}

interface TopUpActions {
  fetchMethods: () => Promise<void>;
  fetchFinalAmount: (methodName: string, amount: number) => Promise<void>;
  clearFinal: () => void;
}

type TopUpStore = TopUpState & TopUpActions;

const methodsStale = createStaleTracker(60_000);

// ── Store ──

export const useTopUpStore = create<TopUpStore>()((set, get) => ({
  methods: [],
  usdToRub: null,
  methodsLoading: false,
  methodsError: null,

  finalAmount: null,
  finalLoading: false,
  finalError: null,

  fetchMethods: async () => {
    if (get().methodsLoading || methodsStale.isFresh()) return;
    set({ methodsLoading: true, methodsError: null });

    try {
      const data = await apiGetMethods();
      methodsStale.markFresh();
      set({ methods: data.methods, usdToRub: data.usd_to_rub, methodsLoading: false });
    } catch (e) {
      set({ methodsError: extractErrorMessage(e, 'Не удалось загрузить методы пополнения'), methodsLoading: false });
    }
  },

  fetchFinalAmount: async (methodName, amount) => {
    set({ finalLoading: true, finalError: null });

    try {
      const data = await apiGetFinalAmount({ method_name: methodName, amount });
      set({ finalAmount: data, finalLoading: false });
    } catch (e) {
      set({ finalError: extractErrorMessage(e, 'Не удалось рассчитать сумму'), finalLoading: false });
    }
  },

  clearFinal: () => set({ finalAmount: null, finalError: null }),
}));

// ── Selectors ──

export const selectTopUpMethods = (s: TopUpStore) => s.methods;
export const selectUsdToRub = (s: TopUpStore) => s.usdToRub;
export const selectMethodsLoading = (s: TopUpStore) => s.methodsLoading;
export const selectMethodsError = (s: TopUpStore) => s.methodsError;

export const selectFinalAmount = (s: TopUpStore) => s.finalAmount;
export const selectFinalLoading = (s: TopUpStore) => s.finalLoading;
export const selectFinalError = (s: TopUpStore) => s.finalError;
