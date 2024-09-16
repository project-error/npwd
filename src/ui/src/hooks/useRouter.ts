import { RouterContext } from '@/RouterContext';
import { useContext } from 'react';
import { RouteObject } from 'react-router';

export const useSetRoutes = () => {
  const { setRoutes, routes } = useContext(RouterContext);
  return (callback: (previousRoutes: RouteObject[]) => RouteObject[]) => {
    setRoutes(callback(routes));
  };
};
