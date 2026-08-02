import React from 'react';
import { cn } from '@utils/css';

export interface ListItemProps extends React.LiHTMLAttributes<HTMLLIElement> {
  button?: boolean;
  divider?: boolean;
  selected?: boolean;
}

export const ListItem: React.FC<ListItemProps> = ({
  button,
  children,
  className,
  divider,
  selected,
  ...props
}) => (
  <li
    aria-label="list item"
    className={cn(
      'block',
      button && 'cursor-pointer transition-colors duration-150 hover:bg-white/[0.06]',
      divider && 'border-b border-white/10',
      selected && 'bg-keyos-amber/15 text-keyos-amber',
      className,
    )}
    {...props}
  >
    {children}
  </li>
);
