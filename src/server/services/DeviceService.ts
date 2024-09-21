import { DeviceAlreadyRegistered } from '../../shared/Errors';
import { Device } from '../../shared/Types';
import { InsertDevice } from '../database/schemas/Device';
import DeviceRepository from '../repositories/DeviceRepository';

class DeviceService {
  private readonly deviceRepository: typeof DeviceRepository;

  constructor(deviceRepository: typeof DeviceRepository) {
    this.deviceRepository = deviceRepository;
  }

  public async getDevices(): Promise<Device[]> {
    return this.deviceRepository.getDevices();
  }

  public async getDeviceBySid(simCardId: number): Promise<Device | null> {
    return this.deviceRepository.getDeviceBySid(simCardId);
  }

  public async getDeviceById(deviceId: number): Promise<Device | null> {
    return this.deviceRepository.getDeviceById(deviceId);
  }

  public async getDeviceByIdentifier(deviceIdentifier: string): Promise<Device | null> {
    return this.deviceRepository.getDeviceByIdentifier(deviceIdentifier);
  }

  public async createDevice(device: InsertDevice): Promise<Device> {
    try {
      return await this.deviceRepository.createDevice(device);
    } catch (error) {
      /** Check duplicate */
      if (error.code === 'ER_DUP_ENTRY') {
        throw new DeviceAlreadyRegistered();
      }

      console.log('Error', error);
      throw error;
    }
  }

  public async updateDevice(device: Device): Promise<Device> {
    return this.deviceRepository.updateDevice(device);
  }

  public async deleteDevice(deviceId: number): Promise<void> {
    return this.deviceRepository.deleteDevice(deviceId);
  }

  public async updateDeviceSettings(
    deviceId: number,
    settings: Record<string, unknown>,
  ): Promise<Device> {
    return this.deviceRepository.updateDeviceSettings(deviceId, settings);
  }
}

export default new DeviceService(DeviceRepository);
