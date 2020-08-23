import { useNuiEvent } from "../../nui-events/hooks/useNuiEvent";
import { useSetRecoilState } from "recoil";
import { simcardState } from "./state";

export const useSimcardService = () => {
  const setNumber = useSetRecoilState(simcardState.number);
  useNuiEvent("simcard", "setNumber", (data) => {
    setNumber(data);
  });
};
