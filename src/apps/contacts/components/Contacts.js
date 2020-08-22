import React from "react";
import { AppWrapper } from "../../../ui/components";
import { makeStyles } from "@material-ui/core";
import lightBlue from "@material-ui/core/colors/lightBlue";
import { AppTitle } from "../../../ui/components/AppTitle";
import { AppContent } from "../../../ui/components/AppContent";

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
  return (
    <AppWrapper className={classes.root}>
        <AppTitle className={classes.title}>Contacts</AppTitle>
        <AppContent>
            Coming soon...
        </AppContent>
    </AppWrapper>
  );
};
