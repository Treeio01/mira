import { create } from 'zustand';
import { getMainMenu as apiGetMainMenu } from '../services/api';
import type { FavoriteCardItem } from '../services/api';
import { extractErrorMessage } from '../lib/error';

// ── Types ──

interface MenuState {
  mainBalance: number;
  cardsBalance: number;
  favoriteCards: FavoriteCardItem[];
  isLoading: boolean;
  error: string | null;
}

interface MenuActions {
  fetchMenu: () => Promise<void>;
}

type MenuStore = MenuState & MenuActions;

// ── Store ──

export const useMenuStore = create<MenuStore>()((set, get) => ({
  mainBalance: 0,
  cardsBalance: 0,
  favoriteCards: [],
  isLoading: false,
  error: null,

  fetchMenu: async () => {
    if (get().isLoading) return;
    set({ isLoading: true, error: null });

    try {
      const data = await apiGetMainMenu();
      set({
        mainBalance: data.main_balance,
        cardsBalance: data.cards_balance,
        favoriteCards: data.favorite_cards ?? data.favourite_cards ?? [],
        isLoading: false,
      });
    } catch (e) {
      set({ error: extractErrorMessage(e, 'Не удалось загрузить данные'), isLoading: false });
    }
  },
}));

// ── Selectors ──

export const selectMainBalance = (s: MenuStore) => s.mainBalance;
export const selectCardsBalance = (s: MenuStore) => s.cardsBalance;
export const selectMenuFavorites = (s: MenuStore) => s.favoriteCards;
export const selectMenuLoading = (s: MenuStore) => s.isLoading;
export const selectMenuError = (s: MenuStore) => s.error;
