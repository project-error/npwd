import React from 'react';
import { makeStyles, BottomNavigation, BottomNavigationAction } from '@material-ui/core';
import KeyboardArrowLeftIcon from '@material-ui/icons/KeyboardArrowLeft';
import AppsIcon from '@material-ui/icons/Apps';
import RadioButtonUncheckedIcon from '@material-ui/icons/RadioButtonUnchecked';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { usePhone } from '../../phone/hooks/usePhone';
import { useNotifications } from '../../notifications/hooks/useNotifications';

const useStyles = makeStyles((theme) => ({
  root: {
    zIndex: 2,
    backgroundColor: theme.palette.background.default,
  },
}));

export const Navigation = () => {
  const classes = useStyles();
  const history = useHistory();
  const { isExact } = useRouteMatch('/');
  const { closePhone } = usePhone();
  const { setBarUncollapsed } = useNotifications();
  return (
    <BottomNavigation
      className={classes.root}
      onChange={(_e, value) => {
        setBarUncollapsed(false);
        value();
      }}
    >
      <BottomNavigationAction label="Home" value={() => history.push('/')} icon={<AppsIcon />} />
      <BottomNavigationAction
        label="Close"
        value={closePhone}
        icon={<RadioButtonUncheckedIcon />}
      />
      <BottomNavigationAction
        label="Back"
        value={() => !isExact && history.goBack()}
        icon={<KeyboardArrowLeftIcon />}
      />
    </BottomNavigation>
  );
};
