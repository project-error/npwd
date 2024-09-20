import { useContactPhoneNumber } from '@/api/hooks/useContactPhoneNumber';
import { useApp } from '@/contexts/AppsContext/useApp';
import { Notification } from '@/contexts/NotificationContext';
import { clsx } from 'clsx';
import { DateTime } from 'luxon';
import { ReactNode } from 'react';

interface NotificationContentProps {
  notification: Notification;
  extended?: boolean;
  className?: string;
  onClick?: () => void;
  Actions?: ReactNode;
}

export const NotificationContent = ({
  Actions,
  notification,
  className,
  onClick,
  extended = false,
}: NotificationContentProps) => {
  const contact = useContactPhoneNumber(notification.title);
  const { title, description, overline, created_at, appId = 'settings' } = notification;
  const app = useApp(appId);
  const AppIcon = app ? app.Icon : '📢';

  return (
    <div
      onClick={onClick}
      className={clsx(
        'flex p-3 items-center gap-3 rounded-lg relative outline outline-1 outline-secondary outline-offset-1',
        !extended ? 'dark:bg-gray-950 bg-primary shadow-xl' : 'backdrop-blur-md bg-opacity-10',
        className,
      )}
    >
      <span className="p-1 bg-secondary rounded-lg text-2xl w-10 h-10 flex flex-col items-center justify-center">
        {AppIcon}
      </span>
      <div className="flex flex-col overflow-hidden">
        {overline && (
          <span className="uppercase text-[10px] font-semibold line-clamp-3 tracking-wider">
            {overline}
          </span>
        )}
        <span
          className={clsx(
            'text-primary font-semibold text-sm',
            !extended && 'whitespace-pre overflow-ellipsis overflow-hidden',
          )}
        >
          {contact ? contact.name : title}
        </span>
        <span
          className={clsx(
            'text-secondary',
            !extended && 'whitespace-pre overflow-ellipsis overflow-hidden',
          )}
        >
          {description}
        </span>
      </div>

      {Actions ? (
        <div className="ml-auto">{Actions}</div>
      ) : (
        <span className="text-xs opacity-40 absolute top-0 right-0 m-3">
          {DateTime.fromISO(created_at).toFormat('t')}
        </span>
      )}
    </div>
  );
};
