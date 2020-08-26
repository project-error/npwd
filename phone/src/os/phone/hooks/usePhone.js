import { useRecoilValue } from "recoil";
import { phoneState } from "./state";

export const usePhone = () => {
  const visibility = useRecoilValue(phoneState.visibility);
  const powerOff = useRecoilValue(phoneState.powerOff);
  return { visibility, powerOff };
};
