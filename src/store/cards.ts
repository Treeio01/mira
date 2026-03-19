import { create } from 'zustand';
import {
  getCards as apiGetCards,
  getCardInfo as apiGetCardInfo,
  makeFavorite as apiMakeFavorite,
  updateCardName as apiUpdateCardName,
} from '../services/api';
import type { ListCardItem, CardInfoItem } from '../services/api';
import { extractErrorMessage } from '../lib/error';
import { createStaleTracker } from '../lib/stale';
import { invalidateMenuCache } from './menu';

// ── Types ──

interface CardsState {
  list: ListCardItem[];
  listLoading: boolean;
  listError: string | null;

  current: CardInfoItem | null;
  currentLoading: boolean;
  currentError: string | null;

  /** @internal */ _cardInfoAbort: AbortController | null;
}

interface CardsActions {
  fetchCards: () => Promise<void>;
  fetchCardInfo: (cardId: number) => Promise<void>;
  toggleFavorite: (cardId: number, isFavorite: boolean) => Promise<void>;
  renameCard: (cardId: number, name: string) => Promise<void>;
  clearCurrent: () => void;
}

type CardsStore = CardsState & CardsActions;

// ── Helpers ──

let favoriteCache: { ref: ListCardItem[]; result: ListCardItem[] } = { ref: [], result: [] };
const cardsStale = createStaleTracker();

// ── Store ──

export const useCardsStore = create<CardsStore>()((set, get) => ({
  list: [],
  listLoading: false,
  listError: null,

  current: null,
  currentLoading: false,
  currentError: null,
  _cardInfoAbort: null,

  fetchCards: async () => {
    if (get().listLoading || cardsStale.isFresh()) return;
    set({ listLoading: true, listError: null });

    try {
      const { list_cards } = await apiGetCards();
      cardsStale.markFresh();
      set({ list: list_cards, listLoading: false });
    } catch (e) {
      set({ listError: extractErrorMessage(e, 'Не удалось загрузить карты'), listLoading: false });
    }
  },

  fetchCardInfo: async (cardId) => {
    get()._cardInfoAbort?.abort();
    const controller = new AbortController();
    set({ _cardInfoAbort: controller, currentLoading: true, currentError: null });

    try {
      const { card_info } = await apiGetCardInfo({ card_id: cardId }, controller.signal);
      if (!controller.signal.aborted) {
        set({ current: card_info, currentLoading: false });
      }
    } catch (e) {
      if (!controller.signal.aborted) {
        set({ currentError: extractErrorMessage(e, 'Не удалось загрузить карту'), currentLoading: false });
      }
    }
  },

  toggleFavorite: async (cardId, isFavorite) => {
    const prevList = get().list;
    const prevCurrent = get().current;

    // Optimistic update
    set({
      list: prevList.map((c) =>
        c.card_id === cardId ? { ...c, is_favorite: isFavorite } : c,
      ),
      current: prevCurrent?.card_id === cardId
        ? { ...prevCurrent, is_favorite: isFavorite }
        : prevCurrent,
    });

    try {
      await apiMakeFavorite({ card_id: cardId, is_favorite: isFavorite });
      invalidateMenuCache();
    } catch {
      set({ list: prevList, current: prevCurrent });
    }
  },

  renameCard: async (cardId, name) => {
    const prevCurrent = get().current;
    const prevList = get().list;

    // Optimistic update
    set({
      current: prevCurrent?.card_id === cardId
        ? { ...prevCurrent, card_name: name }
        : prevCurrent,
      list: prevList.map((c) =>
        c.card_id === cardId ? { ...c, card_name: name } : c,
      ),
    });

    try {
      await apiUpdateCardName({ card_id: cardId, card_name: name });
      invalidateMenuCache();
    } catch {
      set({ current: prevCurrent, list: prevList });
    }
  },

  clearCurrent: () => {
    get()._cardInfoAbort?.abort();
    set({ current: null, currentError: null, currentLoading: false, _cardInfoAbort: null });
  },
}));

// ── Selectors ──

export const selectCards = (s: CardsStore) => s.list;
export const selectCardsLoading = (s: CardsStore) => s.listLoading;
export const selectCardsError = (s: CardsStore) => s.listError;

export const selectCurrentCard = (s: CardsStore) => s.current;
export const selectCurrentCardLoading = (s: CardsStore) => s.currentLoading;
export const selectCurrentCardError = (s: CardsStore) => s.currentError;

/** Стабильная ссылка — не создаёт новый массив если list не изменился */
export const selectFavoriteCards = (s: CardsStore) => {
  if (favoriteCache.ref === s.list) return favoriteCache.result;
  const result = s.list.filter((c) => c.is_favorite);
  favoriteCache = { ref: s.list, result };
  return result;
};
