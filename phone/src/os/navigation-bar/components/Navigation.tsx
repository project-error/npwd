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

export const Navigation: React.FC = () => {
  const classes = useStyles();
  const history = useHistory();
  const { isExact } = useRouteMatch('/');
  const { closePhone } = usePhone();
  const { setBarUncollapsed } = useNotifications();

  const handleGoBackInHistory = () => {
    history.goBack();
  };

  const handleGoToMenu = () => {
    if (isExact) return;
    history.push('/');
  };

  return (
    <BottomNavigation
      className={classes.root}
      onChange={(_e, value) => {
        setBarUncollapsed(false);
        value();
      }}
    >
      <BottomNavigationAction label="Home" value={handleGoToMenu} icon={<AppsIcon />} />
      <BottomNavigationAction
        label="Close"
        value={closePhone}
        icon={<RadioButtonUncheckedIcon />}
      />
      <BottomNavigationAction
        label="Back"
        value={handleGoBackInHistory}
        icon={<KeyboardArrowLeftIcon />}
      />
    </BottomNavigation>
  );
};
