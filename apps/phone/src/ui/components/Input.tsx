import React, { forwardRef } from 'react';
import { Input as KeyOSInput, inputVariants } from '@npwd/keyos';
import { PhoneEvents } from '@typings/phone';
import fetchNui from '@utils/fetchNui';
import { cva, VariantProps } from 'class-variance-authority';
import { Search } from 'lucide-react';
import { cn } from '@utils/css';

export const toggleKeys = (keepGameFocus: boolean) =>
  fetchNui(
    PhoneEvents.TOGGLE_KEYS,
    {
      keepGameFocus,
    },
    {},
  );

const withInputFocusHandlers = <T extends React.HTMLAttributes<HTMLElement>>(props: T): T => ({
  ...props,
  onMouseUp: (e: React.MouseEvent<HTMLElement>) => {
    toggleKeys(false);
    props.onMouseUp?.(e as never);
  },
  onBlur: (e: React.FocusEvent<HTMLElement>) => {
    toggleKeys(true);
    props.onBlur?.(e as never);
  },
});

export interface TextFieldProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'color'> {
  error?: boolean;
  fullWidth?: boolean;
  helperText?: React.ReactNode;
  inputProps?: React.InputHTMLAttributes<HTMLInputElement> & {
    className?: string;
    style?: React.CSSProperties;
  };
  inputRef?: React.Ref<HTMLInputElement | HTMLTextAreaElement>;
  InputLabelProps?: { shrink?: boolean; className?: string };
  InputProps?: {
    className?: string;
    startAdornment?: React.ReactNode;
    endAdornment?: React.ReactNode;
  };
  label?: React.ReactNode;
  maxRows?: number;
  minRows?: number;
  multiline?: boolean;
  rows?: number;
  size?: 'small' | 'medium';
  variant?: 'standard' | 'outlined' | 'filled';
}

export const TextField = forwardRef<HTMLDivElement, TextFieldProps>(
  (
    {
      className,
      error,
      fullWidth,
      helperText,
      inputProps,
      inputRef,
      InputLabelProps,
      InputProps,
      label,
      maxRows,
      minRows,
      multiline,
      onBlur,
      onMouseUp,
      rows,
      size = 'medium',
      style,
      variant: _variant,
      ...props
    },
    ref,
  ) => {
    const inputSize = size === 'small' ? 'sm' : 'md';
    const fieldClassName = cn(
      inputVariants({ size: inputSize }),
      error && 'border-red-500/60 focus:border-red-500/60 focus:ring-red-500/20',
      fullWidth && 'w-full',
      inputProps?.className,
      InputProps?.className,
    );

    const sharedInputProps = withInputFocusHandlers({
      ...props,
      ...inputProps,
      className: fieldClassName,
      style: { ...inputProps?.style, ...(props.style as React.CSSProperties | undefined) },
      onBlur,
      onMouseUp,
    });

    return (
      <div
        ref={ref}
        className={cn('flex flex-col gap-1', fullWidth && 'w-full', className)}
        style={style}
      >
        {label && (
          <label
            className={cn(
              'text-sm font-medium text-keyos-fg',
              InputLabelProps?.shrink !== false && 'text-keyos-muted',
              InputLabelProps?.className,
            )}
          >
            {label}
          </label>
        )}
        <div className={cn('relative flex items-center', fullWidth && 'w-full')}>
          {InputProps?.startAdornment}
          {multiline ? (
            <textarea
              ref={inputRef as React.Ref<HTMLTextAreaElement>}
              rows={rows ?? minRows ?? 3}
              style={{ maxHeight: maxRows ? `${maxRows * 1.5}em` : undefined }}
              {...(sharedInputProps as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
            />
          ) : (
            <KeyOSInput
              ref={inputRef as React.Ref<HTMLInputElement>}
              size={inputSize}
              {...sharedInputProps}
            />
          )}
          {InputProps?.endAdornment}
        </div>
        {helperText && (
          <p className={cn('text-xs', error ? 'text-red-400' : 'text-keyos-muted')}>{helperText}</p>
        )}
      </div>
    );
  },
);

TextField.displayName = 'TextField';

export interface InputBaseProps extends React.InputHTMLAttributes<HTMLInputElement> {
  classes?: { focused?: string; input?: string; root?: string };
  fullWidth?: boolean;
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
  inputRef?: React.Ref<HTMLInputElement>;
}

export const InputBase = forwardRef<HTMLInputElement, InputBaseProps>(
  (
    {
      className,
      classes,
      fullWidth,
      inputProps,
      inputRef,
      onBlur,
      onFocus,
      onMouseUp,
      ...props
    },
    ref,
  ) => {
    const [focused, setFocused] = React.useState(false);

    return (
      <input
        ref={inputRef ?? ref}
        {...props}
        {...inputProps}
        className={cn(
          'bg-transparent text-keyos-fg outline-none',
          fullWidth && 'w-full',
          classes?.root,
          className,
          focused && classes?.focused,
          inputProps?.className,
          classes?.input,
        )}
        onBlur={(e) => {
          setFocused(false);
          toggleKeys(true);
          onBlur?.(e);
          inputProps?.onBlur?.(e);
        }}
        onFocus={(e) => {
          setFocused(true);
          onFocus?.(e);
          inputProps?.onFocus?.(e);
        }}
        onMouseUp={(e) => {
          toggleKeys(false);
          onMouseUp?.(e);
          inputProps?.onMouseUp?.(e);
        }}
      />
    );
  },
);

InputBase.displayName = 'InputBase';

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

export const textareaClasses = cva('rounded-md outline-none w-full', {
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

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> &
  VariantProps<typeof textareaClasses>;

export const NPWDInput: React.FC<InputProps> = ({ size, variant, className, ...props }) => {
  return (
    <input
      {...props}
      className={cn(classes({ size, variant, className }))}
      onMouseUp={(e) => {
        toggleKeys(false);
        props.onMouseUp?.(e);
      }}
      onBlur={(e) => {
        toggleKeys(true);
        props.onBlur?.(e);
      }}
    />
  );
};

export const NPWDTextarea: React.FC<TextareaProps> = ({ size, variant, className, ...props }) => {
  return (
    <textarea
      {...props}
      className={cn(textareaClasses({ size, variant, className }))}
      onMouseUp={(e) => {
        toggleKeys(false);
        props.onMouseUp?.(e);
      }}
      onBlur={(e) => {
        toggleKeys(true);
        props.onBlur?.(e);
      }}
    />
  );
};

export const NPWDSearchInput: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = ({
  ...props
}) => {
  return (
    <div className="flex items-center justify-start bg-neutral-200 dark:bg-neutral-800 rounded-md px-2 space-x-2 border dark:border-neutral-700">
      <Search className="h-5 w-5 dark:text-neutral-400" />
      <input
        {...props}
        className="w-full text-base dark:text-neutral-100 py-2 bg-transparent outline-none"
        onMouseUp={(e) => {
          toggleKeys(false);
          props.onMouseUp?.(e);
        }}
        onBlur={(e) => {
          toggleKeys(true);
          props.onBlur?.(e);
        }}
      />
    </div>
  );
};
