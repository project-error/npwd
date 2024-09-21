import { InsertNotification } from '../../shared/Types';
import BroadcastService from '../services/BroadcastService';

const _exports = global.exports;

_exports('createNotification', (src: number, notification: InsertNotification) => {
  BroadcastService.createNotification(src, notification);
});
