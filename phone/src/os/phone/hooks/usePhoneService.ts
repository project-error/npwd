import { useSetRecoilState } from 'recoil';
import { PhoneEvents } from '@typings/phone';
import { phoneState } from './state';
import { useApps } from '@os/apps/hooks/useApps';
import { useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { useSnackbar } from '@os/snackbar/hooks/useSnackbar';
import { useNuiEvent } from '@common/hooks/useNuiEvent';

export const usePhoneService = () => {
  const { getApp } = useApps();
  const { addAlert } = useSnackbar();
  const history = useHistory();

  const setVisibility = useSetRecoilState(phoneState.visibility);
  const setResourceConfig = useSetRecoilState(phoneState.resourceConfig);
  const setPhoneTime = useSetRecoilState(phoneState.phoneTime);
  const setIsPhoneDisabled = useSetRecoilState(phoneState.isPhoneDisabled);
  const setPlayerSource = useSetRecoilState(phoneState.playerSource);

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

  useNuiEvent('PHONE', PhoneEvents.ADD_SNACKBAR_ALERT, addAlert);
  useNuiEvent('PHONE', PhoneEvents.SET_VISIBILITY, setVisibility);
  useNuiEvent('PHONE', PhoneEvents.SET_CONFIG, setResourceConfig);
  useNuiEvent('PHONE', PhoneEvents.SET_TIME, setPhoneTime);
  useNuiEvent<string>('PHONE', PhoneEvents.OPEN_APP, handleOpenApp);
  useNuiEvent('PHONE', PhoneEvents.IS_PHONE_DISABLED, setIsPhoneDisabled);
  useNuiEvent('PHONE', PhoneEvents.SEND_PLAYER_SOURCE, setPlayerSource);
};
