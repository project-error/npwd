import { Dialog as BaseDialog } from '@base-ui-components/react/dialog';
import { X } from 'lucide-react';
import React from 'react';
import { Button } from '../button';
import { cn } from '../utils';

export const DialogRoot = BaseDialog.Root;
export const DialogTrigger = BaseDialog.Trigger;
export const DialogClose = BaseDialog.Close;
export const DialogTitle = BaseDialog.Title;
export const DialogDescription = BaseDialog.Description;

export type DialogPortalProps = React.ComponentPropsWithoutRef<typeof BaseDialog.Portal>;
export type DialogBackdropProps = React.ComponentPropsWithoutRef<typeof BaseDialog.Backdrop>;
export type DialogPopupProps = React.ComponentPropsWithoutRef<typeof BaseDialog.Popup>;

export const DialogPortal: React.FC<DialogPortalProps> = ({ children, ...props }) => {
  return <BaseDialog.Portal {...props}>{children}</BaseDialog.Portal>;
};

export const DialogBackdrop = React.forwardRef<HTMLDivElement, DialogBackdropProps>(
  ({ className, ...props }, ref) => {
    return (
      <BaseDialog.Backdrop
        ref={ref}
        className={cn(
          'absolute inset-0 z-40 bg-black/65 backdrop-blur-sm transition duration-200 data-[ending-style]:opacity-0 data-[starting-style]:opacity-0',
          className,
        )}
        {...props}
      />
    );
  },
);

DialogBackdrop.displayName = 'DialogBackdrop';

export const DialogPopup = React.forwardRef<HTMLDivElement, DialogPopupProps>(
  ({ className, ...props }, ref) => {
    return (
      <BaseDialog.Popup
        ref={ref}
        className={cn(
          'keyos-shine-bg keyos-surface-panel absolute left-1/2 top-1/2 z-50 max-h-[82%] w-[88%] max-w-[350px] -translate-x-1/2 -translate-y-1/2 overflow-auto rounded-[var(--keyos-radius-2xl)] border border-[color:var(--keyos-border-subtle)] bg-keyos-panel-strong p-4 text-keyos-cream outline-none backdrop-blur-xl',
          'transition duration-200 data-[ending-style]:scale-95 data-[ending-style]:opacity-0 data-[starting-style]:scale-95 data-[starting-style]:opacity-0',
          className,
        )}
        {...props}
      />
    );
  },
);

DialogPopup.displayName = 'DialogPopup';

export interface DialogPanelProps extends DialogPopupProps {
  showClose?: boolean;
}

export const DialogPanel = React.forwardRef<HTMLDivElement, DialogPanelProps>(
  ({ children, className, showClose = true, ...props }, ref) => {
    return (
      <DialogPopup ref={ref} className={className} {...props}>
        {showClose && (
          <DialogClose
            render={
              <Button
                aria-label="Close"
                className="absolute right-3 top-3"
                size="icon"
                variant="ghost"
              >
                <X size={18} />
              </Button>
            }
          />
        )}
        {children}
      </DialogPopup>
    );
  },
);

DialogPanel.displayName = 'DialogPanel';

export interface DialogProps {
  children: React.ReactNode;
  container?: HTMLElement | null;
  onOpenChange?: (open: boolean) => void;
  open?: boolean;
  showClose?: boolean;
}

export const Dialog: React.FC<DialogProps> = ({
  children,
  container,
  onOpenChange,
  open,
  showClose,
}) => {
  return (
    <DialogRoot open={open} onOpenChange={onOpenChange}>
      <DialogPortal container={container ?? undefined}>
        <DialogBackdrop />
        <DialogPanel showClose={showClose}>{children}</DialogPanel>
      </DialogPortal>
    </DialogRoot>
  );
};
