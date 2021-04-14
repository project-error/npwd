import Collection from '@discordjs/collection';
import { CallHistoryItem } from '../../../typings/call';
import { mainLogger } from '../sv_logger';
import CallsDB, { CallsRepo } from './calls.db';
import { v4 as uuidv4 } from 'uuid';
import PlayerService from '../players/player.service';

const callLogger = mainLogger.child({ module: 'calls' });

class CallsService {
  private callMap: Collection<string, CallHistoryItem>;
  private readonly callsDB: CallsRepo;

  constructor() {
    this.callMap = new Collection();
    this.callsDB = CallsDB;
  }

  async inititializeCall(src: number, receivingNumber: string) {
    // Create initial call data
    const startCallTimeUnix = new Date().getTime() / 1000;
    const callIdentifier = uuidv4();

    const receiverIdentifier = PlayerService.getIdentifier();
  }
}

export default new CallsService();
