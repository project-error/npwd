import { useRecoilValue } from "recoil";
import { phoneState } from "./state";

export const usePhone = () => {
  const visibility = useRecoilValue(phoneState.visibility);
  const config = useRecoilValue(phoneState.phoneConfig);
  return { visibility, config };
};
