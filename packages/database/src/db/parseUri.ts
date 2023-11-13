
import { ConnectionOptions } from 'mysql2';
interface NPWDConnectionOptions extends ConnectionOptions {
  driver: string;
  username?: string
}

export const parseUri = (connectionUri: string) => {
  if (connectionUri.includes('mysql://')) {
    const parsedUrl = new URL(connectionUri);
    const options: NPWDConnectionOptions = {
      driver: parsedUrl.protocol,
      host: parsedUrl.hostname,
      port: parseInt(parsedUrl.port),
      database: parsedUrl.pathname.slice(1),
      user: parsedUrl.username,
      password: decodeURIComponent(parsedUrl.password),
    };
    parsedUrl.searchParams.forEach((value: string, key: keyof NPWDConnectionOptions) => {
      try {
        // Try to parse this as a JSON expression first
        (options as Record<typeof key, any>)[key] = JSON.parse(value);
      } catch (err) {
        // Otherwise assume it is a plain string
        // convert 'username' to user to match driver type
        if(key === 'username') options['user'] = value;
        else (options as Record<typeof key, any>)[key] = value;
      }
    });

    // we only want this if we miss both password & user or database
    if (!options.password && !options.user || !options.database) {
      const regex = new RegExp('^(?:([^:/?#.]+):)?(?://(?:([^/?]*):([^/?]*)@)?([[A-Za-z0-9_.]+]*)(?::([0-9]+))?)?(?:\\\\?([^#]*))?$', '')
      const specialCharactersRegex = regex.exec(connectionUri);
      if (specialCharactersRegex) {
        options.user = specialCharactersRegex[2] || void 0;
        options.password = specialCharactersRegex[3] || void 0;
        options.host = specialCharactersRegex[4];
        options.port = parseInt(specialCharactersRegex[5]);
        options.database = specialCharactersRegex[6].replace(/^\/+/, "");
      }
    }

    // we need to delete any empty keys, the driver really hates empty strings in the options.
    for(let key in options) !(options as Record<typeof key, any>)[key] && delete (options as Record<typeof key, any>)[key] 

    return options;
  }  
  
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
