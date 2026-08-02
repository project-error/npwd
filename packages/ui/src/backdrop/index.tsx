import React from 'react';

import { cn } from '../utils';

export interface BackdropProps extends React.HTMLAttributes<HTMLDivElement> {
  open?: boolean;
  onClick?: () => void;
}

export const Backdrop: React.FC<BackdropProps> = ({
  open = false,
  onClick,
  className,
  ...props
}) => {
  if (!open) return null;

  return (
    <div
      className={cn(
        'absolute inset-0 z-40 bg-black/55 backdrop-blur-sm animate-in fade-in-0 duration-200',
        className,
      )}
      onClick={onClick}
      aria-hidden
      {...props}
    />
  );
};
