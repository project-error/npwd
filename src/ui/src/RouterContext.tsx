import { createContext, PropsWithChildren, useState } from 'react';
import { RouteObject, RouteProps } from 'react-router';
import { createHashRouter, RouterProvider as ReactRouterProvider } from 'react-router-dom';

export const RouterContext = createContext<{
  routes: RouteObject[];
  setRoutes: (routes: RouteObject[]) => void;
}>({
  routes: [],
  setRoutes: () => {},
});

interface RouterProviderProps extends PropsWithChildren {
  initialRoutes?: RouteObject[];
}

export const RouterProvider = ({ initialRoutes = [] }: RouterProviderProps) => {
  const [routes, setRoutes] = useState(initialRoutes);

  if (!routes?.length) {
    throw new Error('No routes provided to RouterProvider');
  }

  return (
    <RouterContext.Provider value={{ routes, setRoutes }}>
      <ReactRouterProvider router={createHashRouter(routes)} />
    </RouterContext.Provider>
  );
};
