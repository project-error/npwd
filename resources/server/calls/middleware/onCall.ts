import { OnCallExportCtx } from '../../../../typings/call';

const exp = global.exports;

export const OnCallMap = new Map<string, (ctx: OnCallExportCtx) => void>();

/*
    Will add middleware for targeted numbers with the following context:
    interface IncomingCallerCtx {
        source: number;
        number: string;
        name: string;
    }

    export interface OnCallExportCtx {
      incomingCaller: IncomingCallerCtx;
      exit: () => void;
      next: () => void;
      reply: (msg: string) => void;
      forward: (tgt: string) => void;
    }
 */
exp('onCall', (tgtNumber: string, cb: (ctx: OnCallExportCtx) => void) => {
  OnCallMap.set(tgtNumber, cb);
});
