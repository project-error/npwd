import { useSetRecoilState } from 'recoil';
import { phoneState } from './state';
import { getResourceName, isEnvBrowser } from '../../../utils/misc';
import { useEffect } from 'react';

export const useConfig = (): void => {
  const setResourceConfig = useSetRecoilState(phoneState.resourceConfig);

  useEffect(() => {
    if (isEnvBrowser()) return;
    const resourceName = getResourceName();
    fetch(`https://cfx-nui-${resourceName}/config.json`).then(async (res) => {
      const config = await res.json();
      setResourceConfig(config);
    });
  }, [setResourceConfig]);
};
