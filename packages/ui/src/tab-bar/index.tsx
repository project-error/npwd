import { cva, VariantProps } from 'class-variance-authority';
import React from 'react';

import { cn } from '../utils';

const tabBarVariants = cva(
  'flex w-full items-end justify-around border-t border-[color:var(--keyos-border-subtle)] bg-keyos-panel/95 px-1.5 pb-0.5 pt-1.5 backdrop-blur-xl',
  {
    variants: {
      size: {
        sm: 'min-h-[var(--keyos-nav-bar-height)]',
        md: 'min-h-[calc(var(--keyos-nav-bar-height)+4px)]',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  },
);

const tabItemVariants = cva(
  'flex min-w-0 flex-1 flex-col items-center justify-center gap-0 rounded-[var(--keyos-radius-pill)] px-2 py-1 text-[length:var(--keyos-text-micro)] font-medium transition-all duration-150',
  {
    variants: {
      active: {
        true: 'bg-[color:var(--keyos-app-accent,var(--keyos-panel-strong))]/20 text-[color:var(--keyos-app-accent,var(--keyos-fg))]',
        false: 'text-keyos-muted hover:text-keyos-fg',
      },
    },
    defaultVariants: {
      active: false,
    },
  },
);

export interface TabBarItem {
  label: React.ReactNode;
  value: string;
  icon?: React.ReactNode;
}

export interface TabBarProps
  extends Omit<React.HTMLAttributes<HTMLElement>, 'onChange'>,
    VariantProps<typeof tabBarVariants> {
  items: TabBarItem[];
  value: string;
  onChange?: (value: string) => void;
  renderItem?: (item: TabBarItem, active: boolean) => React.ReactNode;
}

export const TabBar: React.FC<TabBarProps> = ({
  items,
  value,
  onChange,
  renderItem,
  size,
  className,
  ...props
}) => {
  return (
    <nav className={cn(tabBarVariants({ size }), className)} {...props}>
      {items.map((item) => {
        const active = value === item.value;

        if (renderItem) {
          return (
            <div key={item.value} className="flex min-w-0 flex-1 justify-center">
              {renderItem(item, active)}
            </div>
          );
        }

        return (
          <button
            key={item.value}
            type="button"
            className={cn(tabItemVariants({ active }))}
            onClick={() => onChange?.(item.value)}
          >
            {item.icon && <span className="[&_svg]:size-4">{item.icon}</span>}
            <span className="truncate">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
