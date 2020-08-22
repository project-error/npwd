import React from "react";
import { AppWrapper } from "../../../ui/components";
import { List, ListItem, ListItemText } from "@material-ui/core";
import { AppTitle } from "../../../ui/components/AppTitle";
import { AppContent } from "../../../ui/components/AppContent";
import { useTranslation } from "react-i18next";
import { useContextMenu } from "../../../ui/hooks/useContextMenu";
import { useConfig } from "../../../config/hooks/useConfig";
import { useSettings } from "../hooks/useSettings";
import { useApps } from "../../appmarket/hooks/useApps";

export const SettingsApp = () => {
  const { t } = useTranslation();
  const [config] = useConfig();
  const { getApp } = useApps();
  const { setSettings, settings } = useSettings();

  const wallpaperOptions = config.wallpapers.map((w) => ({
    label: w,
    key: w,
    onClick: () => setSettings("wallpaper", w),
  }));

  const [openMenu, closeMenu, ContextMenu, isMenuOpen] = useContextMenu(
    wallpaperOptions
  );
  return (
    <AppWrapper>
      <AppTitle color={getApp("settings").backgroundColor}>{t("APPS_SETTINGS")}</AppTitle>
      <AppContent backdrop={isMenuOpen} onClickBackdrop={closeMenu}>
        <List>
          <ListItem onClick={openMenu} button>
            <ListItemText primary={t("APPS_SETTINGS_OPTIONS_WALLPAPER")} secondary={settings.wallpaper} />
          </ListItem>
        </List>
      </AppContent>
      <ContextMenu />
    </AppWrapper>
  );
};
