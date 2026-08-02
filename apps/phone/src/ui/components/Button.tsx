import React from 'react';

import { cva, VariantProps } from 'class-variance-authority';

import { twMerge } from 'tailwind-merge';

import { Button as KeyOSButton, NPWDButton as KeyOSNPWDButton } from '@npwd/keyos';

import { cn } from '@utils/css';



export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {

  color?: 'primary' | 'secondary' | 'error' | 'inherit';

  endIcon?: React.ReactNode;

  fullWidth?: boolean;

  size?: 'small' | 'medium' | 'large';

  startIcon?: React.ReactNode;

  variant?: 'contained' | 'outlined' | 'text';

}



const variantMap = {

  contained: 'primary',

  outlined: 'glass',

  text: 'ghost',

} as const;



const sizeMap = {

  small: 'sm',

  medium: 'md',

  large: 'lg',

} as const;



export const Button: React.FC<ButtonProps> = ({

  children,

  className,

  color,

  endIcon,

  fullWidth,

  size = 'medium',

  startIcon,

  variant = 'contained',

  ...props

}) => {

  const keyosVariant = color === 'secondary' ? 'secondary' : color === 'error' ? 'danger' : variantMap[variant];



  return (

    <KeyOSButton

      aria-label="button"

      className={cn(fullWidth && 'w-full', className)}

      size={sizeMap[size]}

      variant={keyosVariant}

      {...props}

    >

      {startIcon}

      {children}

      {endIcon}

    </KeyOSButton>

  );

};



const classes = cva('rounded-md w-full active:scale-95', {

  variants: {

    variant: {

      primary: 'bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600',

      ghost: 'text-keyos-fg hover:bg-[color:var(--keyos-hover)]',

    },

    size: {

      sm: 'px-2 py-1.5 text-sm',

      md: 'px-2 py-2 text-base',

      lg: 'px-4 py-2',

    },

  },

  defaultVariants: {

    size: 'md',

    variant: 'primary',

  },

});



export type NPWDButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &

  VariantProps<typeof classes> & {

    size?: 'sm' | 'md' | 'lg' | 'icon';

    variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'glass' | 'accent' | 'success';

  };



export const NPWDButton: React.FC<NPWDButtonProps> = ({

  children,

  size,

  variant,

  className,

  ...props

}) => {

  if (variant && ['secondary', 'danger', 'ghost', 'glass', 'accent', 'success'].includes(variant)) {

    return (

      <KeyOSNPWDButton className={className} size={size} variant={variant} {...props}>

        {children}

      </KeyOSNPWDButton>

    );

  }



  return (

    <button {...props} className={twMerge(classes({ size: size === 'icon' ? 'md' : size, variant: variant ?? 'primary', className }))}>

      {children}

    </button>

  );

};

