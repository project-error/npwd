import React from "react";
import {
  makeStyles,
  BottomNavigation,
  BottomNavigationAction,
} from "@material-ui/core";
import { grey } from "@material-ui/core/colors";
import { fade } from "@material-ui/core/styles/colorManipulator";
import KeyboardArrowLeftIcon from "@material-ui/icons/KeyboardArrowLeft";
import AppsIcon from "@material-ui/icons/Apps";

const useStyles = makeStyles(() => ({
  root: {
    backgroundColor: fade(grey[800], 0.7),
    color: "white",
  },
  icon: {
      color: "white"
  }
}));

export const NavigationBar = ({ notifications = [] }) => {
  const classes = useStyles();
  return (
    <BottomNavigation
      value={null}
      onChange={() => {}}
      className={classes.root}
    >
      <BottomNavigationAction
        label="Back"
        value="back"
        icon={<KeyboardArrowLeftIcon className={classes.icon} color="error" />}
      />
      <BottomNavigationAction
        label="Favorites"
        value="favorites"
        icon={<AppsIcon className={classes.icon} />}
      />
    </BottomNavigation>
  );
};
