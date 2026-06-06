import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
  QueryErrorResetBoundary,
} from '@tanstack/react-query';
import { useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { toast } from 'sonner';

import { GlobalError } from '@/components/error/global-error';
import { Toaster } from '@/components/toast';
import { queryConfig } from '@/lib/react-query';

type AppProviderProps = {
  children: React.ReactNode;
};

export function AppProvider({ children }: AppProviderProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: queryConfig,
        queryCache: new QueryCache({
          onError: (error) => {
            toast.error(String(error));
          },
        }),
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>

      <QueryErrorResetBoundary>
        {({ reset }) => (
          <ErrorBoundary onReset={reset} FallbackComponent={GlobalError}>
            {children}
          </ErrorBoundary>
        )}
      </QueryErrorResetBoundary>

      <Toaster
        position="top-right"
        richColors
        duration={1500}
        visibleToasts={1}
      />
    </QueryClientProvider>
  );
}
