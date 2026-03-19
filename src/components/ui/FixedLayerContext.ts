import { createContext, useContext } from 'react';

export interface FixedLayerValue {
  target: HTMLDivElement | null;
  setPhase: (phase: 'visible' | 'exiting') => void;
}

export const FixedLayerContext = createContext<FixedLayerValue>({
  target: null,
  setPhase: () => {},
});

export function useFixedLayerPhase() {
  const { setPhase } = useContext(FixedLayerContext);
  return setPhase;
}

export function useFixedLayerTarget() {
  const { target } = useContext(FixedLayerContext);
  return target;
}
