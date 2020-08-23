import React from "react";
import { AppWrapper } from "../../../ui/components";
import { ListItemText, Divider } from "@material-ui/core";
import { AppTitle } from "../../../ui/components/AppTitle";
import { AppContent } from "../../../ui/components/AppContent";
import { useTranslation } from "react-i18next";
import {
  useContextMenu,
  MapStringOptions,
} from "../../../ui/hooks/useContextMenu";
import { useConfig } from "../../../config/hooks/useConfig";
import { useSettings } from "../hooks/useSettings";
import { useApps } from "../../appmarket/hooks/useApps";
import { List } from "../../../ui/components/List";
import { ListItem } from "../../../ui/components/ListItem";
import { useSimcard } from "../../../os/simcard/hooks/useSimcard";

export const SettingItem = ({ options, label, value, onClick }) => {
  return (
    <>
      <ListItem onClick={() => onClick(options)} button>
        <ListItemText primary={label} secondary={value} />
      </ListItem>
      <Divider />
    </>
  );
};

export const SettingsApp = () => {
  const { t } = useTranslation();
  const [config] = useConfig();
  const { getApp } = useApps();
  const { setSettings, settings } = useSettings();
  const simcard = useSimcard(); 

  const wallpapers = config.wallpapers.map(
    MapStringOptions(settings.wallpaper, (val) => setSettings("wallpaper", val))
  );
  const frames = config.frames.map(
    MapStringOptions(settings.frame, (val) => setSettings("frame", val))
  );
  const themes = Object.keys(config.themes).map(
    MapStringOptions(settings.theme, (val) => setSettings("theme", val))
  );

  const [openMenu, closeMenu, ContextMenu, isMenuOpen] = useContextMenu();
  return (
    <AppWrapper>
      <AppTitle color={getApp("settings").backgroundColor}>
        {t("APPS_SETTINGS")}
      </AppTitle>
      <AppContent backdrop={isMenuOpen} onClickBackdrop={closeMenu}>
        <List>
          <SettingItem
            label="Theme"
            value={settings.theme}
            options={themes}
            onClick={openMenu}
          />
          <SettingItem
            label="Wallpaper"
            value={settings.wallpaper}
            options={wallpapers}
            onClick={openMenu}
          />
          <SettingItem
            label="Frame"
            value={settings.frame}
            options={frames}
            onClick={openMenu}
          />
          <SettingItem
            label="Phone Number"
            value={simcard.number}
          />
        </List>
      </AppContent>
      <ContextMenu />
    </AppWrapper>
  );
};
