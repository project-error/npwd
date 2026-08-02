import React from 'react';
import { cn } from '@utils/css';

const Backdrop: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, ...props }) => (
  <div className={cn('absolute inset-0 z-[5] bg-black/60', className)} {...props} />
);

export default Backdrop;
