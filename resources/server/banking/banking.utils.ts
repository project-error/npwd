import { mainLogger } from '../sv_logger';

export const bankingLogger = mainLogger.child({ module: 'banking' });
