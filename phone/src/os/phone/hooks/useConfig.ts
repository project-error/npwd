import { useSetRecoilState } from 'recoil';
import { phoneState } from './state';
import { isEnvBrowser } from '../../../utils/misc';
import { useEffect } from 'react';
import { fetchConfig } from '@utils/config';

export const useConfig = (): void => {
  const setResourceConfig = useSetRecoilState(phoneState.resourceConfig);

  useEffect(() => {
    if (isEnvBrowser()) return;

    fetchConfig().then(setResourceConfig);
  }, [setResourceConfig]);
};
