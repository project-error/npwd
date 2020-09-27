// intended for use on initial application loads
import React from "react";
import { makeStyles } from "@material-ui/core";
import TwitterIcon from "@material-ui/icons/Twitter";
import { AppWrapper } from "../../../ui/components";
import { AppContent } from "../../../ui/components/AppContent";

const useStyles = makeStyles((theme) => ({
  root: {
    height: "100%",
    width: "100%",
    display: "flex",
    flexFlow: "row nowrap",
    justifyContent: "center",
    alignItems: "center",
  },
  icon: {
    color: "#00acee",
    fontSize: "100px",
  },
}));

export const TwitterLoader = () => {
  const classes = useStyles();
  return (
    <AppWrapper id="twitter-app">
      <AppContent>
        <div className={classes.root}>
          <TwitterIcon className={classes.icon} />
        </div>
      </AppContent>
    </AppWrapper>
  );
};

export default TwitterLoader;
