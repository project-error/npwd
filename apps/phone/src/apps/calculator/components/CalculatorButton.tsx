import React, { HTMLAttributes } from 'react';
import { Button } from '@ui/components/Button';
import { cn } from '@utils/css';

interface ButtonOptions {
  onClick: () => void;
  label: string;
}

interface CalculatorButtonProps extends HTMLAttributes<HTMLButtonElement> {
  colSpan?: 1 | 2 | 3;
  buttonOpts: ButtonOptions;
}

export const CalculatorButton: React.FC<CalculatorButtonProps> = ({
  className,
  buttonOpts,
  colSpan = 1,
}) => (
  <Button
    fullWidth
    className={cn('p-4 text-xl text-white', className)}
    onClick={buttonOpts.onClick}
    style={{ gridColumn: colSpan > 1 ? `span ${colSpan}` : undefined }}
  >
    {buttonOpts.label}
  </Button>
);
