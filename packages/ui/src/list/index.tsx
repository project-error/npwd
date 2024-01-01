import React from 'react';
import { cn } from '../utils';
import { Check } from 'lucide-react';

export interface ListProps {
  children: React.ReactNode;
}

export interface ListItemProps extends React.HTMLAttributes<HTMLLIElement> {
  children?: React.ReactNode;
  primaryText?: React.ReactNode;
  secondaryText?: React.ReactNode
  startElement?: React.ReactNode;
  endElement?: React.ReactNode;
  button?: boolean;
  selected?: boolean;
}

export const List: React.FC<ListProps> = ({ children }) => {
  return (
    <ul className="my-4 divide-y divide-neutral-200 overflow-hidden rounded-xl dark:divide-neutral-700 dark:ring-1 dark:ring-gray-900/5 bg-white dark:bg-neutral-900">
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
  children,
}: ListItemProps) => {
  return (
    <li className="dark:bg-neutral-900" onClick={button ? onClick : undefined}>
      <div
        className={cn(
          'relative flex items-center space-x-3 px-2 py-5',
          'hover:bg-neutral-200/50 dark:bg-neutral-800 hover:dark:bg-neutral-800/50',
          selected && 'bg-neutral-200 dark:bg-neutral-700',
          button && 'cursor-pointer',
        )}
      >
        {children ? (
          <>{children}</>
        ) : (
          <>
            {startElement && <div className="flex-none dark:text-white text-neutral-900">{startElement}</div>}
            <div className="min-w-0 grow">
              {primaryText && (
                <p className="text-sm font-medium text-neutral-900 dark:text-white">
                  {primaryText}
                </p>
              )}
              {secondaryText && (
                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                  {secondaryText}
                </p>
              )}
            </div>
            {selected && (
              <div className="absolute inset-y-0 right-0 flex items-center pr-4 text-neutral-900 dark:text-neutral-50 flex-none">
                <Check />
              </div>
            )}
            {endElement && <div className="flex-none dark:text-white text-neutral-900">{endElement}</div>}
          </>
        )}
      </div>
    </li>
  );
};
