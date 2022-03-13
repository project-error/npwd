import { useSetRecoilState } from 'recoil';
import { phoneState } from './state';
import { isEnvBrowser } from '../../../utils/misc';
import { useEffect } from 'react';
import { fetchConfig } from '@utils/config';
import DefaultConfig from '../../../../../config.json';

export const useConfig = (): void => {
  const setResourceConfig = useSetRecoilState(phoneState.resourceConfig);

  useEffect(() => {
    // @ts-ignore
    if (isEnvBrowser()) return setResourceConfig(DefaultConfig);

    fetchConfig().then(setResourceConfig);
  }, [setResourceConfig]);
};
