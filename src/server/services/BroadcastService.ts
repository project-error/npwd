import { RouterContext } from 'fivem-router';
import PlayerService from './PlayerService';
import { parseObjectToIsoString } from '../utils/date';
import { InsertNotification } from '../../shared/Types';

interface EmitToNuiParams {
  ctx: RouterContext;
  sid: number;
  event: string;
  data: unknown;
}

interface EmitToNuisParams extends Omit<EmitToNuiParams, 'sid'> {
  sidList: number[];
}

class BroadcastService {
  constructor() {}

  private emitNet(event: string, source: number, data: string) {
    emitNet(event, source, data);
  }

  private async getSourceFromSid(sid: number) {
    return await PlayerService.getSourceFromSid(sid);
  }

  public async emitToNui({ sid, ctx, data, event }: EmitToNuiParams) {
    const src = await this.getSourceFromSid(sid);
    if (!src) {
      console.error(`Failed to get source from sid: ${sid}`);
      console.error('They may have disconnected.');
      return;
    }
    ctx.emitToNui(src, event, parseObjectToIsoString(data));
  }

  public async emitToNuis({ sidList, ctx, data, event }: EmitToNuisParams) {
    for (const sid of sidList) {
      const src = await this.getSourceFromSid(sid);
      if (!src) {
        console.error(`Failed to get source from sid: ${sid}`);
        console.error('They may have disconnected.');
        continue;
      }
      ctx.emitToNui(src, event, parseObjectToIsoString(data));
    }
  }

  public async createNotification(source: number, notification: InsertNotification) {
    this.emitNet('npwd:create-notification', source, JSON.stringify(notification));
  }
}

export default new BroadcastService();
