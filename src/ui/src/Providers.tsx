import { QueryCache, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { PropsWithChildren, useContext } from 'react';
import { NuiProvider } from 'react-fivem-hooks';
import { RouterProvider } from './RouterContext';
import { routes } from './routes';

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

export const Providers = ({ children }: PropsWithChildren) => {
  return (
    <QueryClientProvider client={queryClient}>
      <NuiProvider>
        <RouterProvider initialRoutes={routes}>
          {/* <ReactQueryDevtools initialIsOpen={false} /> */}
          {children}
        </RouterProvider>
      </NuiProvider>
    </QueryClientProvider>
  );
};
