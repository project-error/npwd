import React from "react";
import { AppWrapper } from "../../../ui/components";
import { makeStyles } from "@material-ui/core";
import lightBlue from "@material-ui/core/colors/lightBlue";
import { AppTitle } from "../../../ui/components/AppTitle";
import { AppContent } from "../../../ui/components/AppContent";
import { useTranslation } from "react-i18next";
import { useContacts } from "../hooks/useContacts";

const useStyles = makeStyles(() => ({
  root: {
    backgroundColor: lightBlue[50],
  },
  title: {
    backgroundColor: lightBlue[300],
  },
}));

export const ContactsApp = () => {
  const classes = useStyles();
  const [contacts] = useContacts();
  const { t } = useTranslation();
  return (
    <AppWrapper className={classes.root}>
      <AppTitle className={classes.title}>{t("APPS_CONTACTS")}</AppTitle>
      <AppContent>{t("COMING_SOON")}</AppContent>
    </AppWrapper>
  );
};
