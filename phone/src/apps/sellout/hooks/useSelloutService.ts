import { useNuiEvent } from "../../../os/nui-events/hooks/useNuiEvent";
import { selloutState } from "./state";
import { useListing } from "./useListing";
import { useSetRecoilState } from "recoil";

export const useSelloutService = () => {
  const setSellout = useSetRecoilState(selloutState.listing);
  useNuiEvent("SELLOUT", "setListings", setSellout);
  return useListing();
};
