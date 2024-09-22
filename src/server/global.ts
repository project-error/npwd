const isRunningInGame = typeof RegisterCommand !== 'undefined';

if (!isRunningInGame) {
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

  const initDevices = async () => {
    const PlayerService = require('./services/PlayerService').default;
    const DeviceService = require('./services/DeviceService').default;
    const SimCardService = require('./services/SimCardService').default;
    const baseLicense = `license:ef0b12fd95e37572c24c00503c3fd02f3f9b99cb`;

    /** Check if device exists. otherwise create them */
    const isDevicesCreated = await DeviceService.getDeviceByIdentifier(`1:${baseLicense}`);

    if (!isDevicesCreated) {
      console.log('Creating devices');

      for (let i = 1; i <= 3; i++) {
        console.log(`Creating device ${i}`);
        const simcard = await SimCardService.createSimCard({
          phone_number: `${i}${i}${i}`,
        });
        await await DeviceService.createDevice({
          sim_card_id: simcard.id,
          identifier: `${i}:${baseLicense}`,
        });
      }
    }

    PlayerService.selectDevice(1, `1:${baseLicense}`);
    PlayerService.selectDevice(2, `2:${baseLicense}`);
    PlayerService.selectDevice(3, `3:${baseLicense}`);
  };

  console.log('Initializing devices');
  setTimeout(() => {
    initDevices();
  }, 2500);
}
