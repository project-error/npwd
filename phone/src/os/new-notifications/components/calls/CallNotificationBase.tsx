import styled from '@emotion/styled';
import CallEnd from '@mui/icons-material/CallEnd';
import Call from '@mui/icons-material/Call';
import { Avatar, Box, IconButton, Typography, useTheme } from '@mui/material';
import { useApps } from '@os/apps/hooks/useApps';
import { green, red } from '@mui/material/colors';
import { SnackbarContent, CustomContentProps } from 'notistack';
import React, { forwardRef, useState } from 'react';
import { useContactActions } from '@apps/contacts/hooks/useContactActions';

const StyledSnackbar = styled(SnackbarContent)(({ theme }) => ({
  padding: '14px 16px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  background: theme.palette.background.paper,
  borderRadius: '12px !important',
  boxShadow: 'rgba(0, 0, 0, 0.35) 0px 5px 15px',
  backdropFilter: 'blur(4px)',
}));

interface CallNotificationBaseProps extends CustomContentProps {
  title: string;
  transmitter: string;
  onAccept: () => void;
  onEnd: () => void;
}

export type CallNotificationBaseComponent = React.FC<CallNotificationBaseProps>;

// const formatTime = (time: number) => (time < 10 ? `0${time}` : time);

export const CallNotificationBase = forwardRef<HTMLDivElement, CallNotificationBaseProps>(
  (props, ref) => {
    const { title, transmitter, onAccept, onEnd } = props;
    const { getApp } = useApps();
    // const { hours, minutes, seconds } = useTimer();
    const { getPictureByNumber, getDisplayByNumber } = useContactActions();

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
          <IconButton size="small" sx={{ backgroundColor: green[500] }}>
            <Call sx={{ fontSize: 18 }} />
          </IconButton>
          <IconButton size="small" sx={{ backgroundColor: red[500] }}>
            <CallEnd sx={{ fontSize: 18 }} />
          </IconButton>
        </Box>
      </StyledSnackbar>
    );
  },
);
