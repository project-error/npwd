import './config';

import { RewriteFrames } from '@sentry/integrations';
import { config as resourceConfig } from './config';
export const config = resourceConfig;
import { registerCommands } from './commands/registerCommands';

// Setup controllers
import './db/pool';
import './boot/boot.controller';
import './players/player.controller';
import './calls/calls.controller';
import './notes/notes.controller';
import './contacts/contacts.controller';
import './photo/photo.controller';
import './messages/messages.controller';
import './marketplace/marketplace.controller';
import './twitter/twitter.controller';
import './match/match.controller';

// setup exports
import './bridge/sv_exports';
import './messages/middleware/emitMessage';
import './rcon/exports';

import { mainLogger } from './sv_logger';
import * as Sentry from '@sentry/node';

// register commands
registerCommands();

// Setup sentry tracing
if (config.debug.sentryEnabled && process.env.NODE_ENV === 'production') {
  Sentry.init({
    dsn: 'https://5c5da180a57e4db1acb617ef2c6cb59f@sentry.projecterror.dev/3',
    integrations: [new RewriteFrames()],
    release: process.env.SENTRY_RELEASE || '0.0.0',
    // Set tracesSampleRate to 1.0 to capture 100%
    // of transactions for performance monitoring.
    // We recommend adjusting this value in production
    tracesSampleRate: 1.0,
  });
}

on('onServerResourceStart', (resource: string) => {
  if (resource === GetCurrentResourceName()) {
    mainLogger.info('Successfully started');
  }
});
