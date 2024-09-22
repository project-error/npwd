import { InsertNotification } from '../../shared/Types';
import BroadcastService from '../services/BroadcastService';

const _exports =
  typeof global.exports === 'function'
    ? global.exports
    : (exportName: string) => {
        console.log(`Creating export: ${exportName}`);
      };

_exports('createNotification', (src: number, notification: InsertNotification) => {
  BroadcastService.createNotification(src, notification);
});
