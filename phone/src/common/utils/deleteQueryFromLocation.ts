import qs from 'qs';
import url from 'parse-url';

interface IRouterLocation {
  pathname: string;
  search: any;
}

export const deleteQueryFromLocation = (
  location: Record<string, unknown> & IRouterLocation,
  key = '',
) => {
  const { query } = url(location.pathname + location.search);
  return `${location.pathname}/?${qs.stringify({
    ...query,
    [key]: undefined,
  })}`;
};
