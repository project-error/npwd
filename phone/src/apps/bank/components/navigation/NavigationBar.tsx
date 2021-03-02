import React, { useState } from 'react';

import { Link } from 'react-router-dom';
import { BottomNavigation, BottomNavigationAction } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faList, faMoneyCheck } from '@fortawesome/free-solid-svg-icons';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  icon: {
    color: '#f44336',
  },
}));

export const NavigationBar = () => {
  const classes = useStyles();
  const [activePage, setActivePage] = useState(0);
  return (
    <BottomNavigation
      style={{
        background: '#262525',
      }}
      value={activePage}
      onChange={(event, newPage) => {
        setActivePage(newPage);
      }}
      showLabels
      className={classes.root}
    >
      <BottomNavigationAction component={Link} icon={<FontAwesomeIcon icon={faHome} />} to="/bank" />
      <BottomNavigationAction component={Link} icon={<FontAwesomeIcon icon={faMoneyCheck} />} to="/bank/account" />
      <BottomNavigationAction component={Link} icon={<FontAwesomeIcon icon={faList} />} to="/bank/transactions" />
    </BottomNavigation>
  );
};
