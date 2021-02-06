import qs from 'qs';
import url from 'parse-url';

interface IRouterLocation {
  pathname: string;
  search: string;
}

export const addQueryToLocation = (
  { pathname = '', search = '' }: Record<string, unknown> & IRouterLocation,
  key = '',
  value = ''
) => {
  const { query } = url(pathname + search);
  return `${pathname}?${qs.stringify({
    ...query,
    [key]: value,
  })}`;
};
