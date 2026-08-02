import React from 'react';

import { cn } from '../utils';

export interface PageTransitionProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  animationKey?: string;
  variant?: 'home' | 'push' | 'fade';
}

export const PageTransition = React.forwardRef<HTMLDivElement, PageTransitionProps>(
  ({ children, animationKey, variant = 'push', className, ...props }, ref) => {
    const animationClass =
      variant === 'home' ? 'zoom-in-95' : variant === 'fade' ? '' : 'slide-in-from-right-3';

    return (
      <div
        ref={ref}
        key={animationKey}
        className={cn(
          'flex min-h-0 flex-1 flex-col animate-in fade-in-0 duration-200',
          animationClass,
          className,
        )}
        {...props}
      >
        {children}
      </div>
    );
  },
);

PageTransition.displayName = 'PageTransition';

export interface AppLaunchOverlayProps extends React.HTMLAttributes<HTMLDivElement> {
  visible?: boolean;
  icon?: React.ReactNode;
  backgroundColor?: string;
}

export const AppLaunchOverlay: React.FC<AppLaunchOverlayProps> = ({
  visible,
  icon,
  backgroundColor,
  className,
  ...props
}) => {
  if (!visible) return null;

  return (
    <div
      className={cn(
        'absolute inset-0 z-[200] flex animate-in fade-in-0 zoom-in-95 items-center justify-center duration-300',
        className,
      )}
      style={{ backgroundColor }}
      {...props}
    >
      <div className="animate-in zoom-in-50 duration-500">{icon}</div>
    </div>
  );
};
