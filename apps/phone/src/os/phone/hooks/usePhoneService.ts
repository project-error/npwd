import { useSetAtom } from 'jotai';
import { PhoneEvents } from '@typings/phone';
import { phoneState } from './state';
import { useApps } from '@os/apps/hooks/useApps';
import { useCallback } from 'react';
import { useNavigate } from 'react-router';
import { useSnackbar } from '@os/snackbar/hooks/useSnackbar';
import { useNuiEvent } from '@common/hooks/useNuiEvent';

export const usePhoneService = () => {
  const { getApp } = useApps();
  const { addAlert } = useSnackbar();
  const navigate = useNavigate();

  const setVisibility = useSetAtom(phoneState.visibility);
  const setResourceConfig = useSetAtom(phoneState.resourceConfig);
  const setPhoneTime = useSetAtom(phoneState.phoneTime);
  const setIsPhoneDisabled = useSetAtom(phoneState.isPhoneDisabled);
  const setPlayerSource = useSetAtom(phoneState.playerSource);
  const setIdentifier = useSetAtom(phoneState.playerIdentifier);

  const setPlayerIdentifier = (value: string) => {
    setIdentifier(value);
  };

  const handleOpenApp = useCallback(
    (app: string) => {
      // In case user passes us a lowercase string, lets uppercase it as all app IDs are
      // uppercase
      const foundApp = getApp(app.toUpperCase());

      if (!foundApp) return console.error(`App "${app}" is an invalid app id to open`);
      navigate(foundApp.path);
    },
    [getApp, navigate],
  );

  useNuiEvent('PHONE', PhoneEvents.ADD_SNACKBAR_ALERT, addAlert);
  useNuiEvent('PHONE', PhoneEvents.SET_VISIBILITY, setVisibility);
  useNuiEvent('PHONE', PhoneEvents.SET_CONFIG, setResourceConfig);
  useNuiEvent('PHONE', PhoneEvents.SET_TIME, setPhoneTime);
  useNuiEvent<string>('PHONE', PhoneEvents.OPEN_APP, handleOpenApp);
  useNuiEvent('PHONE', PhoneEvents.IS_PHONE_DISABLED, setIsPhoneDisabled);
  useNuiEvent('PHONE', PhoneEvents.SEND_PLAYER_SOURCE, setPlayerSource);
  useNuiEvent('PHONE', PhoneEvents.SEND_PLAYER_IDENTIFIER, setPlayerIdentifier);
};
