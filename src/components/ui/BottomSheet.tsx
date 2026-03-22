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

  useEffect(() => {
    if (open && phase === 'closed') {
      setPhase('entering');
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setPhase('visible'));
      });
    } else if (!open && (phase === 'visible' || phase === 'entering')) {
      setPhase('exiting');
    }
  }, [open, phase]);

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
