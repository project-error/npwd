import { useRecoilValue } from 'recoil';
import { phoneState } from './state';
import { IServerConfig } from '../../../common/typings/config';
import ServerConfig from '../../../config.autogen.json';

interface IUsePhone {
  visibility: boolean;
  config?: IServerConfig;
}

export const usePhone = (): IUsePhone => {
  const visibility = useRecoilValue(phoneState.visibility);
  return { visibility, config: ServerConfig as any };
};
