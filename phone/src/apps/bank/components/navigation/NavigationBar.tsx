import React, { useState } from 'react';

import { Link, useHistory } from 'react-router-dom';
import { BottomNavigation, BottomNavigationAction } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Home, List, Payment } from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  icon: {
    color: '#f44336',
  },
}));

export const NavigationBar = () => {
  const history = useHistory()
  const classes = useStyles();
  const [activePage, setActivePage] = useState(0);
  return (
    <BottomNavigation
      style={{
        background: '#262525',
      }}
      value={activePage}
      onChange={(event, newPage) => {
        event.preventDefault()
        history.push(newPage)
        setActivePage(newPage);
      }}
      showLabels
      className={classes.root}
    >
      <BottomNavigationAction value="/bank" component={Link} icon={<Home />}   to="/bank" />
      <BottomNavigationAction value="/bank/account" component={Link} icon={<Payment />} to="/bank/account" />
      <BottomNavigationAction value="/bank/transactions" component={Link} icon={<List />}    to="/bank/transactions" />
    </BottomNavigation>
  );
};
