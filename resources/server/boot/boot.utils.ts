import { mainLogger } from '../sv_logger';

export const bootLogger = mainLogger.child({
  module: 'boot',
});
