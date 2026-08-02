import React from 'react';
import { ChevronLeft } from 'lucide-react';

import { Button } from '../button';
import { cn } from '../utils';

export interface AppHeaderProps extends Omit<React.HTMLAttributes<HTMLElement>, 'title'> {
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  onBack?: () => void;
  backLabel?: string;
  trailing?: React.ReactNode;
  large?: boolean;
  transparent?: boolean;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  title,
  subtitle,
  onBack,
  backLabel = 'Back',
  trailing,
  large = false,
  transparent = false,
  className,
  ...props
}) => (
  <header
    className={cn(
      'sticky top-0 z-20 shrink-0 px-[var(--keyos-safe-x)]',
      transparent
        ? 'bg-transparent'
        : 'border-b border-[color:var(--keyos-border-subtle)] bg-keyos-night/90 backdrop-blur-xl',
      className,
    )}
    {...props}
  >
    <div className="flex h-[var(--keyos-control-height-lg)] items-center justify-between gap-1.5">
      <div className="flex min-w-0 flex-1 items-center gap-1">
        {onBack && (
          <Button
            aria-label={backLabel}
            className="-ml-2 text-[color:var(--keyos-app-accent,var(--keyos-amber))]"
            onClick={onBack}
            size="icon-sm"
            variant="ghost"
          >
            <ChevronLeft className="size-5" />
          </Button>
        )}
        {!large && title && (
          <h1 className="truncate text-[length:var(--keyos-text-headline)] font-semibold text-keyos-fg">
            {title}
          </h1>
        )}
      </div>
      {trailing && <div className="flex shrink-0 items-center gap-1">{trailing}</div>}
    </div>
    {large && title && (
      <div className="pb-2 pt-0.5">
        <h1 className="text-[length:var(--keyos-text-title)] font-bold tracking-tight text-keyos-fg">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-0.5 text-[length:var(--keyos-text-caption)] text-keyos-muted">{subtitle}</p>
        )}
      </div>
    )}
  </header>
);
