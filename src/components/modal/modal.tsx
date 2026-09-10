import { CloseIcon } from '@krgaa/react-developer-burger-ui-components';
import { useEffect } from 'react';
import { createPortal } from 'react-dom';

import { ModalOverlay } from '@components/modal-overlay/modal-overlay';

import type { ReactNode } from 'react';

import styles from './modal.module.css';

const modalRoot = document.getElementById('cosmo-modals') ?? document.body;

type ModalProps = {
  header?: string;
  onClose: () => void;
  children: ReactNode;
};

export const Modal = ({ header, onClose, children }: ModalProps) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return (): void => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  return createPortal(
    <>
      <ModalOverlay onClose={onClose} />
      <div className={styles.modal}>
        <div className={styles.modal_header}>
          {header && <h3 className="text text_type_main-large">{header}</h3>}
          <button
            type="button"
            className={styles.modal_close_button}
            onClick={onClose}
            aria-label="Закрыть"
          >
            <CloseIcon type="primary" />
          </button>
        </div>
        <div className={styles.modal_content}>{children}</div>
      </div>
    </>,
    modalRoot
  );
};
