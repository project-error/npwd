const isRunningIngame = typeof RegisterCommand !== 'undefined';

if (!isRunningIngame) {
  global.GetConvar = (_: string, defaultValue: string) => {
    return defaultValue;
  };

  global.getPlayers = () => {
    return ['0'];
  };

  global.getPlayerIdentifiers = (player: string) => {
    return [player.toString()];
  };

  global.GetResourceState = (_: string) => {
    return 'started';
  };

  global.exports = {
    'custom-framework': {
      ['authorizeDevice']: async (_src: number, _deviceIdentifier: string) => {
        /**
         * Development outside FiveM.
         * Here is where you would implement your custom authorization logic.
         */
        return true;
      },
    },
  } as unknown as CitizenExports;
}
