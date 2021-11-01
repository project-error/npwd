import React from 'react';
import { AppWrapper } from '../../../ui/components';
import { AppContent } from '../../../ui/components/AppContent';
import { css } from '@emotion/react';

const AppRootClass = css({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
});

export const LocationApp: React.FC = () => {
  return <AppWrapper id="location">{/*<AppContent className={AppRootClass} />*/}</AppWrapper>;
};
