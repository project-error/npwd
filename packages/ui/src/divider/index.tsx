import React from 'react';

import { cn } from '../utils';

export interface DividerProps extends React.HTMLAttributes<HTMLHRElement> {
  inset?: boolean;
}

export const Divider: React.FC<DividerProps> = ({ className, inset, ...props }) => (
  <hr
    className={cn(
      'border-0 border-t border-[color:var(--keyos-border-subtle)]',
      inset && 'mx-4',
      className,
    )}
    {...props}
  />
);
