import qs from 'qs';
import parsePath from 'parse-path';

interface IRouterLocation {
  pathname: string;
  search: string;
}

export const addQueryToLocation = (
  { pathname = '', search = '' }: IRouterLocation,
  key = '',
  value = '',
) => {
  const { query } = parsePath(pathname + search);
  return `${pathname}?${qs.stringify({
    ...query,
    [key]: value,
  })}`;
};
