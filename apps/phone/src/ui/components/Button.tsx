import React from 'react';
import MaterialButton from '@mui/material/Button';
import { ButtonProps } from '@mui/material';
import { cva, VariantProps } from 'class-variance-authority';
import { twMerge } from 'tailwind-merge';

export const Button: React.FC<ButtonProps> = ({ ...props }) => (
  <MaterialButton aria-label="button" {...props}>
    {props.children}
  </MaterialButton>
);

const classes = cva('rounded-md w-full font-medium active:scale-95', {
  variants: {
    variant: {
      primary: ['dark:bg-blue-100 bg-blue-200 text-blue-800'],
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

export type NPWDButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof classes>;

export const NPWDButton: React.FC<NPWDButtonProps> = ({
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
