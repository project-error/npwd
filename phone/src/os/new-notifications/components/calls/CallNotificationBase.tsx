import styled from '@emotion/styled';
import CallEnd from '@mui/icons-material/CallEnd';
import Call from '@mui/icons-material/Call';
import { Avatar, Box, IconButton, Typography } from '@mui/material';
import { green, red } from '@mui/material/colors';
import { SnackbarContent, CustomContentProps } from 'notistack';
import React, { forwardRef } from 'react';
import { useContactActions } from '@apps/contacts/hooks/useContactActions';
import { useCurrentCallValue } from '@os/call/hooks/state';
import useTimer from '@os/call/hooks/useTimer';
import { on } from 'events';

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
  onAccept: () => void;
  onReject: () => void;
  onEnd: () => void;
}

export type CallNotificationBaseComponent = React.FC<CallNotificationBaseProps>;

const formatTime = (time: number) => (time < 10 ? `0${time}` : time);

export const CallNotificationBase = forwardRef<HTMLDivElement, CallNotificationBaseProps>(
  (props, ref) => {
    const { transmitter, onAccept, onEnd, onReject } = props;
    const call = useCurrentCallValue();
    const { hours, minutes, seconds, startTimer, resetTimer } = useTimer();
    const { getPictureByNumber, getDisplayByNumber } = useContactActions();

    const handleAcceptCall = () => {
      onAccept();
      startTimer();
    };

    const handleEndCall = () => {
      onEnd();
      resetTimer();
    };

    const handleRejectCall = () => {
      onReject();
      resetTimer();
    };

    return (
      <StyledSnackbar ref={ref} style={{ minWidth: '370px' }}>
        <Box display="flex" alignItems="center" gap={1} color="white" mb={0.7}>
          <Box display="flex" justifyContent="center" alignItems="center">
            <Avatar src={getPictureByNumber(transmitter) ?? null} alt="Transmitter" />
          </Box>
          <Box>
            <Typography color="#bfbfbf">
              {getDisplayByNumber(transmitter) ?? transmitter}
            </Typography>
          </Box>
        </Box>
        <Box display="flex" gap={1}>
          {call && (
            <Typography>
              {`${formatTime(hours)}:${formatTime(minutes)}:${formatTime(seconds)}`}
            </Typography>
          )}
          {!call && (
            <IconButton
              onClick={handleAcceptCall}
              size="small"
              sx={{ backgroundColor: green[500] }}
            >
              <Call sx={{ fontSize: 18 }} />
            </IconButton>
          )}
          <IconButton
            onClick={call ? handleEndCall : handleRejectCall}
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
