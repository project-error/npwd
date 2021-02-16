import { uuidv4 } from '../utils/fivem';

interface ISettings {
  promiseTimeout: number;
}

interface ISettingsParams {
  promiseTimeout?: number;
}

export default class ClientUtils {
  private _settings: ISettings;
  private _defaultSettings: ISettings = {
    promiseTimeout: 5000,
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

  public emitNetPromise<T = any>(
    eventName: string,
    ...args: any[]
  ): Promise<T> {
    return new Promise((resolve, reject) => {
      let hasTimedOut = false;

      setTimeout(() => {
        hasTimedOut = true;
        reject(
          `${eventName} has timed out after ${this._settings.promiseTimeout} ms`
        );
      }, this._settings.promiseTimeout);

      // Have to use this as the regular uuid refused to work here for some
      // fun reason
      const uniqId = uuidv4();

      const listenEventName = `${eventName}:${uniqId}`;

      emitNet(eventName, listenEventName, ...args);

      const handleListenEvent = (data: T, err: unknown) => {
        removeEventListener(listenEventName, handleListenEvent);
        if (hasTimedOut) return;
        if (err) reject(err);
        resolve(data);
      };
      onNet(listenEventName, handleListenEvent);
    });
  }
}
