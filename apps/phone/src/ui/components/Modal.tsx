import React from 'react';
import { Dialog, DialogBackdrop, DialogPanel, DialogPortal, DialogRoot } from '@npwd/keyos';

interface ModalProps {
  children: React.ReactNode;
  visible?: boolean;
  handleClose?: () => void;
}

export const Modal: React.FC<ModalProps> = ({ children, visible, handleClose }) => {
  return (
    <DialogRoot open={visible} onOpenChange={(open) => !open && handleClose?.()}>
      <DialogPortal container={document.getElementById('phone') ?? undefined}>
        <DialogBackdrop />
        <DialogPanel className="top-[45%] w-[90%]">{children}</DialogPanel>
      </DialogPortal>
    </DialogRoot>
  );
};

export const Modal2: React.FC<ModalProps> = ({ children, visible, handleClose }) => {
  return (
    <Dialog
      container={document.getElementById('phone')}
      onOpenChange={(open) => !open && handleClose?.()}
      open={visible}
    >
      {children}
    </Dialog>
  );
};

export default Modal;
