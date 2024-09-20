import { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  isDisabled?: boolean;
}
export const Input = (props: InputProps) => {
  return <input className="bg-secondary px-4 py-2 rounded-sm text-primary" {...props} />;
};
