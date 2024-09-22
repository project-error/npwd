import { useDisableNavigation } from '@/contexts/NavigationContext';
import { clsx } from 'clsx';
import { forwardRef, InputHTMLAttributes, TextareaHTMLAttributes, useState } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  isDisabled?: boolean;
}
export const Input = forwardRef<HTMLInputElement, InputProps>(({ className, ...props }, ref) => {
  const [isFocused, setIsFocused] = useState(false);
  useDisableNavigation(isFocused);

  return (
    <input
      ref={ref}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      className={clsx('bg-secondary px-4 py-2 rounded-sm text-primary', className)}
      {...props}
    />
  );
});

interface TeaxtAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  isDisabled?: boolean;
}

export const TextArea = forwardRef<HTMLTextAreaElement, TeaxtAreaProps>(
  ({ className, ...props }, ref) => {
    const [isFocused, setIsFocused] = useState(false);
    useDisableNavigation(isFocused);

    return (
      <textarea
        ref={ref}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className={clsx('bg-secondary px-4 py-2 rounded-sm text-primary', className)}
        {...props}
      />
    );
  },
);
