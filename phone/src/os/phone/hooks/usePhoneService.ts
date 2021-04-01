import { useNuiEvent, useNuiRequest } from 'fivem-nui-react-lib';
import { useEffect } from 'react';
import { useSetRecoilState } from 'recoil';
import { PhoneEvents } from '../../../../../typings/phone';
import { phoneState } from './state';

export const usePhoneService = () => {
  const { send } = useNuiRequest();

  // Let client know UI is ready to accept events
  useEffect(() => {
    send(PhoneEvents.UI_IS_READY);
  }, [send]);

  const setVisibility = useSetRecoilState(phoneState.visibility);
  const setPhoneConfig = useSetRecoilState(phoneState.phoneConfig);
  const setPhoneReady = useSetRecoilState(phoneState.phoneReady);
  const setPhoneTime = useSetRecoilState(phoneState.phoneTime);
  useNuiEvent('PHONE', PhoneEvents.SET_VISIBILITY, setVisibility);
  useNuiEvent('PHONE', PhoneEvents.SET_PHONE_READY, setPhoneReady);
  useNuiEvent('PHONE', PhoneEvents.SET_CONFIG, setPhoneConfig);
  useNuiEvent('PHONE', PhoneEvents.SET_TIME, setPhoneTime);
};
