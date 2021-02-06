import parseUrl from 'parse-url';

export const getLocationFromUrl = (url: String) => {
  const { pathname, search } = parseUrl(url);
  const searchStr = '?' + (search || '');
  return { pathname, search: searchStr };
};
