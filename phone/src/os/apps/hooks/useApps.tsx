import React, { useCallback, useMemo } from 'react';
import { useNotifications } from '@os/notifications/hooks/useNotifications';
import { createLazyAppIcon } from '../utils/createLazyAppIcon';
import { APPS, IApp } from '../config/apps';
import { QuestionMark, SvgIconComponent } from '@mui/icons-material';
import { useTheme } from '@mui/material';
import { useSettingsValue } from '../../../apps/settings/hooks/useSettings';
import { IconSetObject } from '@typings/settings';
import { INotificationIcon } from '@os/notifications/providers/NotificationsProvider';

const defaultIcon: INotificationIcon = {
  badge: 1,
  key: 'default',
  icon: <QuestionMark />,
};

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
      const notification = icons.find((i) => i.key === app.id) ?? defaultIcon;
      const isDisabled = app.disable ?? false;

      if (curIconSet.custom) {
        return {
          ...app,
          notification,
          NotificationIcon,
          Icon,
          notificationIcon: (
            <NotificationIcon htmlColor={theme.palette.text.primary} fontSize="small" />
          ),
          icon: <Icon />,
          isDisabled,
        };
      }

      return {
        ...app,
        notification,
        NotificationIcon,
        notificationIcon: <NotificationIcon htmlColor={app.color} fontSize="small" />,
        icon: <Icon />,
        isDisabled,
      };
    });
  }, [icons, curIconSet, theme]);

  const getApp = useCallback((id: string) => apps.find((a) => a.id === id) || null, [apps]);
  return { apps, getApp };
};

export const useApp = (id: string): IApp => {
  const { getApp, apps } = useApps();
  return getApp(id) ?? apps[0];
};
