import { useRecoilValue, useRecoilState } from "recoil";
import { twitterState } from "./state";

export const useProfile = () => {
  const profile = useRecoilValue(twitterState.profile);
  const updateProfileLoading = useRecoilValue(
    twitterState.updateProfileLoading
  );
  const [updateProfileSuccessful, setUpdateProfileSuccessful] = useRecoilState(
    twitterState.updateProfileSuccess
  );
  return {
    profile,
    updateProfileLoading,
    updateProfileSuccessful,
    setUpdateProfileSuccessful,
  };
};
