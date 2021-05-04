import { mainLogger } from '../sv_logger';

export const playerLogger = mainLogger.child({
  module: 'player',
});
