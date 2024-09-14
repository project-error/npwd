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
}
