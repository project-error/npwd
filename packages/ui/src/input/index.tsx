import { Input as BaseInput } from '@base-ui-components/react/input';
import { cva, VariantProps } from 'class-variance-authority';
import React from 'react';
import { cn } from '../utils';

export const inputVariants = cva(
  'w-full rounded-xl border border-[color:var(--keyos-border-subtle)] bg-[color:var(--keyos-surface-inset)] text-keyos-fg outline-none placeholder:text-keyos-muted transition duration-200 focus:border-keyos-amber/50 focus:ring-2 focus:ring-keyos-amber/20 disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      size: {
        sm: 'h-[var(--keyos-control-height-sm)] px-2.5 text-[length:var(--keyos-text-caption)]',
        md: 'h-[var(--keyos-control-height)] px-3 text-[length:var(--keyos-text-body)]',
        lg: 'h-[var(--keyos-control-height-lg)] px-3.5 text-[length:var(--keyos-text-headline)]',
      },
      variant: {
        primary: 'keyos-surface-inset',
        search:
          'keyos-shine-bg keyos-surface-panel rounded-full border-[color:var(--keyos-border-muted)] bg-keyos-panel/90 pl-10 backdrop-blur-xl',
      },
    },
    defaultVariants: {
      size: 'md',
      variant: 'primary',
    },
  },
);

export type InputProps = React.ComponentPropsWithoutRef<typeof BaseInput> &
  VariantProps<typeof inputVariants>;

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, size, variant, ...props }, ref) => {
    return (
      <BaseInput
        ref={ref}
        {...props}
        className={cn(inputVariants({ size, variant, className }))}
      />
    );
  },
);

Input.displayName = 'Input';
