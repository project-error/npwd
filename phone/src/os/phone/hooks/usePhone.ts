import { IServerConfig } from '../../../common/typings/config';
import ServerConfig from '../../../config.autogen.json';

interface IUsePhone {
  config?: IServerConfig;
}

export const usePhone = (): IUsePhone => {
  return { config: ServerConfig as any };
};
