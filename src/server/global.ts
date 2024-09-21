import PlayerService from './services/PlayerService';

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

  const baseLicense = `license:ef0b12fd95e37572c24c00503c3fd02f3f9b99cb`;
  PlayerService.selectDevice(1, `1:${baseLicense}`);
  PlayerService.selectDevice(2, `2:${baseLicense}`);
  PlayerService.selectDevice(3, `3:${baseLicense}`);
}
