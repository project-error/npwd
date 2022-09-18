import { styled, Box, Typography } from '@mui/material';
import { useApps } from '@os/apps/hooks/useApps';
import { CustomContentProps, SnackbarContent, useSnackbar } from 'notistack';
import { forwardRef } from 'react';
import { useTranslation } from 'react-i18next';

interface SystemNotificationBaseProps extends CustomContentProps {
  secondaryTitle?: string;
}

const StyledSnackbar = styled(SnackbarContent)(({ theme }) => ({
  padding: '14px 16px',
  display: 'flex',
  background: theme.palette.background.paper,
  borderRadius: '12px !important',
  boxShadow: 'rgba(0, 0, 0, 0.35) 0px 5px 15px',
}));

const StyledMessage = styled('div')({
  color: 'white',
  fontSize: 16,
  textOverflow: 'ellipsis',
  display: '-webkit-box',
  overflow: 'hidden',
  boxOrient: 'vertical',
  lineClamp: 2,
});

export type SystemNotificationBaseComponent = React.FC<SystemNotificationBaseProps>;

export const SystemNotificationBase = forwardRef<HTMLDivElement, SystemNotificationBaseProps>(
  (props, ref) => {
    const { secondaryTitle, message } = props;
    const { closeSnackbar } = useSnackbar();
    const { getApp } = useApps();
    const app = getApp('SETTINGS');
    const [t] = useTranslation();

    const handleCloseNoti = () => {
      closeSnackbar(props.id);
    };

    return (
      <StyledSnackbar onClick={handleCloseNoti} style={{ minWidth: '370px' }} ref={ref}>
        <Box display="flex" alignItems="center" color="white" width="100%" mb={0.7}>
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
            {t('APPS_SYSTEM')}
          </Box>
          <Box>
            <Typography color="#bfbfbf">{secondaryTitle}</Typography>
          </Box>
        </Box>
        <StyledMessage>{message}</StyledMessage>
      </StyledSnackbar>
    );
  },
);
