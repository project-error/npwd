import React, { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';

import { Button, Divider, List, ListItem, StatusBar } from '@npwd/keyos';
import { ChevronUp } from 'lucide-react';
import usePhoneTime from '../../phone/hooks/usePhoneTime';
import { NoNotificationText } from './NoNotificationText';
import {
  useNotificationValue,
  useNavbarUncollapsed,
  useUnreadNotificationIds,
  useUnreadNotifications,
} from '@os/new-notifications/state';
import { useApp } from '@os/apps/hooks/useApps';
import { UnreadNotificationBarProps } from '@typings/notifications';
import { useNotification } from '../useNotification';
import { cn } from '@utils/css';
import { usePlayer } from '@os/phone/hooks/usePlayer';

const IconUnreadBadge: React.FC<{ tgtNoti?: UnreadNotificationBarProps }> = ({ tgtNoti }) => {
  const notificationTgtApp = useApp(tgtNoti.appId);

  return (
    <span className="flex size-6 items-center justify-center rounded-full bg-[color:var(--keyos-surface-overlay)] text-keyos-fg">
      {notificationTgtApp.notificationIcon}
    </span>
  );
};

const UnreadNotificationListItem: React.FC<{ tgtNotiId: string }> = ({ tgtNotiId }) => {
  const { appId, content, path } = useNotificationValue(tgtNotiId);
  const { markAsRead } = useNotification();
  const { icon, nameLocale } = useApp(appId);
  const [t] = useTranslation();
  const navigate = useNavigate();
  const closeBar = useSetNavbarUncollapsed();

  const handleOnClose = () => {
    markAsRead(tgtNotiId);
    closeBar(false);
    navigate(path);
  };

  return (
    <ListItem
      button
      onClick={handleOnClose}
      primaryText={t(nameLocale)}
      secondaryText={content}
      startElement={icon}
    />
  );
};

export const NotificationBar = () => {
  const time = usePhoneTime();
  const playerSource = usePlayer();
  const [barCollapsed, setBarUncollapsed] = useNavbarUncollapsed();

  const unreadNotificationIds = useUnreadNotificationIds();
  const unreadNotifications = useUnreadNotifications();
  const { markAllAsRead } = useNotification();

  const handleClearNotis = async () => {
    setBarUncollapsed(false);
    await markAllAsRead();
  };

  useEffect(() => {
    if (unreadNotificationIds.length === 0) {
      setBarUncollapsed(false);
    }
  }, [unreadNotificationIds, setBarUncollapsed]);

  const uniqueNotificationApps =
    unreadNotifications?.filter(
      (val, idx, self) => idx === self.findIndex((t) => t.appId === val.appId),
    ) ?? [];

  return (
    <>
      <StatusBar
        onPress={() => setBarUncollapsed((curr) => !curr)}
        playerId={
          playerSource > 0 ? (
            <span className="text-[length:var(--keyos-text-caption)] font-medium text-keyos-muted">
              #{playerSource}
            </span>
          ) : undefined
        }
        notificationIcons={
          uniqueNotificationApps.length > 0 ? (
            <div className="flex items-center gap-1">
              {uniqueNotificationApps.map((notification, idx) => (
                <IconUnreadBadge tgtNoti={notification} key={idx} />
              ))}
            </div>
          ) : undefined
        }
        time={time}
      />

      {barCollapsed && (
        <div
          className={cn(
            'absolute inset-x-0 top-[var(--keyos-status-bar-height)] z-[98] max-h-[calc(100%-var(--keyos-status-bar-height)-var(--keyos-home-indicator-height))] overflow-hidden',
            'animate-in slide-in-from-top-2 fade-in-0 duration-200',
            'border-b border-[color:var(--keyos-border-subtle)] bg-keyos-panel/95 backdrop-blur-xl',
          )}
        >
          <div className="flex items-center justify-between px-4 py-2">
            <p className="text-[length:var(--keyos-text-headline)] font-semibold text-keyos-fg">
              Notifications
            </p>
            {unreadNotificationIds?.length !== 0 && (
              <Button onClick={handleClearNotis} size="sm" variant="ghost">
                Clear all
              </Button>
            )}
          </div>
          <Divider />
          <div className="keyos-hide-scrollbar max-h-[420px] overflow-y-auto px-2 pb-2">
            {unreadNotificationIds?.length ? (
              <List className="my-2 border-0 bg-transparent shadow-none">
                {unreadNotificationIds
                  .filter((val, idx, self) => idx === self.findIndex((t: string) => t === val))
                  .map((notification, idx) => (
                    <UnreadNotificationListItem key={idx} tgtNotiId={notification} />
                  ))}
              </List>
            ) : (
              <NoNotificationText />
            )}
          </div>
          <div className="flex justify-center pb-2">
            <Button
              aria-label="Collapse notifications"
              onClick={() => setBarUncollapsed(false)}
              size="icon-sm"
              variant="ghost"
            >
              <ChevronUp className="size-5" />
            </Button>
          </div>
        </div>
      )}
    </>
  );
};
