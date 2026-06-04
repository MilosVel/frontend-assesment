import type { DefaultOptions } from '@tanstack/react-query';
import type { AxiosError } from 'axios';

export const queryConfig = {
  queries: {
    refetchOnWindowFocus: false,
    retry: 1,
    staleTime: 1000 * 60,
    throwOnError: (error: unknown) => {
      const err = error as AxiosError;
      return (
        err?.message === 'Network Error' ||
        err?.code === 'ERR_NETWORK' ||
        err?.response?.status === 500
      );
    },
  },
} satisfies DefaultOptions;
