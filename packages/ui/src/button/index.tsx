import { Button as BaseButton } from '@base-ui-components/react/button';
import { cva, VariantProps } from 'class-variance-authority';
import React from 'react';
import { cn } from '../utils';

export const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium tracking-wide text-keyos-fg outline-none transition-[background-color,border-color,color,transform] duration-150 active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-keyos-amber/50 disabled:pointer-events-none disabled:scale-100 disabled:opacity-45',
  {
    variants: {
      variant: {
        primary:
          'border border-keyos-amber/30 bg-keyos-amber text-[color:var(--keyos-on-primary)] hover:border-keyos-amber-soft/40 hover:bg-keyos-amber-soft',
        secondary:
          'border border-[color:var(--keyos-border-muted)] bg-keyos-panel-strong hover:border-[color:var(--keyos-border-subtle)] hover:bg-keyos-panel',
        accent:
          'border border-[color:var(--keyos-app-accent)]/30 bg-[color:var(--keyos-app-accent)] text-[color:var(--keyos-app-accent-foreground)] hover:opacity-90',
        success:
          'border border-emerald-500/30 bg-emerald-500 text-white hover:bg-emerald-400 hover:border-emerald-400/40',
        danger:
          'border border-red-500/30 bg-red-500 text-[color:var(--keyos-on-danger)] hover:bg-red-400 hover:border-red-400/40',
        ghost:
          'border border-transparent bg-transparent hover:border-[color:var(--keyos-border-subtle)] hover:bg-[color:var(--keyos-hover)]',
        glass:
          'border border-[color:var(--keyos-border-muted)] bg-keyos-panel hover:border-[color:var(--keyos-border-subtle)] hover:bg-keyos-panel-strong',
      },
      size: {
        sm: 'h-[var(--keyos-control-height-sm)] rounded-lg px-2.5 text-xs',
        md: 'h-[var(--keyos-control-height)] rounded-[var(--keyos-radius-md)] px-3.5 text-[length:var(--keyos-text-body)]',
        lg: 'h-[var(--keyos-control-height-lg)] rounded-[var(--keyos-radius-md)] px-4 text-[length:var(--keyos-text-headline)]',
        icon: 'size-[var(--keyos-control-height)] rounded-full p-0 [&_svg]:size-4',
        'icon-sm': 'size-[var(--keyos-control-height-sm)] rounded-full p-0 [&_svg]:size-3.5',
      },
    },
    defaultVariants: {
      size: 'md',
      variant: 'primary',
    },
  },
);

export type ButtonProps = React.ComponentPropsWithoutRef<typeof BaseButton> &
  VariantProps<typeof buttonVariants>;

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, size, variant, className, ...props }, ref) => {
    return (
      <BaseButton
        ref={ref}
        {...props}
        className={cn(buttonVariants({ size, variant, className }))}
      >
        {children}
      </BaseButton>
    );
  },
);

Button.displayName = 'Button';

export const NPWDButton: React.FC<ButtonProps> = ({
  children,
  size,
  variant,
  className,
  ...props
}) => {
  return (
    <Button {...props} className={className} size={size} variant={variant}>
      {children}
    </Button>
  );
};
