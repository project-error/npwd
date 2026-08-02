import React from 'react';

import { cn } from '@utils/css';

const StyledMessage = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn(className)} {...props} />
  ),
);

StyledMessage.displayName = 'StyledMessage';

export const AudioMessage = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('flex w-full flex-col justify-start', className)}
      {...props}
    />
  ),
);

AudioMessage.displayName = 'AudioMessage';

export default StyledMessage;
