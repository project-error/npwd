import React from 'react';
import { cn } from '@utils/css';

export interface ListProps extends React.HTMLAttributes<HTMLUListElement> {
  disablePadding?: boolean;
}

export const List: React.FC<ListProps> = ({ children, className, disablePadding, ...props }) => (
  <ul
    aria-label="list"
    className={cn(!disablePadding && 'py-2', 'list-none', className)}
    {...props}
  >
    {children}
  </ul>
);
