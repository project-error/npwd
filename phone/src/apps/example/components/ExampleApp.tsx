import React from 'react';

import { AppWrapper } from '../../../ui/components';
import { AppTitle } from '../../../ui/components/AppTitle';
import { AppContent } from '../../../ui/components/AppContent';
import { useApp } from '../../../os/apps/hooks/useApps';
import { useExample } from '../hooks/useExample';

export const ExampleApp = () => {
  // calling the example hook, and we assign the value to a variable
  const exampleString = useExample();
  const example = useApp('EXAMPLE');
  return (
    <AppWrapper>
      <AppTitle app={example} />
      <AppContent>
        <h1>This is an example</h1>
        {/* Here we are using the value in a h3 tag */}
        <h3>{exampleString}</h3>
      </AppContent>
    </AppWrapper>
  );
};
