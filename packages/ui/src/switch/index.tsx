import { Switch } from '@base-ui-components/react/switch';
import React from 'react';
import { cn } from '../utils';

export type SwitchRootProps = React.ComponentPropsWithoutRef<typeof Switch.Root>;
export type SwitchThumbProps = React.ComponentPropsWithoutRef<typeof Switch.Thumb>;

export const SwitchRoot = React.forwardRef<HTMLButtonElement, SwitchRootProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <Switch.Root
        ref={ref}
        className={cn(
          'keyos-surface-inset group relative inline-flex h-7 w-12 shrink-0 items-center rounded-full border border-[color:var(--keyos-border-muted)] outline-none transition duration-200',
          'bg-gradient-to-b from-keyos-panel-strong to-keyos-panel',
          'data-[checked]:keyos-surface-accent data-[checked]:border-[color:var(--keyos-app-accent)] data-[checked]:from-[color:var(--keyos-app-accent)] data-[checked]:to-[color:var(--keyos-app-accent)]/80',
          'focus-visible:ring-2 focus-visible:ring-[color:var(--keyos-app-accent)]/40',
          className,
        )}
        {...props}
      >
        {children ?? <SwitchThumb />}
      </Switch.Root>
    );
  },
);

SwitchRoot.displayName = 'SwitchRoot';

export const SwitchThumb = React.forwardRef<HTMLSpanElement, SwitchThumbProps>(
  ({ className, ...props }, ref) => {
    return (
      <Switch.Thumb
        ref={ref}
        className={cn(
          'keyos-surface-pop block size-5 translate-x-0.5 rounded-full border border-[color:var(--keyos-border-muted)] bg-gradient-to-b from-white to-keyos-cream transition-transform duration-200 will-change-transform',
          'group-data-[checked]:translate-x-[22px]',
          className,
        )}
        {...props}
      />
    );
  },
);

SwitchThumb.displayName = 'SwitchThumb';
