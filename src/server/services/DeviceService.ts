import { Device, InsertDevice } from '../database/schemas/Device';
import DeviceRepository from '../repositories/DeviceRepository';

class DeviceService {
  private readonly deviceRepository: typeof DeviceRepository;

  constructor(deviceRepository: typeof DeviceRepository) {
    this.deviceRepository = deviceRepository;
  }

  public async getDevices(): Promise<Device[]> {
    return this.deviceRepository.getDevices();
  }

  public async getDeviceById(deviceId: number): Promise<Device | null> {
    return this.deviceRepository.getDeviceById(deviceId);
  }

  public async createDevice(device: InsertDevice): Promise<Device> {
    return this.deviceRepository.createDevice(device);
  }

  public async updateDevice(device: Device): Promise<Device> {
    return this.deviceRepository.updateDevice(device);
  }

  public async deleteDevice(deviceId: number): Promise<void> {
    return this.deviceRepository.deleteDevice(deviceId);
  }
}

export default new DeviceService(DeviceRepository);
