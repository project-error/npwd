import qs from 'qs';
import parsePath from 'parse-path';

interface IRouterLocation {
  pathname: string;
  search: any;
}

export const deleteQueryFromLocation = (
  location: Record<string, unknown> & IRouterLocation,
  key = '',
) => {
  const { query } = parsePath(location.pathname + location.search);
  return `${location.pathname}/?${qs.stringify({
    ...query,
    [key]: undefined,
  })}`;
};
