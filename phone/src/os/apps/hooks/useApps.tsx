import React, { useCallback, useMemo } from 'react';
import { useNotifications } from '../../notifications/hooks/useNotifications';
import { createLazyAppIcon } from '../utils/createLazyAppIcon';
import { APPS, IApp } from '../config/apps';
import { SvgIconComponent } from '@material-ui/icons';
import { useTheme } from '@material-ui/core';

const DEFAULT_ICONSET = 'default';

export const useApps = () => {
  const { icons } = useNotifications();
  const theme = useTheme();
  const iconset = DEFAULT_ICONSET;
  const apps: IApp[] = useMemo(
    () =>
      APPS.map((app) => {
        
        const SvgIcon = React.lazy<SvgIconComponent>(
          () => import(`${__dirname}/../icons/${iconset}/svg/${app.id}`),
        );
        const AppIcon = React.lazy<SvgIconComponent>(
          () => import(`${__dirname}/../icons/${iconset}/app/${app.id}`),
        );

        const NotificationIcon = createLazyAppIcon(SvgIcon);
        const Icon = createLazyAppIcon(AppIcon);

        return {
          ...app,
          notification: icons.find((i) => i.key === app.id),
          NotificationIcon,
          Icon,
          notificationIcon: (
            <NotificationIcon htmlColor={theme.palette.text.primary} fontSize="small" />
          ),
          icon: <Icon />,
        };
      }),
    [icons, iconset, theme],
  );
  const getApp = useCallback((id: string): IApp => apps.find((a) => a.id === id) || null, [apps]);
  return { apps, getApp };
};

export const useApp = (id: string): IApp => {
  const { getApp } = useApps();
  return getApp(id);
};
