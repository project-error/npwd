import React from 'react';

import { cn } from '../utils';

export interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg';
}

const sizeClasses = {
  sm: 'size-4 border',
  md: 'size-8 border-2',
  lg: 'size-12 border-[3px]',
};

export const Spinner: React.FC<SpinnerProps> = ({ className, size = 'md', ...props }) => (
  <div
    className={cn(
      'animate-spin rounded-full border-keyos-muted/30 border-t-keyos-amber',
      sizeClasses[size],
      className,
    )}
    role="status"
    aria-label="Loading"
    {...props}
  />
);

export interface LoadingSpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  height?: React.CSSProperties['height'];
  size?: SpinnerProps['size'];
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  className,
  height = '100%',
  size = 'md',
  style,
  ...props
}) => (
  <div
    className={cn('flex items-center justify-center', className)}
    style={{ height, ...style }}
    {...props}
  >
    <Spinner size={size} />
  </div>
);
