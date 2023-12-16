import React from 'react';
import { AppWrapper } from '@ui/components';
import { Box } from '@mui/material';
import { GridMenu } from '@ui/components/GridMenu';
import { useApps } from '@os/apps/hooks/useApps';
import { useExternalApps } from '@common/hooks/useExternalApps';

export const HomeApp: React.FC = () => {
  const { apps } = useApps();
  const externalApps = useExternalApps();
  return (
    <AppWrapper>
      <Box component="div" mt={6} px={1}>
        {apps && <GridMenu xs={3} items={[...apps, ...externalApps]} />}
      </Box>

      {/*<div className="absolute bottom-5 left-8 right-8">
        <div className="h-20 w-full rounded-md bg-gray-200/30 backdrop-blur">
          {apps &&
            apps.slice(0, 4).map((app) => (
              <div className="float-left h-full w-1/4" key={app.id}>
                <div className="flex h-full w-full items-center justify-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-md bg-gray-200/50 backdrop-blur">
                    {app.icon}
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>*/}
    </AppWrapper>
  );
};
