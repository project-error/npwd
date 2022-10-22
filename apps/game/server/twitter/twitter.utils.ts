import { mainLogger } from '../sv_logger';

export const twitterLogger = mainLogger.child({ module: 'twitter' });
