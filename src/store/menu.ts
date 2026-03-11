import { create } from 'zustand';
import { getMainMenu as apiGetMainMenu } from '../services/api';
import type { FavouriteCardItem, ApiError } from '../services/api';

// ── Types ──

interface MenuState {
  mainBalance: number;
  cardsBalance: number;
  favouriteCards: FavouriteCardItem[];
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
  favouriteCards: [],
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
        favouriteCards: data.favourite_cards,
        isLoading: false,
      });
    } catch (e) {
      set({ error: (e as ApiError).detail ?? 'Не удалось загрузить меню', isLoading: false });
    }
  },
}));

// ── Selectors ──

export const selectMainBalance = (s: MenuStore) => s.mainBalance;
export const selectCardsBalance = (s: MenuStore) => s.cardsBalance;
export const selectMenuFavourites = (s: MenuStore) => s.favouriteCards;
export const selectMenuLoading = (s: MenuStore) => s.isLoading;
export const selectMenuError = (s: MenuStore) => s.error;
