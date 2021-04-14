import { mainLogger } from '../sv_logger';

export const callLogger = mainLogger.child({ module: 'calls' });
