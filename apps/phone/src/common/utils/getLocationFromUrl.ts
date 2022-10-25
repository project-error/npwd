import parsePath from 'parse-path';

interface GetLocationFromUrlValue {
  pathname: string;
  search: string;
}

export const getLocationFromUrl = (url: string): GetLocationFromUrlValue => {
  const { href, search } = parsePath(url);
  const searchStr = '?' + (search || '');
  return { pathname: href, search: searchStr };
};
