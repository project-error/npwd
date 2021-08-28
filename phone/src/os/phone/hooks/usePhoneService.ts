import { useNuiEvent } from 'fivem-nui-react-lib';
import { useSetRecoilState } from 'recoil';
import { PhoneEvents } from '../../../../../typings/phone';
import { phoneState } from './state';
import { useApps } from '../../apps/hooks/useApps';
import { useCallback } from 'react';
import { useHistory } from 'react-router';

export const usePhoneService = () => {
  const { getApp } = useApps();
  const history = useHistory();

  const setVisibility = useSetRecoilState(phoneState.visibility);
  const setResourceConfig = useSetRecoilState(phoneState.resourceConfig);
  const setPhoneTime = useSetRecoilState(phoneState.phoneTime);

  const handleOpenApp = useCallback(
    (app: string) => {
      // In case user passes us a lowercase string, lets uppercase it as all app IDs are
      // uppercase
      const foundApp = getApp(app.toUpperCase());

      if (!foundApp) return console.error(`App "${app}" is an invalid app id to open`);
      history.push(foundApp.path);
    },
    [getApp, history],
  );

  useNuiEvent('PHONE', PhoneEvents.SET_VISIBILITY, setVisibility);
  useNuiEvent('PHONE', PhoneEvents.SET_CONFIG, setResourceConfig);
  useNuiEvent('PHONE', PhoneEvents.SET_TIME, setPhoneTime);
  useNuiEvent<string>('PHONE', PhoneEvents.OPEN_APP, handleOpenApp);
};
