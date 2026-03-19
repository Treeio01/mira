import { useCallback, useState, type ReactNode } from 'react';
import { Modal } from './Modal';
import { ModalContext, type ModalConfig } from './ModalContext';

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
