import { useRecoilValue } from "recoil";
import { twitterState } from "./state";

export const useProfile = () => {
  const profile = useRecoilValue(twitterState.profile);
  return { profile };
};
