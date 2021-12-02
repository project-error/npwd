import React from 'react';
import { BottomNavigation, BottomNavigationAction } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import AppsIcon from '@mui/icons-material/Apps';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { usePhone } from '@os/phone/hooks/usePhone';
import { useNotifications } from '@os/notifications/hooks/useNotifications';

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
