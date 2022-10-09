import React from 'react';
import { AppWrapper } from '@ui/components';
import { Box } from '@mui/material';
import { GridMenu } from '@ui/components/GridMenu';
import { useApps } from '@os/apps/hooks/useApps';
import { useRecoilValue } from 'recoil';
import { phoneState } from '@os/phone/hooks/state';

export const HomeApp: React.FC = () => {
  const { apps } = useApps();
  const externalApps = useRecoilValue(phoneState.extApps).filter(Boolean);
  return (
    <AppWrapper>
      <Box component="div" mt={6} px={1}>
        {apps && <GridMenu xs={3} items={[...apps, ...externalApps]} />}
      </Box>
    </AppWrapper>
  );
};
