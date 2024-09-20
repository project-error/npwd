import { QueryCache, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { NuiProvider } from 'react-fivem-hooks';
import { InnerRouterProvider, RouterProvider } from './contexts/RouterContext';
import { routes } from './routes';
import { AppsProvider } from './contexts/AppsContext';
import { NavigationProvider } from './contexts/NavigationContext';
import { NotificationsProvider } from './contexts/NotificationContext';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: true,
      retry: false,
    },
  },
  queryCache: new QueryCache({
    onError: (error) => {
      console.error(error);
    },
  }),
});

export const Providers = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <NuiProvider>
        <NotificationsProvider>
          <NavigationProvider>
            <RouterProvider initialRoutes={routes}>
              <AppsProvider>
                <InnerRouterProvider />
              </AppsProvider>
            </RouterProvider>
          </NavigationProvider>
        </NotificationsProvider>
      </NuiProvider>
    </QueryClientProvider>
  );
};
