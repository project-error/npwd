import React from 'react';
import { Button } from '@npwd/keyos';
import { cn } from '@utils/css';

type StatusButtonStyleColor = 'success' | 'error' | 'warning' | 'info';

const colorClasses: Record<StatusButtonStyleColor, string> = {
  error: 'border-red-400/50 bg-red-500/90 text-white hover:bg-red-500',
  info: 'border-sky-400/50 bg-sky-500/90 text-white hover:bg-sky-500',
  success: 'border-emerald-400/50 bg-emerald-500/90 text-white hover:bg-emerald-500',
  warning: 'border-keyos-amber/50 bg-keyos-amber text-[color:var(--keyos-on-primary)] hover:bg-keyos-amber-soft',
};

export interface StatusIconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  color: StatusButtonStyleColor;
  size?: 'small' | 'medium' | 'large';
}

export const StatusIconButton = ({
  color = 'info',
  size,
  className,
  ...props
}: StatusIconButtonProps) => {
  return (
    <Button
      className={cn(
        colorClasses[color],
        size === 'small' && 'size-8',
        size === 'large' && 'size-12',
        className,
      )}
      size="icon"
      variant="primary"
      {...props}
    />
  );
};
