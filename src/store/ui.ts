import { create } from 'zustand';

interface UiState {
  balanceVisible: boolean;
}

interface UiActions {
  toggleBalanceVisible: () => void;
}

type UiStore = UiState & UiActions;

export const useUiStore = create<UiStore>()((set) => ({
  balanceVisible: true,
  toggleBalanceVisible: () => set((s) => ({ balanceVisible: !s.balanceVisible })),
}));

export const selectBalanceVisible = (s: UiStore) => s.balanceVisible;
