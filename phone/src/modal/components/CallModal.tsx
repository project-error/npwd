import React from 'react';
import { green } from '@material-ui/core/colors';
import { AppWrapper } from '../../ui/components/AppWrapper';
import { AppTitle } from '../../ui/components/AppTitle';
import { AppContent } from '../../ui/components/AppContent';

export const CallModal = () => {
  return (
    <AppWrapper>
      <AppTitle
        app={{
          backgroundColor: green[400],
          color: green[50],
          nameLocale: 'Call',
        }}
        variant='h4'
      />
      <AppContent>
        <h1
          style={{
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          Call
        </h1>
      </AppContent>
    </AppWrapper>
  );
};
