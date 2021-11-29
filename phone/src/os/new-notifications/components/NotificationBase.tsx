import React, { forwardRef } from 'react';
import { Box } from '@mui/material';
import { SnackbarContent } from 'notistack';
import { IApp } from '../../apps/config/apps';
import { styled } from '@mui/styles';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';
import { useHistory } from 'react-router-dom';

const StyledMessage = styled('div')({
  color: 'white',
  fontSize: 16,
  textOverflow: 'ellipsis',
  display: '-webkit-box',
  overflow: 'hidden',
  boxOrient: 'vertical',
  lineClamp: 2,
});

interface NotificationBaseProps {
  app: IApp;
  message: string | React.ReactNode;
  timeReceived: Date;
  path?: string;
}

export const NotificationBase = forwardRef<HTMLDivElement, NotificationBaseProps>((props, ref) => {
  const { message, app, timeReceived, path } = props;
  const history = useHistory();
  const [t] = useTranslation();

  // Should eventually also mark as read/mark as inactive if clicked.
  const handleGoToApp = () => {
    if (!path) return;
    history.push(path);
  };

  return (
    <SnackbarContent
      id="notificationContainer"
      ref={ref}
      style={{ minWidth: '340px' }}
      onClick={handleGoToApp}
    >
      <Box display="flex" alignItems="center" color="white" width="100%" mb={0.7} fontSize={14}>
        <Box
          p="5px"
          borderRadius={30}
          bgcolor={app.backgroundColor}
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <app.NotificationIcon fontSize="inherit" />
        </Box>
        <Box color="#bfbfbf" fontWeight={400} paddingLeft={1} flexGrow={1} fontSize={16}>
          {t(app.nameLocale)}
        </Box>
        <Box color="#bfbfbf">{dayjs(timeReceived).fromNow()}</Box>
      </Box>
      <StyledMessage>{message}</StyledMessage>
    </SnackbarContent>
  );
});
