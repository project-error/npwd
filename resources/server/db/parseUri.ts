// Thanks to Taso for doing things

const regex = new RegExp(
  '^(?:([^:/?#.]+):)?(?://(?:([^/?#]*)@)?([\\w\\d\\-\\u0100-\\uffff.%]*)(?::([0-9]+))?)?([^?#]+)?(?:\\?([^#]*))?$',
);

export const parseUri = (connectionUri: string) => {
  const splitMatchGroups = connectionUri.match(regex);

  // Handle parsing for optional password auth
  const authTgt = splitMatchGroups[2] ? splitMatchGroups[2].split(':') : [];

  const removeForwardSlash = (str: string) => str.replace(/^\/+/, '');

  if (connectionUri.includes('mysql://'))
    return {
      driver: splitMatchGroups[1],
      user: authTgt[0] || undefined,
      password: authTgt[1] || undefined,
      host: splitMatchGroups[3],
      port: parseInt(splitMatchGroups[4], 10),
      database: removeForwardSlash(splitMatchGroups[5]),
      params: splitMatchGroups[6],
    };

  return connectionUri
    .replace(/(?:host(?:name)|ip|server|data\s?source|addr(?:ess)?)=/gi, 'host=')
    .replace(/(?:user\s?(?:id|name)?|uid)=/gi, 'user=')
    .replace(/(?:pwd|pass)=/gi, 'password=')
    .replace(/(?:db)=/gi, 'database=')
    .split(';')
    .reduce<Record<string, string>>((connectionInfo, parameter) => {
      const [key, value] = parameter.split('=');
      connectionInfo[key] = value;
      return connectionInfo;
    }, {});
};
