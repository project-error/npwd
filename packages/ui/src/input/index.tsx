import { cva, cx, VariantProps } from 'class-variance-authority';
import { warn } from 'console';
import React from 'react';

export const classes = cva('rounded-md outline-none w-full', {
  variants: {
    size: {
      md: 'text-base py-2 px-2',
    },
    variant: {
      primary: 'bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-100',
    },
  },
  defaultVariants: {
    size: 'md',
    variant: 'primary',
  },
});

export type InputProps = React.InputHTMLAttributes<HTMLInputElement> & VariantProps<typeof classes>;

export const Input: React.FC<InputProps> = ({ className, ...props }) => {
  className = cx(classes(props), className);
  return <input {...props} className={className} />;
};
