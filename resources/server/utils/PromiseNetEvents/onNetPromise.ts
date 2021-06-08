import { getSource } from '../miscUtils';
import { mainLogger } from '../../sv_logger';
import { CBSignature, PromiseEventResp, PromiseRequest } from './promise.types';
import { ServerPromiseResp } from '../../../../typings/common';

const netEventLogger = mainLogger.child({ module: 'events' });

export function onNetPromise<T = any, P = any>(eventName: string, cb: CBSignature<T, P>): void {
  onNet(eventName, async (respEventName: string, data: T) => {
    const src = getSource();

    const promiseRequest: PromiseRequest<T> = {
      source: src,
      data,
    };

    const promiseResp: PromiseEventResp<P> = (data: ServerPromiseResp<P>) => {
      emitNet(respEventName, src, data);
      netEventLogger.debug(`Response Promise Event ${respEventName}, Data >>`);
      netEventLogger.debug(data);
    };

    // In case the cb is a promise, we use Promise.resolve
    Promise.resolve(cb(promiseRequest, promiseResp)).catch((e) => {
      netEventLogger.error(
        `An error occured for a onNetPromise (${eventName}), Error: ${e.message}`,
      );

      promiseResp({ status: 'error', errorMsg: 'Server error occurred' });
    });
  });
}
