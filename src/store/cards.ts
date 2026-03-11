import { create } from 'zustand';
import {
  getCards as apiGetCards,
  getCardInfo as apiGetCardInfo,
  makeCardFavourite as apiMakeCardFavourite,
  updateCardName as apiUpdateCardName,
} from '../services/api';
import type { ListCardItem, CardInfoItem, ApiError } from '../services/api';

// ── Types ──

interface CardsState {
  list: ListCardItem[];
  listLoading: boolean;
  listError: string | null;

  current: CardInfoItem | null;
  currentLoading: boolean;
  currentError: string | null;
}

interface CardsActions {
  fetchCards: () => Promise<void>;
  fetchCardInfo: (cardId: number) => Promise<void>;
  toggleFavourite: (cardId: number, isFavorite: boolean) => Promise<void>;
  renameCard: (cardId: number, name: string) => Promise<void>;
  clearCurrent: () => void;
}

type CardsStore = CardsState & CardsActions;

// ── Store ──

export const useCardsStore = create<CardsStore>()((set, get) => ({
  list: [],
  listLoading: false,
  listError: null,

  current: null,
  currentLoading: false,
  currentError: null,

  fetchCards: async () => {
    if (get().listLoading) return;
    set({ listLoading: true, listError: null });

    try {
      const { list_cards } = await apiGetCards();
      set({ list: list_cards, listLoading: false });
    } catch (e) {
      set({ listError: (e as ApiError).detail ?? 'Не удалось загрузить карты', listLoading: false });
    }
  },

  fetchCardInfo: async (cardId) => {
    set({ currentLoading: true, currentError: null });

    try {
      const { card_info } = await apiGetCardInfo({ card_id: cardId });
      set({ current: card_info, currentLoading: false });
    } catch (e) {
      set({ currentError: (e as ApiError).detail ?? 'Не удалось загрузить карту', currentLoading: false });
    }
  },

  toggleFavourite: async (cardId, isFavorite) => {
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
      await apiMakeCardFavourite({ card_id: cardId, is_favorite: isFavorite });
    } catch {
      set({ list: prevList, current: prevCurrent });
    }
  },

  renameCard: async (cardId, name) => {
    const prevCurrent = get().current;

    if (prevCurrent?.card_id === cardId) {
      set({ current: { ...prevCurrent, card_name: name } });
    }

    try {
      await apiUpdateCardName({ card_id: cardId, card_name: name });
    } catch {
      set({ current: prevCurrent });
    }
  },

  clearCurrent: () => set({ current: null, currentError: null }),
}));

// ── Selectors ──

export const selectCards = (s: CardsStore) => s.list;
export const selectCardsLoading = (s: CardsStore) => s.listLoading;
export const selectCardsError = (s: CardsStore) => s.listError;

export const selectCurrentCard = (s: CardsStore) => s.current;
export const selectCurrentCardLoading = (s: CardsStore) => s.currentLoading;
export const selectCurrentCardError = (s: CardsStore) => s.currentError;

export const selectFavouriteCards = (s: CardsStore) =>
  s.list.filter((c) => c.is_favorite);
