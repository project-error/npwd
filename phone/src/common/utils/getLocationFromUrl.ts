import parseUrl from 'parse-url';

export const getLocationFromUrl = (url: String) => {
  const { pathname, query: search } = parseUrl(url);
  return { pathname, search };
};
