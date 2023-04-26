import React, { forwardRef } from 'react';
import MUITextField, { TextFieldProps } from '@mui/material/TextField';
import MUIInputBase, { InputBaseProps } from '@mui/material/InputBase';
import { PhoneEvents } from '@typings/phone';
import fetchNui from '@utils/fetchNui';
import { cva, VariantProps } from 'class-variance-authority';
import { twMerge } from 'tailwind-merge';

export const toggleKeys = (keepGameFocus: boolean) =>
  fetchNui(
    PhoneEvents.TOGGLE_KEYS,
    {
      keepGameFocus,
    },
    {},
  );

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>((props, ref) => (
  <MUITextField
    ref={ref}
    {...props}
    variant={props.variant ?? 'standard'}
    onMouseUp={(e) => {
      toggleKeys(false);
      if (props.onMouseUp) {
        props.onMouseUp(e);
      }
    }}
    onBlur={(e) => {
      toggleKeys(true);
      if (props.onBlur) {
        props.onBlur(e);
      }
    }}
  />
));

export const InputBase: React.FC<InputBaseProps> = forwardRef((props, ref) => (
  <MUIInputBase
    ref={ref}
    {...props}
    onMouseUp={(e) => {
      toggleKeys(false);
      if (props.onMouseUp) {
        props.onMouseUp(e);
      }
    }}
    onBlur={(e) => {
      toggleKeys(true);
      if (props.onBlur) {
        props.onBlur(e);
      }
    }}
  />
));

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

export const NPWDInput: React.FC<InputProps> = ({ size, variant, className, ...props }) => {
  return <input {...props} className={twMerge(classes({ size, variant, className }))} />;
};
