import React from 'react';
import { cn } from '@utils/css';

export interface LoadingSpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  height?: React.CSSProperties['height'];
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  className,
  height = '100%',
  style,
  ...props
}) => (
  <div
    className={cn('flex items-center justify-center', className)}
    style={{ height, ...style }}
    {...props}
  >
    <div className="size-8 animate-spin rounded-full border-2 border-keyos-muted/30 border-t-keyos-amber" />
  </div>
);
