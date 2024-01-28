import {
  ActiveCall,
  CallMiddlewareInvokable,
  IncomingCallerCtx,
  InitializeCallDTO,
  OnCallExportCtx, OnCallStatus
} from "@typings/call";
import OncallService from './oncall.service';
import MessagesService from '../../messages/messages.service';
import CallService from '../calls.service';
import { callLogger } from '../calls.utils';
import { PromiseEventResp, PromiseRequest } from '../../lib/PromiseNetEvents/promise.types';

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
exp('onCall', (tgtNumber: string, cb: CallMiddlewareInvokable) => {
  const resourceName = GetInvokingResource()
  const handler = new CallMiddleware(cb, resourceName, tgtNumber.toString())
  callLogger.debug(`Resource [${resourceName}] registered an onCall handler for number [${tgtNumber}]`)
  OncallService.addHandler(handler)
});

export class CallMiddleware {
  constructor(
    private funcRef: CallMiddlewareInvokable,
    public hostResource: string,
    public target: string,
  ) {}

  invoke(
    incomingCaller: IncomingCallerCtx,
    reqObj: PromiseRequest<InitializeCallDTO>,
    resp: PromiseEventResp<ActiveCall>,
  ) {
    return new Promise<OnCallStatus>((resolve, reject) =>
      this.funcRef({
        receiverNumber: reqObj.data.receiverNumber,
        incomingCaller,
        next: () => {
          resolve(OnCallStatus.NEXT);
          return;
        },
        exit: () => {
          reject();
          return;
        },
        reply: (message) => {
          MessagesService.handleEmitMessage({
            senderNumber: reqObj.data.receiverNumber,
            targetNumber: incomingCaller.number,
            message,
          });
        },
        forward: (receiverNumber: string, isAnonymous = false) => {
          CallService.handleInitializeCall(
            { ...reqObj, data: { receiverNumber, isAnonymous } },
            resp,
          )
            .catch((e) => {
              resp({ status: 'error', errorMsg: 'SERVER_ERROR' });
              callLogger.error(`Error occured handling init call: ${e.message}`);
            })
            .then(() => {
              resolve(OnCallStatus.FORWARD)
              return;
            })
            .catch(reject);
        },
      }),
    );
  }
}

on("onResourceStop", (resource: string) => {
  OncallService.resetResource(resource)
})
