import { useLocation, useNavigate } from 'react-router-dom';
import { useRef, useEffect, useState, type CSSProperties } from 'react';
import { HomeIcon } from './icons/HomeIcon';
import { CardsIcon } from './icons/CardsIcon';
import { ROUTES } from '../lib/routes';

const tabs = [
  { path: ROUTES.HOME, label: 'Меню', Icon: HomeIcon },
  { path: ROUTES.CARDS, label: 'Карты', Icon: CardsIcon },
] as const;

export function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const [indicator, setIndicator] = useState<{ left: number; width: number } | null>(null);

  const activeIndex = tabs.findIndex((t) => t.path === location.pathname);
  const isTabPage = activeIndex !== -1;

  useEffect(() => {
    if (!containerRef.current || activeIndex === -1) return;
    const buttons = containerRef.current.querySelectorAll<HTMLButtonElement>('[data-tab]');
    const btn = buttons[activeIndex];
    if (!btn) return;
    setIndicator({ left: btn.offsetLeft, width: btn.offsetWidth });
  }, [activeIndex]);

  const indicatorStyle: CSSProperties = indicator
    ? {
        position: 'absolute',
        top: 6,
        left: indicator.left,
        width: indicator.width,
        height: 'calc(100% - 12px)',
        borderRadius: 9999,
        backgroundColor: '#661AFF',
        transition: 'left 0.3s cubic-bezier(0.4, 0, 0.2, 1), width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        zIndex: 0,
      }
    : { display: 'none' };

  if (!isTabPage) return null;

  return (
    <>
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full min-h-40.5 bg-linear-to-b from-black/0 to-black pointer-events-none" />
      <div
        ref={containerRef}
        className="fixed rounded-[56px] bg-[#15111F] p-1.5 gap-1.5 bottom-4 left-1/2 -translate-x-1/2 w-full max-w-[calc(100%-32px)] flex"
      >
        <div style={indicatorStyle} />
        {tabs.map((tab) => {
          const isActive = tab.path === location.pathname;
          return (
            <button
              key={tab.path}
              data-tab
              onClick={() => navigate(tab.path)}
              className="flex w-full p-3 justify-center gap-1.5 items-center rounded-full relative z-10"
            >
              <tab.Icon className={isActive ? 'text-white' : 'text-white/64'} />
              <span
                className={`text-sm font-medium tracking-[-0.02em] transition-colors duration-200 ${
                  isActive ? 'text-white' : 'text-white/64'
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </>
  );
}
