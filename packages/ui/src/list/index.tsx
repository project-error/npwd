import React from 'react';
import { cn } from '../utils';
import { Check } from 'lucide-react';

export interface ListProps {
  children: React.ReactNode;
  className?: string;
}

export interface ListItemProps extends React.HTMLAttributes<HTMLLIElement> {
  children?: React.ReactNode;
  primaryText?: React.ReactNode;
  secondaryText?: React.ReactNode;
  startElement?: React.ReactNode;
  endElement?: React.ReactNode;
  button?: boolean;
  selected?: boolean;
}

export const List: React.FC<ListProps> = ({ children, className }) => {
  return (
    <ul
      className={cn(
        'my-3 overflow-hidden rounded-[var(--keyos-radius-lg)] border border-[color:var(--keyos-border-muted)] bg-keyos-panel',
        className,
      )}
    >
      {children}
    </ul>
  );
};

export const ListItem = ({
  primaryText,
  secondaryText,
  startElement,
  endElement,
  button = false,
  selected = false,
  onClick,
  className,
  children,
  ...props
}: ListItemProps) => {
  return (
    <li
      className={cn('border-b border-[color:var(--keyos-border-subtle)] last:border-b-0', className)}
      onClick={button ? onClick : undefined}
      {...props}
    >
      <div
        className={cn(
          'relative flex min-h-[var(--keyos-list-item-min-height)] items-center gap-2.5 px-3 py-2.5 text-keyos-fg transition-colors duration-150',
          button && 'cursor-pointer hover:bg-[color:var(--keyos-hover)]',
          selected &&
            'border-l-4 border-[color:var(--keyos-app-accent)] bg-[color:var(--keyos-app-accent)]/10 text-[color:var(--keyos-app-accent)]',
          selected && button && 'hover:bg-[color:var(--keyos-app-accent)]/15',
        )}
      >
        {children ? (
          <>{children}</>
        ) : (
          <>
            {startElement && (
              <div className="flex-none text-[color:var(--keyos-app-accent)]">{startElement}</div>
            )}
            <div className="min-w-0 grow">
              {primaryText && (
                <p className="text-[length:var(--keyos-text-headline)] font-semibold tracking-wide text-current">
                  {primaryText}
                </p>
              )}
              {secondaryText && (
                <p className="mt-0.5 text-[length:var(--keyos-text-caption)] text-keyos-muted">
                  {secondaryText}
                </p>
              )}
            </div>
            {selected && (
              <div className="absolute inset-y-0 right-0 flex flex-none items-center pr-3 text-[color:var(--keyos-app-accent)]">
                <Check />
              </div>
            )}
            {endElement && <div className="flex flex-none shrink-0 items-center">{endElement}</div>}
          </>
        )}
      </div>
    </li>
  );
};
