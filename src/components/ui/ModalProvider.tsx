import { createContext, useContext, useCallback, useState, type ReactNode } from 'react';
import { Modal } from './Modal';

interface ModalConfig {
  icon?: ReactNode;
  title: string;
  description?: string;
  buttonText?: string;
  onButtonClick?: () => void;
  content?: ReactNode;
}

interface ModalContextValue {
  showModal: (config: ModalConfig) => void;
  closeModal: () => void;
}

const ModalContext = createContext<ModalContextValue | null>(null);

export function useModal() {
  const ctx = useContext(ModalContext);
  if (!ctx) throw new Error('useModal must be used within ModalProvider');
  return ctx;
}

export function ModalProvider({ children }: { children: ReactNode }) {
  const [config, setConfig] = useState<ModalConfig | null>(null);
  const [open, setOpen] = useState(false);

  const showModal = useCallback((cfg: ModalConfig) => {
    setConfig(cfg);
    setOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setOpen(false);
  }, []);

  return (
    <ModalContext value={{ showModal, closeModal }}>
      {children}
      {config && (
        <Modal
          open={open}
          onClose={closeModal}
          icon={config.icon}
          title={config.title}
          description={config.description}
          buttonText={config.buttonText}
          onButtonClick={config.onButtonClick}
        >
          {config.content}
        </Modal>
      )}
    </ModalContext>
  );
}
