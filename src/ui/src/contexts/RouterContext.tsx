import { createContext, PropsWithChildren, useState } from 'react';
import { RouteObject } from 'react-router';
import { createHashRouter, RouterProvider as ReactRouterProvider } from 'react-router-dom';
import { useRoutes } from '@/hooks/useRouter';

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

export const RouterProvider = ({ initialRoutes = [], children }: RouterProviderProps) => {
  const [routes, setRoutes] = useState(initialRoutes);

  if (!routes?.length) {
    throw new Error('No routes provided to RouterProvider');
  }

  return (
    <RouterContext.Provider
      value={{
        routes,
        setRoutes,
      }}
    >
      {children}
    </RouterContext.Provider>
  );
};

export const InnerRouterProvider = () => {
  const { routes } = useRoutes();
  return <ReactRouterProvider router={createHashRouter(routes)} />;
};
