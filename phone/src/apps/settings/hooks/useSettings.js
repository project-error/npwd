import Default from "../default.json";
import { useConfig } from "../../../config/hooks/useConfig";
import { atom } from "recoil";
import { createMuiTheme } from "@material-ui/core";

const settingsState = atom({
  key: "settings",
  default: Default,
});

export const useSettings = () => {
  const [settings, setSettings] = useConfig(settingsState);
  const [config] = useConfig();
  const currentTheme = () => createMuiTheme(config.themes[settings.theme]);
  return { settings, setSettings, currentTheme };
};
