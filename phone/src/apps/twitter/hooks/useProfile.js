import { useRecoilValue } from "recoil";
import { twitterState } from "./state";

export const useProfile = () => {
  const profile = useRecoilValue(twitterState.profile);
  const updateInProgress = useRecoilValue(twitterState.updateProfileLoading);
  const updateSuccessful = useRecoilValue(twitterState.updateProfileSuccess);
  return { profile, updateInProgress, updateSuccessful };
};
