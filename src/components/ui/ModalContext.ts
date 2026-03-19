import { createContext, useContext, type ReactNode } from 'react';

export interface ModalConfig {
  icon?: ReactNode;
  title: string;
  description?: string;
  buttonText?: string;
  onButtonClick?: () => void;
  content?: ReactNode;
}

export interface ModalContextValue {
  showModal: (config: ModalConfig) => void;
  closeModal: () => void;
}

export const ModalContext = createContext<ModalContextValue | null>(null);

export function useModal() {
  const ctx = useContext(ModalContext);
  if (!ctx) throw new Error('useModal must be used within ModalProvider');
  return ctx;
}
