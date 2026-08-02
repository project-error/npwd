import { Dialog as BaseDialog } from '@base-ui-components/react/dialog';
import React from 'react';

import { cn } from '../utils';

export const ActionSheetRoot = BaseDialog.Root;
export const ActionSheetClose = BaseDialog.Close;

export interface ActionSheetProps {
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  title?: React.ReactNode;
  container?: HTMLElement | null;
}

export const ActionSheet: React.FC<ActionSheetProps> = ({
  children,
  open,
  onOpenChange,
  title,
  container,
}) => (
  <ActionSheetRoot open={open} onOpenChange={onOpenChange}>
    <BaseDialog.Portal container={container ?? undefined}>
      <BaseDialog.Backdrop
        className={cn(
          'absolute inset-0 z-40 bg-black/50 backdrop-blur-sm transition duration-200',
          'data-[starting-style]:opacity-0 data-[ending-style]:opacity-0',
        )}
      />
      <BaseDialog.Popup
        className={cn(
          'absolute inset-x-0 bottom-0 z-50 max-h-[70%] overflow-hidden rounded-t-[var(--keyos-radius-2xl)]',
          'border-t border-[color:var(--keyos-border-muted)] bg-keyos-panel text-keyos-cream shadow-keyos-panel backdrop-blur-xl',
          'transition duration-300 data-[starting-style]:translate-y-full data-[ending-style]:translate-y-full',
        )}
      >
        <div className="flex justify-center pt-2">
          <div className="h-1 w-10 rounded-full bg-[color:var(--keyos-border-muted)]" />
        </div>
        {title && (
          <div className="px-3 pb-1.5 pt-2">
            <p className="text-center text-[length:var(--keyos-text-caption)] font-medium text-keyos-muted">
              {title}
            </p>
          </div>
        )}
        <div className="overflow-y-auto pb-[var(--keyos-home-indicator-height)]">{children}</div>
      </BaseDialog.Popup>
    </BaseDialog.Portal>
  </ActionSheetRoot>
);

export interface ActionSheetItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  destructive?: boolean;
}

export const ActionSheetItem = React.forwardRef<HTMLButtonElement, ActionSheetItemProps>(
  ({ className, destructive, children, ...props }, ref) => (
    <button
      ref={ref}
      type="button"
      className={cn(
        'flex w-full items-center justify-center px-3 py-2.5 text-[length:var(--keyos-text-body)] font-medium transition-colors',
        'border-b border-[color:var(--keyos-border-subtle)] last:border-b-0 active:bg-[color:var(--keyos-hover)]',
        destructive ? 'text-red-400' : 'text-keyos-fg',
        className,
      )}
      {...props}
    >
      {children}
    </button>
  ),
);

ActionSheetItem.displayName = 'ActionSheetItem';
