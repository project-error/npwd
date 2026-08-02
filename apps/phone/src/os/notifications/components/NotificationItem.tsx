import React from 'react';
import { Button, ListItem } from '@npwd/keyos';
import { X } from 'lucide-react';
import { INotification } from '../providers/NotificationsProvider';
import { useCurrentCallValue } from '@os/call/hooks/state';
import { cn } from '@utils/css';

export const NotificationItem = ({
  onClose,
  onClickClose,
  ...notification
}: INotification & {
  onClose: (e: React.MouseEvent) => void;
  onClickClose: (e: React.MouseEvent) => void;
}) => {
  const { title, icon, content, cantClose, onClick } = notification;
  const call = useCurrentCallValue();

  return (
    <ListItem
      button
      className={cn('relative', cantClose ? 'pr-2' : 'pr-7')}
      endElement={
        !cantClose ? (
          <Button
            aria-label="Close notification"
            className="absolute right-2 top-2"
            onClick={(e) => {
              e.stopPropagation();
              onClose(e);
            }}
            size="icon-sm"
            variant="ghost"
          >
            <X className="size-4" />
          </Button>
        ) : undefined
      }
      onClick={(e) => {
        if (onClick && !call) {
          onClick(notification);
          onClickClose(e);
        }
      }}
      primaryText={title}
      secondaryText={content}
      startElement={icon}
    />
  );
};
