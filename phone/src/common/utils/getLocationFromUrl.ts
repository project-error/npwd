import parseUrl from 'parse-url';

export const getLocationFromUrl = (url: string) => {
  const { pathname, search } = parseUrl(url);
  const searchStr = '?' + (search || '');
  return { pathname, search: searchStr };
};
