import React from 'react';
import { Search, X } from 'lucide-react';

import { cn } from '../utils';

export interface SearchBarProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  onClear?: () => void;
  containerClassName?: string;
}

export const SearchBar = React.forwardRef<HTMLInputElement, SearchBarProps>(
  ({ className, containerClassName, value, onClear, ...props }, ref) => {
    const hasValue = Boolean(value && String(value).length > 0);

    return (
      <div
        className={cn(
          'flex h-[var(--keyos-control-height)] items-center gap-1.5 rounded-[var(--keyos-radius-pill)] border border-[color:var(--keyos-border-subtle)] bg-[color:var(--keyos-surface-inset)] px-2.5',
          containerClassName,
        )}
      >
        <Search className="size-4 shrink-0 text-keyos-muted" aria-hidden />
        <input
          ref={ref}
          className={cn(
            'min-w-0 flex-1 bg-transparent text-[length:var(--keyos-text-body)] text-keyos-fg outline-none placeholder:text-keyos-muted',
            className,
          )}
          value={value}
          {...props}
        />
        {hasValue && onClear && (
          <button
            type="button"
            aria-label="Clear search"
            className="rounded-full p-0.5 text-keyos-muted hover:bg-[color:var(--keyos-hover)] hover:text-keyos-fg"
            onClick={onClear}
          >
            <X className="size-3.5" />
          </button>
        )}
      </div>
    );
  },
);

SearchBar.displayName = 'SearchBar';
