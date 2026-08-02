import Default from '../default.json';
import { atom, useAtom } from 'jotai';

const configState = atom(Default);

// This is NOT the resource config but instead the NUI specific config,
// this means that if there are changs to the config in `../default.json`,
// it will require a rebuild for those to take effect.
export const usePhoneConfig = (state: any = configState): any => {
  const [config, _setConfig] = useAtom(state);

  const setConfig = (key, value) => {
    _setConfig((oldConfig) => ({
      ...oldConfig,
      [key]: value,
    }));
    //setVal(key, value);
  };

  return [config, setConfig];
};
