import { create } from 'zustand';
import { getRefInfo as apiGetRefInfo } from '../services/api';
import type { RefInfoData } from '../services/api';
import { extractErrorMessage } from '../lib/error';
import { createStaleTracker } from '../lib/stale';

interface ReferralState {
  data: RefInfoData | null;
  isLoading: boolean;
  error: string | null;
}

interface ReferralActions {
  fetchRefInfo: () => Promise<void>;
}

type ReferralStore = ReferralState & ReferralActions;

const refStale = createStaleTracker();

export const useReferralStore = create<ReferralStore>()((set, get) => ({
  data: null,
  isLoading: false,
  error: null,

  fetchRefInfo: async () => {
    if (get().isLoading || refStale.isFresh()) return;
    set({ isLoading: true, error: null });

    try {
      const { ref_info } = await apiGetRefInfo();
      refStale.markFresh();
      set({ data: ref_info, isLoading: false });
    } catch (e) {
      set({ error: extractErrorMessage(e, 'Не удалось загрузить реферальные данные'), isLoading: false });
    }
  },
}));

export const selectRefData = (s: ReferralStore) => s.data;
export const selectRefLoading = (s: ReferralStore) => s.isLoading;
export const selectRefError = (s: ReferralStore) => s.error;
