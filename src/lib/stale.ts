const DEFAULT_STALE_TIME = 30_000; // 30 секунд

export function createStaleTracker(staleTime = DEFAULT_STALE_TIME) {
  let lastFetchedAt = 0;

  return {
    markFresh: () => { lastFetchedAt = Date.now(); },
    isFresh: () => Date.now() - lastFetchedAt < staleTime,
    invalidate: () => { lastFetchedAt = 0; },
  };
}
