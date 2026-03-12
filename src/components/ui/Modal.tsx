import { memo, useEffect, useState, useCallback, useRef, type ReactNode } from 'react';
import { createPortal } from 'react-dom';

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  icon?: ReactNode;
  title: string;
  description?: string;
  buttonText?: string;
  onButtonClick?: () => void;
  children?: ReactNode;
}

export const Modal = memo(function Modal({
  open,
  onClose,
  icon,
  title,
  description,
  buttonText = 'Продолжить',
  onButtonClick,
  children,
}: ModalProps) {
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
    if (phase === 'exiting') {
      setPhase('closed');
    }
  }, [phase]);

  const handleBackdropClick = useCallback((e: React.MouseEvent) => {
    if (e.target === backdropRef.current) {
      onClose();
    }
  }, [onClose]);

  const handleButtonClick = useCallback(() => {
    if (onButtonClick) {
      onButtonClick();
    } else {
      onClose();
    }
  }, [onButtonClick, onClose]);

  if (phase === 'closed') return null;

  const isVisible = phase === 'visible';

  return createPortal(
    <div
      ref={backdropRef}
      onClick={handleBackdropClick}
      onTransitionEnd={handleTransitionEnd}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{
        backgroundColor: isVisible ? 'rgba(0, 0, 0, 0.64)' : 'rgba(0, 0, 0, 0)',
        transition: 'background-color 200ms ease-out',
      }}
    >
      <div
        className="flex bg-[#15111F] rounded-xl border border-[#1C1828] w-full max-w-[362px] p-5 flex-col items-center gap-4"
        style={{
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'scale(1) translateY(0)' : 'scale(0.95) translateY(12px)',
          transition: isVisible
            ? 'opacity 200ms ease-out, transform 200ms ease-out'
            : 'opacity 150ms ease-in, transform 150ms ease-in',
        }}
      >
        {icon && <div className="flex items-center justify-center">{icon}</div>}

        <div className="flex flex-col gap-1.5 items-center">
          <span className="text-white font-medium text-xl leading-[160%] tracking-[-0.02em]">
            {title}
          </span>
          {description && (
            <p className="text-center text-white/64 font-medium text-sm leading-[140%] tracking-[-0.02em]">
              {description}
            </p>
          )}
        </div>

        {children}

        <button
          onClick={handleButtonClick}
          className="p-3 w-full rounded-lg items-center justify-center bg-[#661AFF] active:scale-[0.97] transition-transform duration-150"
        >
          <span className="text-white font-medium leading-[140%] tracking-[-0.02em]">
            {buttonText}
          </span>
        </button>
      </div>
    </div>,
    document.body,
  );
});
