import { useRecoilValue, useRecoilState } from "recoil";
import { twitterState } from "./state";

export const useProfile = () => {
  const profile = useRecoilValue(twitterState.profile);
  const updateInProgress = useRecoilValue(twitterState.updateProfileLoading);
  const [updateSuccessful, setUpdateSuccessful] = useRecoilState(
    twitterState.updateProfileSuccess
  );
  return { profile, updateInProgress, updateSuccessful, setUpdateSuccessful };
};
