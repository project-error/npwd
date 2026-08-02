import { cva, VariantProps } from 'class-variance-authority';
import React from 'react';

import { cn } from '../utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-[var(--keyos-radius-pill)] px-2.5 py-0.5 text-[length:var(--keyos-text-micro)] font-semibold uppercase tracking-wide',
  {
    variants: {
      variant: {
        default: 'bg-keyos-panel-strong text-keyos-muted',
        accent:
          'bg-[color:var(--keyos-app-accent)]/15 text-[color:var(--keyos-app-accent,var(--keyos-fg))]',
        success: 'bg-emerald-500/15 text-emerald-400',
        danger: 'bg-red-500/15 text-red-400',
        warning: 'bg-amber-500/15 text-amber-400',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export const Badge: React.FC<BadgeProps> = ({ className, variant, ...props }) => {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
};
