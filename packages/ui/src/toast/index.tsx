import { cva, VariantProps } from 'class-variance-authority';
import React from 'react';
import { X } from 'lucide-react';

import { Button } from '../button';
import { cn } from '../utils';

const toastVariants = cva(
  'keyos-shine-bg keyos-surface-panel pointer-events-auto flex w-full max-w-[370px] items-start gap-2 rounded-[var(--keyos-radius-lg)] border px-3 py-2.5 shadow-keyos-pop backdrop-blur-xl animate-in slide-in-from-top-2 fade-in-0 duration-300',
  {
    variants: {
      variant: {
        default: 'border-[color:var(--keyos-border-muted)] bg-keyos-panel text-keyos-cream',
        success: 'border-emerald-500/30 bg-emerald-950/80 text-emerald-50',
        danger: 'border-red-500/30 bg-red-950/80 text-red-50',
        call: 'border-[color:var(--keyos-app-accent)]/30 bg-keyos-panel-strong text-keyos-cream',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

export interface ToastBannerProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'>,
    VariantProps<typeof toastVariants> {
  title?: React.ReactNode;
  icon?: React.ReactNode;
  onClose?: () => void;
  onClick?: () => void;
}

export const ToastBanner: React.FC<ToastBannerProps> = ({
  title,
  icon,
  onClose,
  onClick,
  variant,
  className,
  children,
  ...props
}) => (
  <div
    className={cn(toastVariants({ variant }), onClick && 'cursor-pointer', className)}
    onClick={onClick}
    role={onClick ? 'button' : undefined}
    {...props}
  >
    {icon && <div className="mt-0.5 shrink-0">{icon}</div>}
    <div className="min-w-0 flex-1">
      {title && (
        <p className="truncate text-[length:var(--keyos-text-headline)] font-semibold">{title}</p>
      )}
      {children && (
        <div className="line-clamp-2 text-[length:var(--keyos-text-caption)] opacity-90">
          {children}
        </div>
      )}
    </div>
    {onClose && (
      <Button
        aria-label="Dismiss"
        className="shrink-0"
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        size="icon-sm"
        variant="ghost"
      >
        <X className="size-4" />
      </Button>
    )}
  </div>
);

export interface ToastStackProps extends React.HTMLAttributes<HTMLDivElement> {
  position?: 'top' | 'bottom';
}

export const ToastStack: React.FC<ToastStackProps> = ({
  position = 'top',
  className,
  children,
  ...props
}) => (
  <div
    className={cn(
      'pointer-events-none absolute inset-x-0 z-50 flex flex-col items-center gap-2 px-4',
      position === 'top' ? 'top-2' : 'bottom-[calc(var(--keyos-home-indicator-height)+8px)]',
      className,
    )}
    {...props}
  >
    {children}
  </div>
);
