import React from 'react';
import { AppWrapper } from '../../../ui/components';
import { AppTitle } from '../../../ui/components/AppTitle';
import { AppContent } from '../../../ui/components/AppContent';
import { DialerHistory } from './DialerHistory';
import { useDialerHistory } from '../hooks/useDialerHistory';
import { useApp } from '../../../os/apps/hooks/useApps';

export const DialerApp = () => {
  const { history } = useDialerHistory();
  const dialer = useApp('DIALER');
  return (
    <AppWrapper>
      <AppTitle app={dialer} />
      <AppContent>
        <DialerHistory calls={history} />
      </AppContent>
    </AppWrapper>
  );
};
