import React from "react";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import ContactsIcon from "@material-ui/icons/Contacts";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      height: "60px",
      width: "100%",
      display: "flex",
      flexFlow: "row nowrap",
      justifyContent: "center",
      alignItems: "center",
      background: "#424242",
    },
    icon: {
      color: "#fff",
      fontSize: 30,
    },
  })
);

export const ContactTitle = () => {
  const classes = useStyles();
  return (
    <Paper className={classes.root} square variant="outlined" elevation={24}>
      <ContactsIcon className={classes.icon} />
    </Paper>
  );
};
