import { PhoneNumberAlreadyRegisteredError } from '../../shared/Errors';
import { SimCard } from '../../shared/Types';
import { InsertSimCard } from '../database/schemas/SimCard';
import SimCardRepository from '../repositories/SimCardRepository';

class SimCardService {
  private readonly simCardRepository: typeof SimCardRepository;

  constructor(simCardRepository: typeof SimCardRepository) {
    this.simCardRepository = simCardRepository;
  }

  public async getSimCards(): Promise<SimCard[]> {
    return this.simCardRepository.getSimCards();
  }

  public async getSimCardById(simCardId: number): Promise<SimCard | null> {
    return this.simCardRepository.getSimCardById(simCardId);
  }

  public async createSimCard(simCard: InsertSimCard): Promise<SimCard> {
    try {
      return await this.simCardRepository.createSimCard(simCard);
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new PhoneNumberAlreadyRegisteredError();
      }
    }
  }

  public async updateSimCard(simCard: SimCard): Promise<SimCard> {
    return this.simCardRepository.updateSimCard(simCard);
  }

  public async deleteSimCard(simCardId: number): Promise<void> {
    return this.simCardRepository.deleteSimCard(simCardId);
  }
}

export default new SimCardService(SimCardRepository);
