import React, { forwardRef } from 'react';
import { Box, IconButton } from '@mui/material';
import { CustomContentProps, SnackbarContent } from 'notistack';
import { IApp } from '../../apps/config/apps';
import { styled } from '@mui/styles';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';
import { useHistory } from 'react-router-dom';
import { useNotifications } from '@os/new-notifications/hooks/useNotifications';
import CancelIcon from '@mui/icons-material/Clear';

const StyledMessage = styled('div')(({ theme }) => ({
  [theme.breakpoints.up('sm')]: {
    minWidth: '344px !important',
  },
  color: 'white',
  fontSize: 16,
  textOverflow: 'ellipsis',
  display: '-webkit-box',
  overflow: 'hidden',
  boxOrient: 'vertical',
  lineClamp: 2,
}));

export interface NotificationBaseProps extends CustomContentProps {
  key: string;
  app: IApp;
  uniqId: string;
  message: string;
  timeReceived: Date;
  path?: string;
}

export type NotificationBaseComponent = React.FC<NotificationBaseProps>;

const ExitButton: React.FC = () => {
  return (
    <IconButton size="small" sx={{ position: 'absolute' }}>
      <CancelIcon />
    </IconButton>
  );
};

const StyledSnackbar = styled(SnackbarContent)({
  padding: '14px 16px',
  display: 'flex',
  borderRadius: 15,
  backgroundColor: '#2e2e2e',
});

export const NotificationBase: NotificationBaseComponent = forwardRef<
  HTMLDivElement,
  NotificationBaseProps
>((props, ref) => {
  const { message, app, timeReceived, path, uniqId, key } = props;
  const history = useHistory();
  const [t] = useTranslation();
  const { markAsRead } = useNotifications();

  // Should eventually also mark as read/mark as inactive if clicked.
  const handleGoToApp = () => {
    if (!path) return;
    history.push(path);

    markAsRead(uniqId);
  };

  return (
    <StyledSnackbar key={key} id="notificationContainer" onClick={handleGoToApp} ref={ref}>
      <Box
        display="flex"
        alignItems="center"
        color="white"
        width="100%"
        mb={0.7}
        fontSize={14}
        component="div"
      >
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
    </StyledSnackbar>
  );
});
