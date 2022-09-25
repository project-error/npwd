import styled from '@emotion/styled';
import CallEnd from '@mui/icons-material/CallEnd';
import Call from '@mui/icons-material/Call';
import { Avatar, Box, IconButton, Typography } from '@mui/material';
import { green, red } from '@mui/material/colors';
import { SnackbarContent, CustomContentProps } from 'notistack';
import React, { forwardRef, useMemo } from 'react';
import { useCurrentCallValue } from '@os/call/hooks/state';
import { useCall } from '@os/call/hooks/useCall';
import useTimer from '@os/call/hooks/useTimer';

const StyledSnackbar = styled(SnackbarContent)(({ theme }) => ({
  padding: '14px 16px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  background: theme.palette.background.paper,
  borderRadius: '12px !important',
  boxShadow: 'rgba(0, 0, 0, 0.35) 0px 5px 15px',
}));

interface CallNotificationBaseProps extends CustomContentProps {
  title: string;
  transmitter: string;
  receiver: string;
}

export type CallNotificationBaseComponent = React.FC<CallNotificationBaseProps>;

const formatTime = (time: number) => (time < 10 ? `0${time}` : time);

export const CallNotificationBase = forwardRef<HTMLDivElement, CallNotificationBaseProps>(
  (props, ref) => {
    const { endCall, acceptCall, rejectCall } = useCall();
    const { transmitter, receiver } = props;
    const call = useCurrentCallValue();
    const { minutes, seconds, startTimer, resetTimer } = useTimer();

    const RECEIVER_TEXT = useMemo(
      () => (call?.is_accepted ? receiver : `Calling ${receiver}`),
      [call.is_accepted, receiver],
    );

    const handleAcceptCall = () => {
      acceptCall();
      startTimer();
    };

    const handleEndOrRejectCall = () => {
      if (!call.is_accepted && !call.isTransmitter) {
        rejectCall();
      } else {
        endCall();
      }
      resetTimer();
    };

    if (!call) {
      return null;
    }

    return (
      <StyledSnackbar ref={ref} style={{ minWidth: '370px' }}>
        <Box display="flex" alignItems="center" gap={1} color="white" mb={0.7}>
          <Box display="flex" justifyContent="center" alignItems="center">
            <Avatar src="" alt="Transmitter" />
          </Box>
          <Box>
            {call?.isTransmitter ? (
              <Typography color="#bfbfbf">{RECEIVER_TEXT}</Typography>
            ) : (
              <Typography color="#bfbfbf">{transmitter}</Typography>
            )}
          </Box>
        </Box>
        <Box display="flex" gap={1}>
          {call?.is_accepted && (
            <Typography color="#bfbfbf">
              {`${formatTime(minutes)}:${formatTime(seconds)}`}
            </Typography>
          )}
          {!call?.isTransmitter && !call?.is_accepted && (
            <IconButton
              onClick={handleAcceptCall}
              size="small"
              sx={{ backgroundColor: green[500] }}
            >
              <Call sx={{ fontSize: 18 }} />
            </IconButton>
          )}
          <IconButton
            onClick={handleEndOrRejectCall}
            size="small"
            sx={{ backgroundColor: red[500] }}
          >
            <CallEnd sx={{ fontSize: 18 }} />
          </IconButton>
        </Box>
      </StyledSnackbar>
    );
  },
);
