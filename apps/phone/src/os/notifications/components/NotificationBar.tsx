import React, { useEffect } from 'react';
import { Button, Divider, List } from '@npwd/keyos';
import { BatteryFull, ChevronUp, SignalMedium } from 'lucide-react';
import Default from '../../../config/default.json';
import { useNotifications } from '../hooks/useNotifications';
import { NotificationItem } from './NotificationItem';
import usePhoneTime from '../../phone/hooks/usePhoneTime';
import { NoNotificationText } from './NoNotificationText';
import { usePlayer } from '@os/phone/hooks/usePlayer';
import { usePhone } from '@os/phone/hooks/usePhone';
import { cn } from '@utils/css';

export const NotificationBar = () => {
  const { icons, notifications, removeNotification, barUncollapsed, setBarUncollapsed } =
    useNotifications();

  const time = usePhoneTime();
  const source = usePlayer();
  const { ResourceConfig } = usePhone();

  useEffect(() => {
    if (notifications.length === 0) {
      setBarUncollapsed(false);
    }
  }, [notifications, setBarUncollapsed]);

  if (!ResourceConfig) return null;
  const { showId } = ResourceConfig.general;

  return (
    <>
      <div
        className="relative z-[99] flex h-[30px] w-full cursor-pointer items-center justify-between px-[15px] text-keyos-fg"
        onClick={() => {
          setBarUncollapsed((curr) => !curr);
        }}
      >
        <div className="flex min-w-0 items-center">
          {icons.map((notifIcon) => (
            <div className="p-1 text-keyos-fg" key={notifIcon.key}>
              {notifIcon.icon}
            </div>
          ))}
        </div>
        {time && (
          <span className="mx-1.5 text-[length:var(--keyos-text-caption)] font-medium leading-[30px] text-keyos-fg">
            {time}
          </span>
        )}
        <div className="flex items-center justify-end">
          {showId && (
            <span className="mr-1 text-[length:var(--keyos-text-caption)] font-medium leading-[30px] text-keyos-fg">
              ID: {source}
            </span>
          )}
          <SignalMedium className="size-4" />
          <span className="mx-1.5 text-[length:var(--keyos-text-caption)] font-medium normal-case leading-[30px] text-keyos-fg">
            {Default.cellProvider}
          </span>
          <BatteryFull className="size-4 rotate-90" />
        </div>
      </div>

      {barUncollapsed && (
        <div
          className={cn(
            'absolute inset-x-0 top-[30px] z-[98] w-full bg-keyos-panel',
            'animate-in slide-in-from-top-2 fade-in-0 duration-200',
          )}
        >
          <div className="py-1">
            <List className="my-0 border-0 bg-transparent shadow-none">
              {notifications.map((notification, idx) => (
                <NotificationItem
                  key={idx}
                  {...notification}
                  onClose={(e) => {
                    e.stopPropagation();
                    notification.onClose?.(notification);
                    removeNotification(idx);
                  }}
                  onClickClose={() => {
                    setBarUncollapsed(false);
                    if (!notification.cantClose) {
                      removeNotification(idx);
                    }
                  }}
                />
              ))}
            </List>
          </div>
          <Divider />
          <div className="flex flex-col">
            {!notifications.length && <NoNotificationText />}
            <Button
              aria-label="Collapse notifications"
              className="mx-auto"
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
