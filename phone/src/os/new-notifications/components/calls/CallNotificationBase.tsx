import styled from '@emotion/styled';
import CallEnd from '@mui/icons-material/CallEnd';
import Call from '@mui/icons-material/Call';
import { Box, IconButton, Typography } from '@mui/material';
import { useApps } from '@os/apps/hooks/useApps';
import { green, red } from '@mui/material/colors';
import { SnackbarContent, CustomContentProps } from 'notistack';
import React, { forwardRef, useState } from 'react';
import useTimer from '@os/call/hooks/useTimer';

const StyledSnackbar = styled(SnackbarContent)({
  padding: '14px 16px',
  display: 'flex',
  background: 'rgba(38,38,38,0.85) !important',
  borderRadius: '12px !important',
  boxShadow: 'rgba(0, 0, 0, 0.35) 0px 5px 15px',
  backdropFilter: 'blur(4px)',
});

interface CallNotificationBaseProps extends CustomContentProps {
  title: string;
  transmitter: string;
  onAccept: () => void;
  onEnd: () => void;
}

export type CallNotificationBaseComponent = React.FC<CallNotificationBaseProps>;

const formatTime = (time: number) => (time < 10 ? `0${time}` : time);

export const CallNotificationBase = forwardRef<HTMLDivElement, CallNotificationBaseProps>(
  (props, ref) => {
    const { title, transmitter, onAccept, onEnd } = props;
    const { getApp } = useApps();
    const app = getApp('DIALER');
    const [showControls, setShowControls] = useState(true);
    const { hours, minutes, seconds } = useTimer();

    return (
      <StyledSnackbar ref={ref} style={{ minWidth: '370px' }}>
        <Box display="flex" alignItems="center" color="white" width="100%" mb={0.7}>
          <Box
            p="5px"
            borderRadius={30}
            bgcolor={app.backgroundColor}
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            <app.NotificationIcon sx={{ fontSize: 10 }} />
          </Box>
          <Box color="#bfbfbf" paddingLeft={1} flexGrow={1}>
            {showControls ? (
              <Typography fontWeight={400}>Incoming Call</Typography>
            ) : (
              <Typography>
                {`${formatTime(hours)}:${formatTime(minutes)}:${formatTime(seconds)}`}
              </Typography>
            )}
          </Box>
        </Box>
        <Box width="100%" alignItems="center" justifyContent="space-between" display="flex">
          <Box>
            <Box>
              <Typography color="#bfbfbf">{transmitter}</Typography>
            </Box>
          </Box>
          <Box display="flex" gap={1}>
            {showControls && (
              <IconButton
                onClick={() => setShowControls(false)}
                size="small"
                sx={{ backgroundColor: green[500] }}
              >
                <Call sx={{ fontSize: 16 }} />
              </IconButton>
            )}
            <IconButton size="small" sx={{ backgroundColor: red[500] }}>
              <CallEnd sx={{ fontSize: 16 }} />
            </IconButton>
          </Box>
        </Box>
      </StyledSnackbar>
    );
  },
);
