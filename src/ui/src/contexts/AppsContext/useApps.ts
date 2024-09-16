import { useContext } from 'react';
import { AppsContext } from '.';

export const useApps = () => {
  const { hasInitialised, apps } = useContext(AppsContext);

  if (!hasInitialised) {
    throw new Error('useApps must be used within a AppsProvider');
  }

  return apps;
};
