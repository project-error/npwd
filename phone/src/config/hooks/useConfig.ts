import Default from '../default.json';
import { atom, useRecoilState } from 'recoil';

const configState = atom({
  key: 'config',
  default: Default,
});

export const useConfig = (state: any = configState): any => {
  const [config, _setConfig] = useRecoilState(state);

  const setConfig = (key, value) => {
    _setConfig((oldConfig) => ({
      ...oldConfig,
      [key]: value,
    }));
    //setVal(key, value);
  };

  return [config, setConfig];
};
