import { useRecoilValue, useSetRecoilState } from 'recoil';
import { phoneState } from './state';
import { isEnvBrowser } from '../../../utils/misc';
import { useEffect } from 'react';
import { fetchConfig } from '@utils/config';
import DefaultConfig from '../../../../../config.default.json';
import { ResourceConfig } from '@typings/config';

export const useConfig = (): ResourceConfig => {
  const setResourceConfig = useSetRecoilState(phoneState.resourceConfig);
  const resourceConfigValue = useRecoilValue(phoneState.resourceConfig);

  useEffect(() => {
    // @ts-ignore
    if (isEnvBrowser()) return setResourceConfig(DefaultConfig);

    fetchConfig().then(setResourceConfig);
  }, [setResourceConfig]);

  return resourceConfigValue;
};
