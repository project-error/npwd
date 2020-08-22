import Default from "../default.json";
import { useConfig } from "../../../config/hooks/useConfig";
import { atom } from "recoil";

const settingsState = atom({
  key: "settings",
  default: Default,
});

export const useSettings = () => {
  const [settings, setSettings] = useConfig(settingsState);
  return { settings, setSettings };
};
