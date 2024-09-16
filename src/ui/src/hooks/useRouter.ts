import { RouterContext } from '@/contexts/RouterContext';
import { useContext } from 'react';

export const useRoutes = () => {
  const { setRoutes, routes } = useContext(RouterContext);

  if (!routes?.length) {
    throw new Error('No routes provided to RouterProvider');
  }

  return {
    routes,
    setRoutes,
  };
};
