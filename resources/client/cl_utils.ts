import { uuidv4 } from '../utils/fivem';
import { ClUtils } from './client';

interface ISettings {
  promiseTimeout: number;
}

interface ISettingsParams {
  promiseTimeout?: number;
}

export default class ClientUtils {
  private _settings: ISettings;
  private _defaultSettings: ISettings = {
    promiseTimeout: 15000,
  };

  constructor(settings?: ISettingsParams) {
    this.setSettings(settings);
  }

  public setSettings(settings: ISettingsParams) {
    this._settings = {
      ...this._defaultSettings,
      ...settings,
    };
  }

  public emitNetPromise<T = any>(eventName: string, ...args: any[]): Promise<T> {
    return new Promise((resolve, reject) => {
      let hasTimedOut = false;

      setTimeout(() => {
        hasTimedOut = true;
        reject(`${eventName} has timed out after ${this._settings.promiseTimeout} ms`);
      }, this._settings.promiseTimeout);

      // Have to use this as the regular uuid refused to work here for some
      // fun reason
      const uniqId = uuidv4();

      const listenEventName = `${eventName}:${uniqId}`;

      emitNet(eventName, listenEventName, ...args);

      const handleListenEvent = (data: T) => {
        removeEventListener(listenEventName, handleListenEvent);
        if (hasTimedOut) return;
        resolve(data);
      };
      onNet(listenEventName, handleListenEvent);
    });
  }
}

type CallbackFn<T> = (data: T, cb: Function) => void;

/**
 * A wrapper for handling NUI Callbacks
 *  @param event - The event name to listen for
 *  @param callback - The callback function
 */
export const RegisterNuiCB = <T = any>(event: string, callback: CallbackFn<T>) => {
  RegisterNuiCallbackType(event);
  on(`__cfx_nui:${event}`, callback);
};

/**
 *  Will Register an NUI event listener that will immediately
 *  proxy to a server side event of the same name and wait
 *  for the response.
 *  @param event - The event name to listen for
 */
export const RegisterNuiProxy = (event: string) => {
  RegisterNuiCallbackType(event);
  on(`__cfx_nui:${event}`, async (data: unknown, cb: Function) => {
    try {
      const res = await ClUtils.emitNetPromise(event, data);
      cb(res);
    } catch (e) {
      console.error('Error encountered while listening to resp. Error:', e);
      cb({ err: e });
    }
  });
};

type WrapperNetEventCb = <T extends any[]>(...args: T) => void;

/**
 * Wrapped onNet so we can use generic types on return values from server
 * @param event - The event name to listen to
 * @param cb - The callback function to execute
 */
export const onNpwdEvent = (event: string, cb: WrapperNetEventCb) => {
  onNet(event, cb);
};
