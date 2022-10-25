import React from 'react';
import { Box, Button, Typography } from '@mui/material';
import { useExampleStringValue } from '../hooks/state';
import { useApp } from '@os/apps/hooks/useApps';

export const ExampleApp: React.FC = () => {
  const exampleString = useExampleStringValue();

  const example = useApp('EXAMPLE');

  return (
    <Box height="100%" width="100%" p={2}>
      <Typography variant="h4">Welcome to NPWD!</Typography>
      <Button color="primary">{example.id}</Button>
      {/* Here we are using the value in a h3 tag */}
      <h3>{exampleString}</h3>
    </Box>
  );
};
