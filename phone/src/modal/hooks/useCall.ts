import { useRecoilValue } from "recoil";
import { callerState } from "./state";

export const useCall = () => {
  const caller = useRecoilState(callerState.caller);
  return { caller };
};
