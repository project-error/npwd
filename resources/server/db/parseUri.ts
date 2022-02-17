// Thanks to Taso for doing things

const regex = new RegExp(
  '^(?:([^:/?#.]+):)?(?://(?:([^/?#]*)@)?([\\w\\d\\-\\u0100-\\uffff.%]*)(?::([0-9]+))?)?([^?#]+)?(?:\\?([^#]*))?$',
);

export const parseUri = (connectionUri: string) => {
  const splitMatchGroups = connectionUri.match(regex);

  // Handle parsing for optional password auth
  const authTgt = splitMatchGroups[2] ? splitMatchGroups[2].split(':') : [];

  const removeForwardSlash = (str: string) => str.replace(/^\/+/, '');

  return {
    driver: splitMatchGroups[1],
    user: authTgt[0] || undefined,
    password: authTgt[1] || undefined,
    host: splitMatchGroups[3],
    port: parseInt(splitMatchGroups[4], 10),
    database: removeForwardSlash(splitMatchGroups[5]),
    params: splitMatchGroups[6],
  };
};
