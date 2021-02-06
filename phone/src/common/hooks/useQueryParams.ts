import qs, { ParsedQs } from 'qs';
import { useLocation } from 'react-router-dom';

export function useQueryParams<T = Record<string, string>>() {
  return qs.parse(useLocation().search, { ignoreQueryPrefix: true }) as T &
    Partial<ParsedQs>;
}
