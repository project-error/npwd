import { useAtomValue, useSetAtom } from 'jotai';
import { phoneState } from './state';
import { isEnvBrowser } from '../../../utils/misc';
import { useEffect } from 'react';
import { fetchConfig } from '@utils/config';
import DefaultConfig from '../../../../../../config.default.json';
import { ResourceConfig } from '@typings/config';

export const useConfig = (): ResourceConfig => {
  const setResourceConfig = useSetAtom(phoneState.resourceConfig);
  const resourceConfigValue = useAtomValue(phoneState.resourceConfig);

  useEffect(() => {
    // @ts-ignore
    if (isEnvBrowser()) return setResourceConfig(DefaultConfig);

    fetchConfig().then(setResourceConfig);
  }, [setResourceConfig]);

  return resourceConfigValue;
};
