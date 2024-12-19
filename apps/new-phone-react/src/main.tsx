import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import Phone from './Phone.tsx';
import { DevTools } from 'jotai-devtools';
import 'jotai-devtools/styles.css';
import { Provider } from 'jotai';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { queryClient } from '@http/query.ts';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <Provider>
        <DevTools />
        <Phone />
      </Provider>
      <ReactQueryDevtools />
    </QueryClientProvider>
  </StrictMode>,
);
