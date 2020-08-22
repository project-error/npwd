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
import { useHistory } from "react-router-dom";

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
  const history =  useHistory()
    
  return (
    <BottomNavigation
      className={classes.root}
      onChange={(_e, value) => value === 'back' ? history.goBack() : history.push('/')}
    >
      <BottomNavigationAction
        label="Back"
        value="back"
        icon={<KeyboardArrowLeftIcon className={classes.icon} />}
      />
      <BottomNavigationAction
        label="Home"
        value="home"
        icon={<AppsIcon className={classes.icon} />}
      />
    </BottomNavigation>
  );
};
