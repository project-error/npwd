import React from "react";
import {
  makeStyles,
  BottomNavigation,
  BottomNavigationAction
} from "@material-ui/core";
import KeyboardArrowLeftIcon from "@material-ui/icons/KeyboardArrowLeft";
import AppsIcon from "@material-ui/icons/Apps";
import PhoneIcon from "@material-ui/icons/Phone";
import { useHistory } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  root: {
    zIndex: 2,
    backgroundColor: theme.palette.background.default,
  },
}));

export const Navigation = () => {
  const classes = useStyles();
  const history = useHistory();
  return (
    <BottomNavigation
      className={classes.root}
      onChange={(_e, value) => value()}
    >
      <BottomNavigationAction
        label="Back"
        value={() => history.goBack()}
        icon={<KeyboardArrowLeftIcon />}
      />
      <BottomNavigationAction
        label="Home"
        value={() => history.push('/')}
        icon={<AppsIcon className={classes.icon} />}
      />
      <BottomNavigationAction
        label="Phone"
        value={() => history.push('/phone')}
        icon={<PhoneIcon className={classes.icon} />}
      />
    </BottomNavigation>
  );
};
