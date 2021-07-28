import { useSetRecoilState } from 'recoil';
import { phoneState } from './state';

export const useConfig = (): void => {
  const setResourceConfig = useSetRecoilState(phoneState.resourceConfig);

  const resourceName = (window as any)?.GetParentResourceName() || 'npwd';
  fetch(`https://cfx-nui-${resourceName}/config.json`).then(async (res) => {
    const config = await res.json();
    setResourceConfig(config);
  });
};
