import { QueryCache, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { PropsWithChildren } from 'react';
import { NuiProvider } from 'react-fivem-hooks';

export const Providers = ({ children }: PropsWithChildren) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        retry: false,
      },
    },
    queryCache: new QueryCache({
      onError: (error) => {
        console.error(error);
      },
    }),
  });

  return (
    <QueryClientProvider client={queryClient}>
      <NuiProvider>
        {/* <ReactQueryDevtools initialIsOpen={false} /> */}
        {children}
      </NuiProvider>
    </QueryClientProvider>
  );
};
