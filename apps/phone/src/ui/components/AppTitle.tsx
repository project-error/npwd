import React, { HTMLAttributes } from 'react';
import { useTranslation } from 'react-i18next';
import { AppHeader } from '@npwd/keyos';
import { IApp } from '@os/apps/config/apps';

interface AppTitleProps extends HTMLAttributes<HTMLElement> {
  app: IApp;
  variant?: 'h4' | 'h5' | 'h6';
}

export const AppTitle: React.FC<AppTitleProps> = ({
  app: { nameLocale },
  variant: _variant = 'h5',
  className,
  ...props
}) => {
  const [t] = useTranslation();
  return <AppHeader className={className} large title={t(nameLocale)} {...props} />;
};
