import { config } from '@npwd/config/server';
import { mainLogger } from '../../sv_logger';
import { Strategy } from '../framework-strategy';

export class Standalone implements Strategy {
  constructor() {
    mainLogger.info('Loading Standalone bridge....');

    config.general.useResourceIntegration = true;
    config.database.identifierColumn = 'identifier';
    config.database.phoneNumberColumn = 'phone_number';
    config.database.playerTable = 'users';
    config.database.identifierType = 'license';
  }

  init(): void {
    return;
  }

  onStart(): void {
   return;
  }
}