import { QueryKey, useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';

type StateUpdater<T> = T | ((previous: T) => T);

const resolveStateUpdater = <T>(updater: StateUpdater<T>, previous: T): T => {
  if (typeof updater === 'function') {
    return (updater as (previous: T) => T)(previous);
  }

  return updater;
};

export const useQueryStateValue = <T>(
  queryKey: QueryKey,
  queryFn: () => Promise<T>,
  fallback: T,
): T => {
  const { data } = useQuery({ queryKey, queryFn });
  return data ?? fallback;
};

export const useSetQueryState = <T>(queryKey: QueryKey, fallback: T) => {
  const queryClient = useQueryClient();

  return useCallback(
    (updater: StateUpdater<T>) => {
      queryClient.setQueryData<T>(queryKey, (previous) =>
        resolveStateUpdater(updater, previous ?? fallback),
      );
    },
    [fallback, queryClient, queryKey],
  );
};

export const useQueryState = <T>(
  queryKey: QueryKey,
  queryFn: () => Promise<T>,
  fallback: T,
) => {
  const value = useQueryStateValue(queryKey, queryFn, fallback);
  const setValue = useSetQueryState(queryKey, fallback);

  return [value, setValue] as const;
};
