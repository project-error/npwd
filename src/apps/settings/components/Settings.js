import React from "react";
import { AppWrapper } from "../../../ui/components";
import { makeStyles } from "@material-ui/core";
import { AppTitle } from "../../../ui/components/AppTitle";
import { AppContent } from "../../../ui/components/AppContent";
import { useTranslation } from "react-i18next";
import { grey } from "@material-ui/core/colors";

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
  return (
    <AppWrapper className={classes.root}>
      <AppTitle className={classes.title}>{t("APPS_SETTINGS")}</AppTitle>
      <AppContent>{t("COMING_SOON")}</AppContent>
    </AppWrapper>
  );
};
