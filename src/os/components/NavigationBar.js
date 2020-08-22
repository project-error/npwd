import React from "react";
import {
  makeStyles,
  BottomNavigation,
  BottomNavigationAction
} from "@material-ui/core";
import KeyboardArrowLeftIcon from "@material-ui/icons/KeyboardArrowLeft";
import AppsIcon from "@material-ui/icons/Apps";
import { useHistory } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  root: {
    zIndex: 2,
    backgroundColor: theme.palette.background.default,
  },
}));

export const NavigationBar = ({ notifications = [] }) => {
  const classes = useStyles();
  const history = useHistory();

  return (
    <BottomNavigation
      className={classes.root}
      onChange={(_e, value) =>
        value === "back" ? history.goBack() : history.push("/")
      }
    >
      <BottomNavigationAction
        label="Back"
        value="back"
        icon={<KeyboardArrowLeftIcon />}
      />
      <BottomNavigationAction
        label="Home"
        value="home"
        icon={<AppsIcon className={classes.icon} />}
      />
    </BottomNavigation>
  );
};
