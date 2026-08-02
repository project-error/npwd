import React from 'react';
import { useTranslation } from 'react-i18next';
import { INotificationIcon } from '@os/notifications/providers/NotificationsProvider';
import { cn } from '@utils/css';

export interface AppIconProps {
  id: string;
  nameLocale: string;
  Icon?: React.ElementType;
  icon: React.ReactNode;
  backgroundColor: string;
  color: string;
  notification: INotificationIcon;
  size?: 'default' | 'dock';
}

export const AppIcon: React.FC<AppIconProps> = ({
  nameLocale,
  Icon,
  backgroundColor,
  color,
  icon,
  notification,
  size = 'default',
}) => {
  const [t] = useTranslation();
  const isDock = size === 'dock';
  const dimension = isDock ? 'size-[var(--keyos-icon-size-dock)]' : 'size-[var(--keyos-icon-size)]';
  const badgeCount = notification?.badge ?? 0;

  return (
    <div
      aria-label={t(nameLocale)}
      className={cn(
        'relative flex items-center justify-center rounded-[var(--keyos-radius-icon)] shadow-keyos-panel transition-transform duration-150 active:scale-95',
        dimension,
      )}
      style={{
        background: `linear-gradient(145deg, color-mix(in srgb, ${backgroundColor} 80%, black) 0%, ${backgroundColor} 100%)`,
        color,
      }}
    >
      {Icon ? (
        <Icon className="size-7" />
      ) : (
        <span className="text-lg font-semibold">{icon || t(nameLocale).slice(0, 1)}</span>
      )}
      {badgeCount >= 2 && (
        <span className="absolute -right-1 -top-1 flex size-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
          {badgeCount}
        </span>
      )}
    </div>
  );
};
