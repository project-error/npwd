let isPhoneOpenState = false;

RegisterCommand(
  'npwd-toggle-phone',
  () => {
    if (isPhoneOpenState) {
      isPhoneOpenState = false;
      global.SendNUIMessage({ type: 'SET_PHONE_OPEN', payload: false });
      SetNuiFocus(false, false);
    } else {
      isPhoneOpenState = true;
      global.SendNUIMessage({ type: 'SET_PHONE_OPEN', payload: true });
      SetNuiFocus(true, true);
    }
  },
  false,
);

RegisterKeyMapping('npwd-toggle-phone', 'Open Phone', 'keyboard', 'M');
