import React from 'react';
import { ListItem } from '@npwd/keyos';
import { useApp } from '@os/apps/hooks/useApps';
import { useNotificationValue, useSetNavbarUncollapsed } from '@os/new-notifications/state';
import { useNotification } from '@os/new-notifications/useNotification';
import { useNavigate } from 'react-router';

interface NotificationItemProps {
  id: string;
  key: string | number;
}

export const NotificationItem: React.FC<NotificationItemProps> = ({ id, key }) => {
  const { appId, content, path } = useNotificationValue(id);
  const { markAsRead } = useNotification();
  const { icon } = useApp(appId);
  const navigate = useNavigate();
  const closeBar = useSetNavbarUncollapsed();

  const handleOnClose = () => {
    markAsRead(id);
    closeBar(false);
    navigate(path);
  };

  return (
    <ListItem
      button
      className="relative pr-7"
      key={key}
      onClick={handleOnClose}
      secondaryText={content}
      startElement={icon}
    />
  );
};
