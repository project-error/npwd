import { getSource } from '../miscUtils';
import { mainLogger } from '../../sv_logger';
import { CBSignature, PromiseEventReturnFunc, PromiseRequest } from './promise.types';

const netEventLogger = mainLogger.child({ module: 'events' });

export function onNetPromise<T>(eventName: string, cb: CBSignature<T>): void {
  onNet(eventName, async (respEventName: string, data: T) => {
    const src = getSource();

    const promiseRequest: PromiseRequest<T> = {
      source: src,
      data,
    };

    const promiseResp: PromiseEventReturnFunc = (data: unknown) => {
      emitNet(respEventName, src, data);
      netEventLogger.debug(`Response Promise Event ${respEventName}, Data >>`);
      netEventLogger.debug(data);
    };

    // In case the cb is a promise, we use Promise.resolve
    Promise.resolve(cb(promiseRequest, promiseResp)).catch((e) => {
      netEventLogger.error(
        `An error occured for a onNetPromise (${eventName}), Error: ${e.message}`,
      );

      promiseResp({ err: true, errMsg: 'Server error occurred' });
    });
  });
}
