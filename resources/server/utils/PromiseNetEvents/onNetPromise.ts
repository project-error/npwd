import { ErrorStringKeys } from '../../../../typings/phone';
import { getSource } from '../miscUtils';
import { PromiseResponse } from './PromiseResponse';
import { mainLogger } from '../../sv_logger';
import { CBSignature, PromiseRequest, PromiseRequestData } from './promise.types';

const netEventLogger = mainLogger.child({ module: 'events' });

export function onNetPromise<T>(eventName: string, cb: CBSignature<T>) {
  onNet(eventName, async (respEventName: string, data: PromiseRequestData<T>) => {
    const src = getSource();

    const promiseRequest: PromiseRequest<T> = {
      source: src,
      body: data,
    };

    // Lets hope GC can clean you up
    const promiseResp = new PromiseResponse(respEventName, src);

    // In case the cb is a promise, we use Promise.resolve
    Promise.resolve(cb(promiseRequest, promiseResp)).catch((e) => {
      netEventLogger.error(
        `An error occured for a onNetPromise (${eventName}), Error: ${e.message}`,
      );

      promiseResp.sendError({
        errorCode: ErrorStringKeys.SERVER_ERROR,
        message: 'An error occured on the server',
      });
    });
  });
}
