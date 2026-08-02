import React from 'react';
import { Button } from '@npwd/keyos';
import { cn } from '@utils/css';

type StatusButtonStyleColor = 'success' | 'error' | 'warning' | 'info';

type StatusButtonVariant = 'contained' | 'outlined' | 'text';

const colorVariantMap: Record<StatusButtonStyleColor, React.ComponentProps<typeof Button>['variant']> = {
  error: 'danger',
  info: 'accent',
  success: 'success',
  warning: 'primary',
};

export interface StatusButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  color: StatusButtonStyleColor;
  variant?: StatusButtonVariant;
}

export const StatusButton: React.FC<StatusButtonProps> = ({
  color = 'info',
  variant = 'contained',
  className,
  ...props
}) => {
  const keyosVariant =
    variant === 'text' ? 'ghost' : variant === 'outlined' ? 'glass' : colorVariantMap[color];

  return <Button className={cn(className)} variant={keyosVariant} {...props} />;
};
