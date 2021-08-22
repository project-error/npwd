import { Server } from 'esx.js';
import { ResourceConfig } from '../../typings/config';
import { RewriteFrames } from '@sentry/integrations';

// Setup and export config loaded at runtime
export const config: ResourceConfig = JSON.parse(
  LoadResourceFile(GetCurrentResourceName(), 'config.json'),
);

// Setup controllers
import './db/pool';
import './players/player.controller';
import './calls/calls.controller';
import './notes/notes.controller';
import './contacts/contacts.controller';
import './photo/photo.controller';
import './messages/messages.controller';
import './marketplace/marketplace.controller';
import './twitter/twitter.controller';
import './match/match.controller';
import './bank/bank.controller';

import { mainLogger } from './sv_logger';
import * as Sentry from '@sentry/node';

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

export let ESX: Server = null;

emit('esx:getSharedObject', (obj: Server) => (ESX = obj));

on('onServerResourceStart', (resource: string) => {
  if (resource === GetCurrentResourceName()) {
    mainLogger.info('Sucessfully started');
  }
});
