import { create } from 'zustand';
import { getMainMenu as apiGetMainMenu } from '../services/api';
import type { FavoriteCardItem } from '../services/api';
import { extractErrorMessage } from '../lib/error';
import { createStaleTracker } from '../lib/stale';

const menuStale = createStaleTracker();

export const invalidateMenuCache = () => menuStale.invalidate();

// ── Types ──

interface MenuState {
  mainBalance: number;
  cardsBalance: number;
  favoriteCards: FavoriteCardItem[];
  supportUrl: string;
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
  supportUrl: '',
  isLoading: false,
  error: null,

  fetchMenu: async () => {
    if (get().isLoading || menuStale.isFresh()) return;
    set({ isLoading: true, error: null });

    try {
      const data = await apiGetMainMenu();
      menuStale.markFresh();
      set({
        mainBalance: data.main_balance,
        cardsBalance: data.cards_balance,
        favoriteCards: data.favorite_cards ?? [],
        supportUrl: data.support_url ?? '',
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
export const selectSupportUrl = (s: MenuStore) => s.supportUrl;
export const selectMenuLoading = (s: MenuStore) => s.isLoading;
export const selectMenuError = (s: MenuStore) => s.error;
