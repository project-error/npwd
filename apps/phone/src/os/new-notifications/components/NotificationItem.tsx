import React from 'react';
import { ListItem, ListItemAvatar, ListItemText } from '@mui/material';
import { useApp } from '@os/apps/hooks/useApps';
import { useRecoilValue } from 'recoil';
import { notifications, useSetNavbarUncollapsed } from '@os/new-notifications/state';
import { useNotification } from '@os/new-notifications/useNotification';
import { useHistory } from 'react-router-dom';

interface NotificationItemProps {
  id: string;
  key: string | number;
}

export const NotificationItem: React.FC<NotificationItemProps> = ({ id, key }) => {
  const { appId, content, path } = useRecoilValue(notifications(id));
  const { markAsRead } = useNotification();
  const { icon } = useApp(appId);
  const history = useHistory();
  const closeBar = useSetNavbarUncollapsed();

  const handleOnClose = () => {
    markAsRead(id);
    closeBar(false); // set's to be to collapsed - wording is weird
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
      <ListItemText secondary={content} />
    </ListItem>
  );
};
