import React from 'react';
import { cn } from '../utils';

export interface ListProps {
  children: React.ReactNode;
}

export interface ListItemProps {
  children?: React.ReactNode;
  primaryText?: React.ReactNode;
  secondaryText?: React.ReactNode;
  startElement?: React.ReactNode;
  endElement?: React.ReactNode;
}

export const List: React.FC<ListProps> = ({ children }) => {
  return (
    <ul className="my-4 divide-y divide-neutral-200 overflow-hidden rounded-xl dark:divide-neutral-700 dark:ring-1 dark:ring-gray-900/5">
      {children}
    </ul>
  );
};

export const ListItem = ({
  primaryText,
  secondaryText,
  startElement,
  endElement,
  children,
}: ListItemProps) => {
  return (
    <li className="dark:bg-neutral-900">
      <div
        className={cn(
          'relative flex items-center space-x-3 px-2 py-5',
          'hover:bg-neutral-200 dark:bg-neutral-800 hover:dark:bg-neutral-800/50',
        )}
      >
        {children ? (
          <>{children}</>
        ) : (
          <>
            {startElement && <div className="flex-shrink-0">{startElement}</div>}
            <div className="min-w-0 flex-1">
              {primaryText && (
                <p className="truncate text-sm font-medium text-neutral-900 dark:text-white">
                  {primaryText}
                </p>
              )}
              {secondaryText && (
                <p className="truncate text-sm text-neutral-500 dark:text-neutral-400">
                  {secondaryText}
                </p>
              )}
            </div>
            {endElement && <div className="flex-shrink-0">{endElement}</div>}
          </>
        )}
      </div>
    </li>
  );
};
