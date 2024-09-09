import { DBInstance } from '../database/knex';
import { SimCard, InsertSimCard } from '../database/schemas/SimCard';

const tableName = 'tmp_phone_sim_cards';

class SimCardRepository {
  public async getSimCards(): Promise<SimCard[]> {
    return await DBInstance(tableName);
  }

  public async getSimCardById(simCardId: number): Promise<SimCard | null> {
    return await DBInstance(tableName).where('id', simCardId).first();
  }

  public async getSimCardByPhoneNumber(phoneNumber: string): Promise<SimCard | null> {
    return await DBInstance(tableName).where('phone_number', phoneNumber).first();
  }

  public async createSimCard(simCard: InsertSimCard): Promise<SimCard> {
    const [newId] = await DBInstance(tableName).insert(simCard);
    return await DBInstance(tableName).select('*').where('id', newId).first();
  }

  public async updateSimCard(simCard: SimCard): Promise<SimCard> {
    await DBInstance(tableName).where('id', simCard.id).update(simCard);
    return await this.getSimCardById(simCard.id);
  }

  public async deleteSimCard(simCardId: number): Promise<void> {
    await DBInstance(tableName).where('id', simCardId).delete();
  }
}

export default new SimCardRepository();
