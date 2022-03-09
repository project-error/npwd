// eslint-disable-next-line @typescript-eslint/no-var-requires
import { config } from './server';
import path from 'path';
const { createLogger, transports, format } = require('./logform');

// Needed to manually apply a color to componenent property of log
const manualColorize = (strToColor: string): string => `[\x1b[35m${strToColor}\x1b[0m]`;

// Format handler passed to winston
const formatLogs = (log: any): string => {
  if (log.module)
    return `${log.label} ${manualColorize(log.module)} [${log.level}]: ${log.message}`;

  return `${log.label} [${log.level}]: ${log.message}`;
};

const findLogPath = () => `${path.join(GetResourcePath(GetCurrentResourceName()), 'sv_npwd.log')}`;
// Initiate the main logger for NPWD

export const mainLogger = createLogger({
  silent: !config.debug.enabled ?? false,
  transports: [
    new transports.File({
      filename: findLogPath(),
      level: 'silly',
      format: format.combine(format.errors({ stack: true }), format.timestamp(), format.json()),
    }),
    new transports.Console({
      level: config.debug.level ?? 'info',
      format: format.combine(
        format.label({ label: '[NPWD]' }),
        format.colorize({ all: true }),
        format.printf(formatLogs),
      ),
    }),
  ],
});
