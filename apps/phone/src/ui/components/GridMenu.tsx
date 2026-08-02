import React from 'react';
import { Link } from 'react-router';
import { useTranslation } from 'react-i18next';

import { AppIcon } from './AppIcon';
import { IApp } from '@os/apps/config/apps';
import { cn } from '@utils/css';

interface GridMenuProps {
  items: IApp[];
  Component?: React.ElementType;
  columns?: number;
  className?: string;
  showLabels?: boolean;
}

export const GridMenu: React.FC<GridMenuProps> = ({
  items,
  Component = AppIcon,
  columns = 4,
  className,
  showLabels = false,
}) => {
  const [t] = useTranslation();

  return (
    <div
      className={cn('grid w-full gap-x-2 gap-y-5', className)}
      style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
    >
      {items
        ?.filter((item) => !item.isDisabled)
        .map((item) => (
          <div key={item.id} className="flex flex-col items-center">
            <Link to={item.path} className="inline-flex flex-col items-center">
              <Component {...item} />
              {showLabels && (
                <span className="keyos-app-icon-label">{t(item.nameLocale)}</span>
              )}
            </Link>
          </div>
        ))}
    </div>
  );
};
