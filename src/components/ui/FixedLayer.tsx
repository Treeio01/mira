import { createContext, useContext, useRef, useState, useEffect, type ReactNode } from 'react';
import { createPortal } from 'react-dom';

interface FixedLayerValue {
  target: HTMLDivElement | null;
  setPhase: (phase: 'visible' | 'exiting') => void;
}

const FixedLayerContext = createContext<FixedLayerValue>({
  target: null,
  setPhase: () => {},
});

export function FixedLayerProvider({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [target, setTarget] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    setTarget(ref.current);
  }, []);

  const setPhase = (phase: 'visible' | 'exiting') => {
    const els = document.querySelectorAll<HTMLElement>('[data-fixed]');
    els.forEach((el) => {
      el.style.opacity = phase === 'exiting' ? '0' : '1';
      el.style.transition = phase === 'exiting'
        ? 'opacity 150ms ease-in'
        : 'opacity 200ms ease-out';
    });
  };

  return (
    <FixedLayerContext.Provider value={{ target, setPhase }}>
      {children}
      <div ref={ref} id="fixed-layer" />
    </FixedLayerContext.Provider>
  );
}

export function useFixedLayerPhase() {
  const { setPhase } = useContext(FixedLayerContext);
  return setPhase;
}

export function Fixed({ children }: { children: ReactNode }) {
  const { target } = useContext(FixedLayerContext);
  if (!target) return null;
  return createPortal(children, target);
}
