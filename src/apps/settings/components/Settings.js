import React from "react";
import { AppWrapper } from "../../../ui/components";
import { makeStyles, List, ListItem } from "@material-ui/core";
import { AppTitle } from "../../../ui/components/AppTitle";
import { AppContent } from "../../../ui/components/AppContent";
import { useTranslation } from "react-i18next";
import { grey } from "@material-ui/core/colors";
import { useContextMenu } from "../../../ui/hooks/useContextMenu";
import { useConfig } from "../../../config/hooks/useConfig";
import { useSettings } from "../hooks/useSettings";

const useStyles = makeStyles(() => ({
  root: {
    backgroundColor: grey[50],
  },
  title: {
    backgroundColor: grey[600],
  },
}));

export const SettingsApp = () => {
  const classes = useStyles();
  const { t } = useTranslation();
  const [config] = useConfig();
  const { setSettings } = useSettings();

  const wallpaperOptions = config.wallpapers.map((w) => ({
    label: w,
    onClick: () => setSettings("wallpaper", w),
  }));

  const [openMenu, closeMenu, ContextMenu, isMenuOpen] = useContextMenu(
    wallpaperOptions
  );
  return (
    <AppWrapper className={classes.root}>
      <AppTitle className={classes.title}>{t("APPS_SETTINGS")}</AppTitle>
      <AppContent backdrop={isMenuOpen} onClickBackdrop={closeMenu}>
        <List>
          <ListItem onClick={openMenu} button>
            {t("APPS_SETTINGS_OPTIONS_WALLPAPER")}
          </ListItem>
        </List>
      </AppContent>
      <ContextMenu />
    </AppWrapper>
  );
};
