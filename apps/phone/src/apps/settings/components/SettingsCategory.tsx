import React from 'react';
import { List } from '@npwd/keyos';

interface SettingsCategoryProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

export const SettingsCategory: React.FC<SettingsCategoryProps> = ({
  children,
  title,
  className,
}) => (
  <div className="px-4">
    <div>
      <p className="text-base font-medium text-neutral-900 dark:text-white">{title}</p>
    </div>
    <List className={className}>{children}</List>
  </div>
);
