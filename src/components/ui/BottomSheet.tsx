import { memo, useEffect, useState, useCallback, useRef, type ReactNode } from 'react';
import { createPortal } from 'react-dom';

interface BottomSheetProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  footer?: ReactNode;
  children: ReactNode;
}

export const BottomSheet = memo(function BottomSheet({
  open,
  onClose,
  title,
  footer,
  children,
}: BottomSheetProps) {
  const [phase, setPhase] = useState<'closed' | 'entering' | 'visible' | 'exiting'>('closed');
  const backdropRef = useRef<HTMLDivElement>(null);
  const [prevOpen, setPrevOpen] = useState(false);

  if (open !== prevOpen) {
    setPrevOpen(open);
    if (open && phase === 'closed') {
      setPhase('entering');
    } else if (!open && (phase === 'visible' || phase === 'entering')) {
      setPhase('exiting');
    }
  }

  useEffect(() => {
    if (phase === 'entering') {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setPhase('visible'));
      });
    }
  }, [phase]);

  const handleTransitionEnd = useCallback(() => {
    if (phase === 'exiting') setPhase('closed');
  }, [phase]);

  const handleBackdropClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === backdropRef.current) onClose();
    },
    [onClose],
  );

  useEffect(() => {
    if (phase !== 'visible') return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [phase, onClose]);

  if (phase === 'closed') return null;

  const isVisible = phase === 'visible';

  return createPortal(
    <div
      ref={backdropRef}
      onClick={handleBackdropClick}
      onTransitionEnd={handleTransitionEnd}
      className="fixed inset-0 z-50 flex items-end justify-center"
      style={{
        backgroundColor: isVisible ? 'rgba(0, 0, 0, 0.64)' : 'rgba(0, 0, 0, 0)',
        transition: 'background-color 200ms ease-out',
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="flex bg-surface rounded-t-[24px] border border-surface-border border-b-0 w-full max-w-[500px] flex-col max-h-[85vh]"
        style={{
          transform: isVisible ? 'translateY(0)' : 'translateY(100%)',
          transition: isVisible
            ? 'transform 300ms cubic-bezier(0.32, 0.72, 0, 1)'
            : 'transform 200ms ease-in',
        }}
      >
        {title && (
          <div className="flex items-center justify-between px-5 py-4 shrink-0">
            <span className="text-white font-semibold text-base leading-[140%] tracking-[-0.02em]">{title}</span>
            <button onClick={onClose} className="text-white/40 hover:text-white/60 transition-colors">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M15 5L5 15M5 5L15 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        )}
        <div className="flex-1 overflow-y-auto overscroll-contain">
          {children}
        </div>
        {footer && (
          <div className="shrink-0 border-t border-white/[0.04]">
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body,
  );
});
