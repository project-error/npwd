import React from 'react';
import { Box } from '@mui/material';

function StatusDisplay({ className, visible, text }) {
  const style = { opacity: visible ? '0.65' : '0.0' };

  return (
    <Box className={className} style={style}>
      {text}
    </Box>
  );
}

export default StatusDisplay;
