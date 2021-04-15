import { FxServerRespError } from '../../../../typings/phone';
import { JSONLike, PromiseRespStatus, RawDataResp } from './promise.types';
import { netEventLogger } from './utils';
import { config } from '../../server';

// Meh temp maybe not idk.
interface PromiseRespDebug {
  /* Start time returned by process.hrtime()*/
  started: [number, number];
}

export class PromiseResponse {
  public readonly respEventName: string;
  public readonly source: number;
  private promiseRespDebug: PromiseRespDebug;
  protected responseData: RawDataResp;

  /**
   * Create a new promise response context for use in the onNetPrommise,
   * callback argument
   *
   * @param respEventName - The response event name to emit to on resp.send()
   * @param source - The source of the player to emit back to
   */
  constructor(respEventName: string, source: number) {
    this.respEventName = respEventName;
    this.source = source;

    this.promiseRespDebug = {
      started: process.hrtime(),
    };

    this.responseData = {
      body: {},
      status: 'in-progress',
    };
  }

  /**
   * Will emit back to the client with the data assigned using
   * `setData`. Will send all data assigned to the this.responseData
   * back to the client to resolve the promise.
   *
   * @return void
   */
  public send(obj: JSONLike): void {
    this.responseData.body = obj;
    this.responseData.status = 'success';
    emitNet(this.respEventName, this.source, this.responseData);

    if (config.debug.level === 'silly') {
      // Debug time data
      const hrEnd = process.hrtime(this.promiseRespDebug.started);
      // Divide by good old 1 x 10^6
      const nanoToMicro = hrEnd[1] / 1e6;
      const secondExec = hrEnd[0];

      netEventLogger.silly(`Promise emitted to client after ${secondExec}s ${nanoToMicro}ms`);
    }
  }

  /**
   * Will change the status field present on promiseResponses, this doesn't
   * really have a use for now except metadata
   *
   * @return void
   */

  public setStatus(status: PromiseRespStatus): this {
    this.responseData.status = status;
    return this;
  }

  /**
   * Will emit back to the client with the data assigned using
   * `setData`. Will send all data assigned to the this.responseData
   * back to the client to resolve the promise.
   *
   * @return void
   */
  public sendError({ errorCode, message }: FxServerRespError): void {
    this.responseData = {
      error: {
        errorCode,
        message,
      },
      body: {},
      status: 'error',
    };
  }
}
