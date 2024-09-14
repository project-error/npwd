import { Device } from '../../shared/Types';
import { DBInstance } from '../database/knex';
import { InsertDevice } from '../database/schemas/Device';

const tableName = 'tmp_phone_device';

type ExtendedDevice =
  | (Device & {
      sim_card_id: number | null;
      phone_number: string | null;
      sim_card_is_active: boolean | null;
    })
  | null;

class DeviceRepository {
  public async getDevices(): Promise<Device[]> {
    return await DBInstance(tableName)
      .leftJoin('tmp_phone_sim_card', 'tmp_phone_device.sim_card_id', 'tmp_phone_sim_card.id')
      .select(
        'tmp_phone_device.*',
        'tmp_phone_sim_card.phone_number',
        'tmp_phone_sim_card.is_active as sim_card_is_active',
        'tmp_phone_sim_card.id as sim_card_id',
      );
  }

  public async getDeviceById(deviceId: number): Promise<ExtendedDevice> {
    return await DBInstance(tableName)
      .leftJoin('tmp_phone_sim_card', 'tmp_phone_device.sim_card_id', 'tmp_phone_sim_card.id')
      .where('tmp_phone_device.id', deviceId)
      .select(
        'tmp_phone_device.*',
        'tmp_phone_sim_card.phone_number',
        'tmp_phone_sim_card.is_active as sim_card_is_active',
        'tmp_phone_sim_card.id as sim_card_id',
      )
      .first();
  }

  public async getDeviceByIdentifier(identifier: string): Promise<ExtendedDevice | null> {
    return await DBInstance(tableName)
      .leftJoin('tmp_phone_sim_card', 'tmp_phone_device.sim_card_id', 'tmp_phone_sim_card.id')
      .where('identifier', identifier)
      .select(
        'tmp_phone_device.*',
        'tmp_phone_sim_card.phone_number',
        'tmp_phone_sim_card.is_active as sim_card_is_active',
        'tmp_phone_sim_card.id as sim_card_id',
      )
      .first();
  }

  public async getDeviceBySid(simCardId: number): Promise<Device | null> {
    return await DBInstance(tableName).where('sim_card_id', simCardId).first();
  }

  public async getDeviceByPhoneNumber(phoneNumber: string): Promise<Device | null> {
    return await DBInstance(tableName).where('phone_number', phoneNumber).first();
  }

  public async createDevice(device: InsertDevice): Promise<Device> {
    const [newId] = await DBInstance(tableName).insert(device);
    return this.getDeviceById(newId);
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
