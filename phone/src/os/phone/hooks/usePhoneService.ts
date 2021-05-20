import { useNuiEvent, useNuiRequest } from 'fivem-nui-react-lib';
import { useSetRecoilState } from 'recoil';
import { PhoneEvents } from '../../../../../typings/phone';
import { phoneState } from './state';
import { useEffect } from 'react';

export const usePhoneService = () => {
  const { send } = useNuiRequest();

  // Let client know UI is ready to accept events
  useEffect(() => {
    send(PhoneEvents.UI_IS_READY);
  }, [send]);

  const setVisibility = useSetRecoilState(phoneState.visibility);
  const setResourceConfig = useSetRecoilState(phoneState.resourceConfig);
  //const setPhoneReady = useSetRecoilState(phoneState.phoneReady);
  const setPhoneTime = useSetRecoilState(phoneState.phoneTime);
  //useNuiEvent('PHONE', PhoneEvents.SET_PHONE_READY, setPhoneReady);
  useNuiEvent('PHONE', PhoneEvents.SET_VISIBILITY, setVisibility);
  useNuiEvent('PHONE', PhoneEvents.SET_CONFIG, setResourceConfig);
  useNuiEvent('PHONE', PhoneEvents.SET_TIME, setPhoneTime);
};
