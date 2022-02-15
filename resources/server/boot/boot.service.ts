import BootDb, { _BootDb } from './boot.db';
import { bootLogger } from './boot.utils';
import { config } from '../server';

const { identifierColumn, phoneNumberColumn } = config.database;
const requiredDbColumns = [identifierColumn, phoneNumberColumn];

const frameworkDependencies = {
  ['es_extended']: ['esx-npwd'],
  ['qb-core']: ['qb-npwd'],
};

export class _BootService {
  private readonly bootDb: _BootDb;

  constructor() {
    this.bootDb = BootDb;
    bootLogger.debug('Boot service started');
  }

  /**
   * onResourceStart event handler.
   */
  async handleResourceStarting(): Promise<void> {
    await this.validateDatabaseSchema();
    this.performConfigChecks();
  }

  /**
   * Validates that the player table and required columns exist.
   */
  async validateDatabaseSchema(): Promise<void> {
    const doesPlayerTableExist = await this.bootDb.doesPlayerTableExist();

    if (!doesPlayerTableExist) {
      throw new Error('Player table does not exist in configured database.');
    }

    const columnData = await this.bootDb.getPlayerTableColumns();

    if (!requiredDbColumns.every((elem) => columnData.includes(elem))) {
      throw new Error('Configured player table is missing required columns.');
    }
  }

  /**
   * Performs various checks related to the config.json file.
   */
  performConfigChecks(): void {
    if (config.general.useResourceIntegration) {
      this.checkFrameworkDependencies();
    }
  }

  /**
   * Check if various framework wrappers are started if applicable.
   */
  checkFrameworkDependencies(): void {
    const startedResources = new Set<string>();

    const numOfResources = GetNumResources();
    for (let i = 0; i < numOfResources; i++) {
      const resourceName = GetResourceByFindIndex(i);

      if (GetResourceState(resourceName) === 'started') {
        startedResources.add(resourceName);
      }
    }

    for (const [resourceName, depList] of Object.entries(frameworkDependencies)) {
      if (startedResources.has(resourceName)) {
        if (!depList.every((elem) => startedResources.has(elem))) {
          const missingDependencies = depList.filter((depName) => !startedResources.has(depName));

          console.log(`Missing ${resourceName} dependencies detected: ${missingDependencies}`);
        }
      }
    }
  }
}

const BootService = new _BootService();

export default BootService;
