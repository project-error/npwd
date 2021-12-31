import React from 'react';
import { ListItem, ListItemAvatar, ListItemText } from '@mui/material';
import { useApp } from '@os/apps/hooks/useApps';
import { useRecoilValue } from 'recoil';
import { storedNotificationsFamily } from '@os/new-notifications/state/notifications.state';
import { useNotifications } from '@os/new-notifications/hooks/useNotifications';
import { useHistory } from 'react-router-dom';

interface NotificationItemProps {
  uniqId: string;
  key: string | number;
}

export const NotificationItem: React.FC<NotificationItemProps> = ({ uniqId, key }) => {
  const { appId, message, path } = useRecoilValue(storedNotificationsFamily(uniqId));
  const { markAsRead } = useNotifications();
  const { icon } = useApp(appId);
  const history = useHistory();

  const handleOnClose = () => {
    markAsRead(uniqId);
    history.push(path);
  };

  return (
    <ListItem
      divider
      button
      onClick={handleOnClose}
      sx={{ pr: '28px', position: 'relative' }}
      key={key}
    >
      {icon && <ListItemAvatar>{icon}</ListItemAvatar>}
      <ListItemText secondary={message} />
    </ListItem>
  );
};
