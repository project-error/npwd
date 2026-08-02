import React from 'react';

import { cn } from '../utils';

export interface EmptyStateProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  icon?: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
  className,
  ...props
}) => (
  <div
    className={cn(
      'flex flex-col items-center justify-center px-4 py-8 text-center',
      className,
    )}
    {...props}
  >
    {icon && (
      <div className="mb-3 flex size-12 items-center justify-center rounded-full bg-[color:var(--keyos-surface-overlay)] text-keyos-muted [&_svg]:size-6">
        {icon}
      </div>
    )}
    <p className="text-[length:var(--keyos-text-headline)] font-semibold text-keyos-fg">{title}</p>
    {description && (
      <p className="mt-1.5 max-w-[260px] text-[length:var(--keyos-text-caption)] text-keyos-muted">
        {description}
      </p>
    )}
    {action && <div className="mt-4">{action}</div>}
  </div>
);
