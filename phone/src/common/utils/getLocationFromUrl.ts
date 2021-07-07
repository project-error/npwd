import parseUrl from 'parse-url';

interface GetLocationFromUrlValue {
  pathname: string;
  search: string;
}

export const getLocationFromUrl = (url: string): GetLocationFromUrlValue => {
  const { pathname, search } = parseUrl(url);
  const searchStr = '?' + (search || '');
  return { pathname, search: searchStr };
};
