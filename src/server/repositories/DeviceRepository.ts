import { DBInstance } from '../database/knex';
import { Device, InsertDevice } from '../database/schemas/Device';

const tableName = 'tmp_phone_devices';

class DeviceRepository {
  public async getDevices(): Promise<Device[]> {
    return await DBInstance(tableName);
  }

  public async getDeviceById(deviceId: number): Promise<Device | null> {
    return await DBInstance(tableName).where('id', deviceId).first();
  }

  public async getDeviceByPhoneNumber(phoneNumber: string): Promise<Device | null> {
    return await DBInstance(tableName).where('phone_number', phoneNumber).first();
  }

  public async createDevice(device: InsertDevice): Promise<Device> {
    const [newId] = await DBInstance(tableName).insert(device);
    return await DBInstance(tableName).select('*').where('id', newId).first();
  }

  public async updateDevice(device: Device): Promise<Device> {
    await DBInstance(tableName).where('id', device.id).update(device);
    return await this.getDeviceById(device.id);
  }

  public async deleteDevice(deviceId: number): Promise<void> {
    await DBInstance(tableName).where('id', deviceId).delete();
  }
}

export default new DeviceRepository();
