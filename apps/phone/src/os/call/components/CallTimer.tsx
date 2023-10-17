import React from 'react';
import { Box, Typography } from '@mui/material';
import useTimer from '../hooks/useTimer';

const formatTime = (time: number) => (time < 10 ? `0${time}` : time);

export const CallTimer = () => {
  const { seconds, hours, minutes } = useTimer();
  return (
    <Box>
      <Typography variant="body1">
        {`${formatTime(hours)}:${formatTime(minutes)}:${formatTime(seconds)}`}
      </Typography>
    </Box>
  );
};
