import { useRecoilValue } from "recoil";
import { selloutState } from "./state";

export const useListing = () => {
  const listing = useRecoilValue(selloutState.listing);
  return { listing };
};
