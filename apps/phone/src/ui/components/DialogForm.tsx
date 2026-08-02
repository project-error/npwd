import React from 'react';
import { Button } from '@npwd/keyos';
import { cn } from '@utils/css';

interface DialogFormProps {
  children: React.ReactNode;
  open: boolean;
  handleClose: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  onSubmit: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  title: string;
  content: string;
}

const DialogForm: React.FC<DialogFormProps> = ({
  children,
  open,
  handleClose,
  onSubmit,
  title,
  content,
}) => {
  if (!open) return null;

  return (
    <div className="absolute top-20 z-10 flex w-[90%] flex-col items-center justify-center pl-2.5">
      <div className="keyos-shine-bg keyos-surface-panel flex w-full flex-col rounded-2xl border border-[color:var(--keyos-border-subtle)] bg-keyos-panel p-4 text-keyos-cream shadow-keyos-pop">
        <h2 className="text-lg font-semibold text-keyos-fg" id="form-dialog-title">
          {title}
        </h2>
        <div className="mt-2 flex flex-col gap-3">
          <p className="text-sm text-keyos-muted">{content}</p>
          {children}
        </div>
        <div className={cn('mt-4 flex justify-end gap-2')}>
          <Button onClick={handleClose} variant="ghost">
            Cancel
          </Button>
          <Button onClick={onSubmit}>Confirm</Button>
        </div>
      </div>
    </div>
  );
};

export default DialogForm;
