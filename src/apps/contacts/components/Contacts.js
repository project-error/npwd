import React from "react";
import { AppWrapper } from "../../../ui/components";
import { makeStyles } from "@material-ui/core";
import lightBlue from "@material-ui/core/colors/lightBlue";
import { AppTitle } from "../../../ui/components/AppTitle";
import { AppContent } from "../../../ui/components/AppContent";
import { useTranslation } from "react-i18next";
import { useContacts } from "../hooks/useContacts";
import { ContactList } from './ContactList';


const useStyles = makeStyles(() => ({
  root: {
    backgroundColor: '#232323',
  },
  title: {
    backgroundColor: lightBlue[300],
    textAlign: 'center'
  },
}));

export const ContactsApp = () => {
  const classes = useStyles();
  const { contactList } = useContacts();
  const { t } = useTranslation();
  return (
    <AppWrapper className={classes.root}>
      <AppTitle className={classes.title}>{t("APPS_CONTACTS")}</AppTitle>
      <AppContent>
        <ContactList contacts={contactList} onCall={() => console.log("Calling")} onMessage={() => console.log("Opening messages")}/>
      </AppContent>
    </AppWrapper>
  );
};
