import React from 'react';
import { AppWrapper } from '../../../ui/components';
import { Box } from '@material-ui/core';
import { GridMenu } from '../../../ui/components/GridMenu';
import { useApps } from '../../../os/apps/hooks/useApps';

export const HomeApp: React.FC = () => {
  const { apps } = useApps();
  return (
    <AppWrapper>
      <Box component="div" mt={6} px={1}>
        {apps && <GridMenu xs={3} items={apps} />}
      </Box>
    </AppWrapper>
  );
};
