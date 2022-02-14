import { OnMessageExportCtx } from '../../../../typings/messages';

const exp = global.exports;

export const OnMessageExportMap = new Map();

exp('onMessage', (phoneNumber: string, cb: (messageCtx: OnMessageExportCtx) => void) => {
  OnMessageExportMap.set(phoneNumber, cb);
});
