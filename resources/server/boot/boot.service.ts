import BootDb, { _BootDb } from './boot.db';
import { bootLogger, fatalDbError } from './boot.utils';
import { config } from '../server';
import { frameworkDependencies, requiredDbColumns } from './boot.utils';

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
    bootLogger.debug('Beginning database schema validation');

    const doesPlayerTableExist = await this.bootDb.doesPlayerTableExist();

    if (!doesPlayerTableExist) {
      fatalDbError(
        `Player table "${config.database.playerTable}" does not exist in the configured database.`,
      );
    }

    const columnData = await this.bootDb.getPlayerTableColumns();

    if (!requiredDbColumns.every((elem) => columnData.includes(elem))) {
      const missingColumns = requiredDbColumns.filter((elem) => !columnData.includes(elem));

      fatalDbError(`Player table is missing required columns: [${missingColumns.join(', ')}]`);
    }

    bootLogger.debug('Database schema successfully validated');
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
    bootLogger.debug('Checking for missing framework dependencies');

    const startedResources = new Set<string>();
    const errorsDetected = new Set<string>();

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

          errorsDetected.add(
            `Missing ${resourceName} dependencies detected: ${missingDependencies.join(', ')}`,
          );
        }
      }
    }

    if (errorsDetected.size) {
      errorsDetected.forEach((errorString) => bootLogger.error(errorString));
    } else {
      bootLogger.debug('No missing dependencies were detected');
    }
  }
}

const BootService = new _BootService();

export default BootService;
