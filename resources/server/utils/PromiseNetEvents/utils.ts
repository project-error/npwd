import { mainLogger } from '../../sv_logger';

export const netEventLogger = mainLogger.child({
  module: 'net-events',
});
