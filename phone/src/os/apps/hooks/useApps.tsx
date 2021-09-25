import React, { useCallback, useMemo } from 'react';
import { useNotifications } from '../../notifications/hooks/useNotifications';
import { createLazyAppIcon } from '../utils/createLazyAppIcon';
import { APPS, IApp } from '../config/apps';
import { SvgIconComponent } from '@mui/icons-material';
import { useTheme } from '@mui/material';
import { useSettingsValue } from '../../../apps/settings/hooks/useSettings';

export interface IconSetObject {
  custom: boolean;
  name: string;
}

export const useApps = () => {
  const { icons } = useNotifications();
  const theme = useTheme();
  const curIconSet = useSettingsValue().iconSet.value as IconSetObject;

  const apps: IApp[] = useMemo(() => {
    return APPS.map((app) => {
      const SvgIcon = React.lazy<SvgIconComponent>(() =>
        import(`${__dirname}/../icons/${curIconSet.name}/svg/${app.id}`).catch(
          () => 'Was not able to find a dynamic import for icon from this icon set',
        ),
      );
      const AppIcon = React.lazy<SvgIconComponent>(() =>
        import(`${__dirname}/../icons/${curIconSet.name}/app/${app.id}`).catch(
          () => 'Was not able to find a dynamic import for icon from this icon set',
        ),
      );

      const NotificationIcon = createLazyAppIcon(SvgIcon);
      const Icon = createLazyAppIcon(AppIcon);

      if (curIconSet.custom) {
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
      }

      return {
        ...app,
        notification: icons.find((i) => i.key === app.id),
        NotificationIcon,
        notificationIcon: <NotificationIcon htmlColor={app.color} fontSize="small" />,
        icon: <Icon />,
      };
    });
  }, [icons, curIconSet, theme]);

  const getApp = useCallback((id: string): IApp => apps.find((a) => a.id === id) || null, [apps]);
  return { apps, getApp };
};

export const useApp = (id: string): IApp => {
  const { getApp } = useApps();
  return getApp(id);
};
