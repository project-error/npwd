import { cva, VariantProps } from 'class-variance-authority';
import React from 'react';

import { cn } from '../utils';

const segmentedControlVariants = cva(
  'inline-flex w-full rounded-[var(--keyos-radius-pill)] border border-[color:var(--keyos-border-subtle)] bg-keyos-panel-strong p-1',
  {
    variants: {
      size: {
        sm: 'gap-0.5',
        md: 'gap-1',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  },
);

const segmentVariants = cva(
  'flex-1 rounded-[var(--keyos-radius-pill)] px-3 py-1.5 text-center text-[length:var(--keyos-text-caption)] font-semibold transition-all duration-150',
  {
    variants: {
      active: {
        true: 'bg-[color:var(--keyos-app-accent,var(--keyos-panel))] text-[color:var(--keyos-app-accent-foreground,var(--keyos-fg))] shadow-keyos-panel',
        false: 'text-keyos-muted hover:text-keyos-fg',
      },
    },
    defaultVariants: {
      active: false,
    },
  },
);

export interface SegmentedControlOption {
  label: React.ReactNode;
  value: string;
}

export interface SegmentedControlProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'>,
    VariantProps<typeof segmentedControlVariants> {
  options: SegmentedControlOption[];
  value: string;
  onChange: (value: string) => void;
}

export const SegmentedControl: React.FC<SegmentedControlProps> = ({
  options,
  value,
  onChange,
  size,
  className,
  ...props
}) => {
  return (
    <div className={cn(segmentedControlVariants({ size }), className)} role="tablist" {...props}>
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          role="tab"
          aria-selected={value === option.value}
          className={cn(segmentVariants({ active: value === option.value }))}
          onClick={() => onChange(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
};
