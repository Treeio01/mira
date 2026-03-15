import { create } from 'zustand';
import {
  getAvailableCards as apiGetAvailableCards,
  confirmBuyCard as apiConfirmBuyCard,
  getAvailableEsim as apiGetAvailableEsim,
  confirmBuyEsim as apiConfirmBuyEsim,
} from '../services/api';
import type { IssueCardCategory, EsimCategory } from '../services/api';
import { extractErrorMessage } from '../lib/error';
import { createStaleTracker } from '../lib/stale';

// ── Types ──

interface IssueState {
  cards: IssueCardCategory[];
  cardsLoading: boolean;
  cardsError: string | null;

  esims: EsimCategory[];
  esimsLoading: boolean;
  esimsError: string | null;

  buying: boolean;
  buyError: string | null;
}

interface IssueActions {
  fetchCards: () => Promise<void>;
  fetchEsims: () => Promise<void>;
  buyCard: (categoryId: number, amountTopUp: number) => Promise<boolean>;
  buyEsim: (categoryId: number) => Promise<boolean>;
  clearBuyError: () => void;
}

type IssueStore = IssueState & IssueActions;

const issueCardsStale = createStaleTracker(60_000);
const esimsStale = createStaleTracker(60_000);

// ── Store ──

export const useIssueStore = create<IssueStore>()((set, get) => ({
  cards: [],
  cardsLoading: false,
  cardsError: null,

  esims: [],
  esimsLoading: false,
  esimsError: null,

  buying: false,
  buyError: null,

  fetchCards: async () => {
    if (get().cardsLoading || issueCardsStale.isFresh()) return;
    set({ cardsLoading: true, cardsError: null });

    try {
      const { cards_list } = await apiGetAvailableCards();
      issueCardsStale.markFresh();
      set({ cards: cards_list, cardsLoading: false });
    } catch (e) {
      set({ cardsError: extractErrorMessage(e, 'Не удалось загрузить карты'), cardsLoading: false });
    }
  },

  fetchEsims: async () => {
    if (get().esimsLoading || esimsStale.isFresh()) return;
    set({ esimsLoading: true, esimsError: null });

    try {
      const { esim_list } = await apiGetAvailableEsim();
      esimsStale.markFresh();
      set({ esims: esim_list, esimsLoading: false });
    } catch (e) {
      set({ esimsError: extractErrorMessage(e, 'Не удалось загрузить eSIM'), esimsLoading: false });
    }
  },

  buyCard: async (categoryId, amountTopUp) => {
    set({ buying: true, buyError: null });

    try {
      await apiConfirmBuyCard({ category_id: categoryId, amount_top_up: amountTopUp });
      set({ buying: false });
      return true;
    } catch (e) {
      set({ buyError: extractErrorMessage(e, 'Не удалось выпустить карту'), buying: false });
      return false;
    }
  },

  buyEsim: async (categoryId) => {
    set({ buying: true, buyError: null });

    try {
      await apiConfirmBuyEsim({ category_id: categoryId });
      set({ buying: false });
      return true;
    } catch (e) {
      set({ buyError: extractErrorMessage(e, 'Не удалось купить eSIM'), buying: false });
      return false;
    }
  },

  clearBuyError: () => set({ buyError: null }),
}));

// ── Selectors ──

export const selectIssueCards = (s: IssueStore) => s.cards;
export const selectIssueCardsLoading = (s: IssueStore) => s.cardsLoading;
export const selectIssueCardsError = (s: IssueStore) => s.cardsError;

export const selectEsims = (s: IssueStore) => s.esims;
export const selectEsimsLoading = (s: IssueStore) => s.esimsLoading;
export const selectEsimsError = (s: IssueStore) => s.esimsError;

export const selectBuying = (s: IssueStore) => s.buying;
export const selectBuyError = (s: IssueStore) => s.buyError;
