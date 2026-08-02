import { cva, VariantProps } from 'class-variance-authority';
import React from 'react';

import { cn } from '../utils';

const cardVariants = cva('keyos-card text-keyos-fg', {
  variants: {
    padding: {
      none: 'p-0',
      sm: 'p-2.5',
      md: 'p-3',
      lg: 'p-4',
    },
    interactive: {
      true: 'cursor-pointer transition-colors duration-150 hover:bg-keyos-panel-strong',
      false: '',
    },
  },
  defaultVariants: {
    padding: 'md',
    interactive: false,
  },
});

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, padding, interactive, ...props }, ref) => {
    return (
      <div ref={ref} className={cn(cardVariants({ padding, interactive }), className)} {...props} />
    );
  },
);

Card.displayName = 'Card';

export interface CardListProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const CardList: React.FC<CardListProps> = ({ children, className, ...props }) => {
  return (
    <div className={cn('flex flex-col gap-2', className)} {...props}>
      {children}
    </div>
  );
};
