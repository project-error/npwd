import React from 'react';

import { cn } from '../utils';

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  rounded?: 'sm' | 'md' | 'lg' | 'full';
}

const roundedClasses = {
  sm: 'rounded-[var(--keyos-radius-sm)]',
  md: 'rounded-[var(--keyos-radius-md)]',
  lg: 'rounded-[var(--keyos-radius-lg)]',
  full: 'rounded-full',
};

export const Skeleton: React.FC<SkeletonProps> = ({
  className,
  rounded = 'md',
  ...props
}) => (
  <div
    className={cn(
      'animate-pulse bg-[color:var(--keyos-surface-overlay)]',
      roundedClasses[rounded],
      className,
    )}
    aria-hidden
    {...props}
  />
);
