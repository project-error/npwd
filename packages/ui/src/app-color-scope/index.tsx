import React from 'react';

import { cn } from '../utils';

export interface AppColorTokens {
  accent?: string;
  accentForeground?: string;
  danger?: string;
  dangerForeground?: string;
  muted?: string;
  surface?: string;
}

export interface AppColorScopeProps extends React.HTMLAttributes<HTMLDivElement> {
  colors: AppColorTokens;
}

export const AppColorScope: React.FC<AppColorScopeProps> = ({
  children,
  className,
  colors,
  style,
  ...props
}) => {
  return (
    <div
      className={cn('contents', className)}
      style={
        {
          '--keyos-app-accent': colors.accent,
          '--keyos-app-accent-foreground': colors.accentForeground,
          '--keyos-app-danger': colors.danger,
          '--keyos-app-danger-foreground': colors.dangerForeground,
          '--keyos-app-muted': colors.muted,
          '--keyos-app-surface': colors.surface,
          ...style,
        } as React.CSSProperties
      }
      {...props}
    >
      {children}
    </div>
  );
};
