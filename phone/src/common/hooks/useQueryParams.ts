import qs, { ParsedQs } from 'qs';
import { useLocation } from 'react-router-dom';
import { useMemo } from 'react';

/**
 * Parses all available query params in current location and returns as an object
 *
 * @return {T} Querystring object
 *
 * @example
 *
 *     const { id, title } = useQueryParams<{ id: string, title: string }>();
 */
export function useQueryParams<T = Record<string, string>>(defaultValues: T = null) {
  const { search } = useLocation();

  return useMemo(() => {
    const query = qs.parse(search, { ignoreQueryPrefix: true });

    if (!defaultValues) {
      return query as T & Partial<ParsedQs>;
    }
    return { ...defaultValues, ...query } as T & Partial<ParsedQs>;
  }, [search, defaultValues]);
}
