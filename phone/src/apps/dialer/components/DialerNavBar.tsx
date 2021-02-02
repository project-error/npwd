import React, { ChangeEvent, useState } from 'react';
import { BottomNavigation, BottomNavigationAction } from '@material-ui/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome } from '@fortawesome/free-solid-svg-icons';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import { Link } from 'react-router-dom';
import { makeStyles, Theme } from '@material-ui/core/styles';
import PhoneCallbackIcon from '@material-ui/icons/PhoneCallback';
import PhoneIcon from '@material-ui/icons/Phone';
import { History } from '@material-ui/icons';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    width: '100%',
    backgroundColor: theme.palette.background.default,
  },
  icon: {
    color: '#43a047',
  },
}));

const DialerNavBar = () => {
  const classes = useStyles();

  const [page, setPage] = useState(0);

  const handleChange = (event: ChangeEvent<{}>, newPage) => {
    setPage(newPage);
  };

  return (
    <BottomNavigation
      value={page}
      onChange={handleChange}
      showLabels
      className={classes.root}
    >
      <BottomNavigationAction
        label='History'
        component={Link}
        icon={<History />}
        to='/phone'
      />
      <BottomNavigationAction
        component={Link}
        icon={<PhoneIcon />}
        to='/phone/dial'
        label='Call'
      />
    </BottomNavigation>
  );
};

export default DialerNavBar;
