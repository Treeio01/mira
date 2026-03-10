import { useEffect, useRef, useState } from 'react';
import { useLocation, useOutlet } from 'react-router-dom';
import { useFixedLayerPhase } from './ui/FixedLayer';

export function PageTransition() {
  const location = useLocation();
  const outlet = useOutlet();
  const [current, setCurrent] = useState({ key: location.pathname, node: outlet as React.ReactNode });
  const [phase, setPhase] = useState<'visible' | 'exiting'>('visible');
  const pending = useRef<{ key: string; node: React.ReactNode } | null>(null);
  const setFixedPhase = useFixedLayerPhase();

  useEffect(() => {
    if (location.pathname === current.key) return;

    pending.current = { key: location.pathname, node: outlet };
    setPhase('exiting');
    setFixedPhase('exiting');
  }, [location.pathname, outlet, current.key, setFixedPhase]);

  const handleTransitionEnd = () => {
    if (phase === 'exiting' && pending.current) {
      setCurrent(pending.current);
      pending.current = null;
      setPhase('visible');
      setFixedPhase('visible');
    }
  };

  return (
    <div
      className="flex-1 flex flex-col"
      onTransitionEnd={handleTransitionEnd}
      style={{
        opacity: phase === 'exiting' ? 0 : 1,
        transform: phase === 'exiting' ? 'scale(0.98) translateY(8px)' : 'scale(1) translateY(0)',
        transition: phase === 'exiting'
          ? 'opacity 150ms ease-in, transform 150ms ease-in'
          : 'opacity 200ms ease-out, transform 200ms ease-out',
      }}
    >
      {current.node}
    </div>
  );
}
