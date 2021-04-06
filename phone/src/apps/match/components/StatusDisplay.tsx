import React from 'react';
import { Box } from '@material-ui/core';

function StatusDisplay({ className, visible, text }) {
  const style = { opacity: visible ? '0.65' : '0.0' };

  return (
    <Box className={className} style={style}>
      {text}
    </Box>
  );
}

export default StatusDisplay;
