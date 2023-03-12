import { cva, VariantProps } from 'class-variance-authority';
import React from 'react';
import { twMerge } from 'tailwind-merge';

const classes = cva('rounded-md w-full', {
  variants: {
    variant: {
      primary: ['bg-blue-800 text-white'],
    },
    size: {
      sm: 'px-2 py-1.5 text-sm',
      md: 'px-2 py-2 text-base',
      lg: 'px-4 py-2',
    },
  },
  compoundVariants: [{ size: 'sm', variant: 'primary' }],
  defaultVariants: {
    size: 'md',
    variant: 'primary',
  },
});

export type ButtonProps2 = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof classes>;

export const NPWDButton: React.FC<ButtonProps2> = ({
  children,
  size,
  variant,
  className,
  ...props
}) => {
  return (
    <button {...props} className={twMerge(classes({ size, variant, className }))}>
      {children}
    </button>
  );
};
