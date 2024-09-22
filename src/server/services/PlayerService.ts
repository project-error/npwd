import { DeviceNotFoundError, UnauthorizedError } from '../../shared/Errors';
import AuthRepository from '../repositories/AuthRepository';
import DeviceRepository from '../repositories/DeviceRepository';
import SimCardRepository from '../repositories/SimCardRepository';

class PlayerService {
  private readonly simCardRepository: typeof SimCardRepository;
  private readonly deviceRepository: typeof DeviceRepository;

  constructor(
    simCardRepository: typeof SimCardRepository,
    deviceRepository: typeof DeviceRepository,
  ) {
    this.simCardRepository = simCardRepository;
    this.deviceRepository = deviceRepository;
  }

  deviceMap: Map<number, string> = new Map();

  public async authorizeDevice(src: number, deviceIdentifier: string): Promise<boolean> {
    return await AuthRepository.authorizeDevice(src, deviceIdentifier);
  }

  public async selectDevice(src: number, deviceIdentifier: string) {
    console.log(`Selecting device for ${src}: ${deviceIdentifier}`);
    const isAuthorized = await this.authorizeDevice(src, deviceIdentifier);

    if (!isAuthorized) {
      throw new UnauthorizedError();
    }

    /** Check if device ID exists */
    const device = await this.deviceRepository.getDeviceByIdentifier(deviceIdentifier);

    if (!device) {
      throw new DeviceNotFoundError();
    }

    this.deviceMap.set(src, deviceIdentifier);
  }

  public getDevice(src: number) {
    return this.deviceMap.get(src);
  }

  public async getDevices() {
    return Array.from(this.deviceMap.values());
  }

  private async getDeviceBySid(sid: number) {
    return await this.simCardRepository.getSimCardWithDeviceById(sid);
  }

  private getSourceFromDeviceIdentifier(deviceIdentifier: string): number | undefined {
    const sources = Array.from(this.deviceMap.keys());

    let _source: number | undefined = undefined;
    for (const source of sources) {
      const device = this.deviceMap.get(source);

      if (device === deviceIdentifier) {
        _source = source;
        return source;
      }
    }

    return _source;
  }

  public async getSourceFromSid(sid: number) {
    const simCard = await this.getDeviceBySid(sid);
    return this.getSourceFromDeviceIdentifier(simCard.deviceIdentifier);
  }

  public async getSourceFromDevice(deviceIdentifier: string) {
    return this.getSourceFromDeviceIdentifier(deviceIdentifier);
  }
}

export default new PlayerService(SimCardRepository, DeviceRepository);
