import React from 'react';

import { cn } from '../utils';

export interface DockProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const Dock: React.FC<DockProps> = ({ children, className, ...props }) => {
  return (
    <div
      className={cn(
        'flex h-[var(--keyos-dock-height)] items-center justify-around rounded-[var(--keyos-radius-dock)] px-3',
        'border border-[color:var(--keyos-frost-border)] bg-[color:var(--keyos-dock-bg)] backdrop-blur-xl',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export interface DockItemProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const DockItem: React.FC<DockItemProps> = ({ children, className, ...props }) => {
  return (
    <div
      className={cn(
        'flex size-[var(--keyos-icon-size-dock)] items-center justify-center rounded-[var(--keyos-radius-icon)] transition-transform duration-150 hover:scale-105 active:scale-95',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
};
