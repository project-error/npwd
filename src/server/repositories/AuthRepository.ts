import { ResourceConfig, getServerConfig } from '../utils/config';
const _exports = global.exports;

const frameworks = ['standalone', 'custom'] as const;
type Framework = (typeof frameworks)[number];

const frameworkExports = ['authorizeDevice'] as const;

const validateFramework = (framework: unknown): framework is Framework => {
  if (typeof framework !== 'string') return false;
  return frameworks.includes(framework as Framework);
};

const getConvarFramework = (): string | undefined => {
  try {
    return GetConvar('npwd:framework', '');
  } catch (error) {
    console.error('Failed to get framework from GetConvar');
    console.error(error);
  }
};

const getFramework = () => {
  const config = getServerConfig();
  const convarFramework = getConvarFramework();
  const framework = convarFramework || config.framework;

  if (convarFramework) {
    console.log(`Using framework "${convarFramework}" from GetConvar`);
  } else {
    console.log(`Using framework "${config.framework}" from config.json`);
  }

  if (!validateFramework(framework)) {
    console.log(`Invalid framework: ${framework}`);
    throw new Error('Invalid framework');
  }

  return framework;
};

class AuthRepository {
  framework: Framework;
  config: ResourceConfig;

  constructor() {
    this.config = getServerConfig();
    try {
      this.framework = getFramework();
    } catch (error) {
      console.error('Failed to get framework');
      console.error(error);
      this.framework = 'standalone';
    }

    console.log(`Using framework: ${this.framework}`);

    if (this.framework === 'custom') {
      this.validateFrameworkIntegration();
    }
  }

  private async authorizeStandalone(src: number, deviceIdentifier: string): Promise<boolean> {
    /**
     * Development outside FiveM.
     */
    if (typeof RegisterCommand === 'undefined') {
      return `${src}` === deviceIdentifier;
    }

    const playerLicenses = getPlayerIdentifiers(src);
    const playerLicense = playerLicenses.find((license) => license.startsWith('license:'));

    /**
     * In development mode.
     */
    const isDevelopmentMode = GetConvar('is_development', 'true') === 'true';

    if (isDevelopmentMode) {
      return `${src}:${playerLicense}` === deviceIdentifier;
    }

    return playerLicense === deviceIdentifier;
  }

  private async validateFrameworkIntegration() {
    const { exports: configExports, resource } = this.config.frameworkIntegration ?? {};

    if (!configExports || !resource) {
      throw new Error('Missing framework integration exports or resource');
    }

    const resourceStatus = GetResourceState(resource);
    if (!resourceStatus || resourceStatus !== 'started') {
      console.error(`Resource "${resource}" is not started`);
      console.error(`Resource status: "${resourceStatus}"`);
      console.error('Make sure the resource is started before using the custom framework');
      console.error(
        'You can configure the resource to be used in "config.json" under `frameworkIntegration`',
      );

      throw new Error(`Resource "${resource}" is not started`);
    }

    for (const exportName of frameworkExports) {
      if (!configExports[exportName]) {
        console.log(
          `The resource "${resource}" was found, but it's missing the export "${exportName}"`,
        );

        throw new Error(
          `Missing export "${exportName}" export in the "config.json" for the custom framework.`,
        );
      }
    }

    if (!_exports[resource]) {
      throw new Error(`Resource "${resource}" does not exist`);
    }

    for (const exportName of frameworkExports) {
      try {
        console.log(`Checking export "${exportName}" in the resource "${resource}"`);
        typeof _exports[resource][exportName] === 'function';
      } catch (error) {
        throw new Error(
          `The resource "${resource}" was found, but it's missing the export "${exportName}"`,
        );
      }
    }
  }

  private async authorizeCustom(src: number, deviceIdentifier: string): Promise<boolean> {
    await this.validateFrameworkIntegration();
    const { resource } = this.config.frameworkIntegration ?? {};

    const authorizationFunction = _exports[resource].authorizeDevice;
    if (!authorizationFunction) {
      throw new Error('Missing authorization function');
    }

    console.log('Calling custom authorization function');
    return await authorizationFunction(src, deviceIdentifier);
  }

  public async authorizeDevice(src: number, deviceIdentifier: string): Promise<boolean> {
    if (this.framework === 'standalone') {
      return await this.authorizeStandalone(src, deviceIdentifier);
    }

    if (this.framework === 'custom') {
      return await this.authorizeCustom(src, deviceIdentifier);
    }

    throw new Error('Missing framework handler');
  }
}

export default new AuthRepository();
