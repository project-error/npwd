import { useSetRecoilState } from "recoil";
import { phoneState } from "./state";
import { useNuiEvent } from "../../nui-events/hooks/useNuiEvent";
import { usePhone } from "./usePhone";

export const usePhoneService = () => {
  const setVisibility = useSetRecoilState(phoneState.visibility);
  useNuiEvent("PHONE", "setVisibility", setVisibility);
  return usePhone();
};
