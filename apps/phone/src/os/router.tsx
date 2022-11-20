import { Route } from 'react-router-dom';

export const createAppRouter = (routes: { path: string; Component: React.ReactNode }[]) => {
  return routes.map((route) => {
    return {
      Route: <Route path={route.path} element={route.Component} />,
    };
  });
};
