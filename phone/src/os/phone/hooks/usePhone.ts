import { useRecoilState } from 'recoil';
import { phoneState } from './state';
import { IServerConfig } from '../../../common/typings/config';
import ServerConfig from '../../../config.autogen.json';

interface IUsePhone {
  visibility: boolean;
  setVisibility(v: boolean): void;
  config?: IServerConfig;
}

export const usePhone = (): IUsePhone => {
  const [visibility, setVisibility] = useRecoilState(phoneState.visibility);
  return { visibility, setVisibility, config: ServerConfig as any };
};
