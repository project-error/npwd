import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Link, useHistory } from 'react-router-dom';
import { BottomNavigation, BottomNavigationAction } from '@material-ui/core';
import { AddCircle, Home } from '@material-ui/icons/';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    backgroundColor: theme.palette.background.default,
  },
  icon: {
    color: theme.palette.primary.main,
  },
}));

export const NavigationBar = () => {
  const history = useHistory()
  const classes = useStyles();
  const [activePage, setActivePage] = useState("/marketplace");
  return (
    <BottomNavigation
      value={activePage}
      onChange={(event, newPage) => {
        event.preventDefault()
        history.push(newPage)
        setActivePage(newPage);
      }}
      showLabels
      className={classes.root}
    >
      <BottomNavigationAction value="/marketplace" component={Link} icon={<Home />} to="/marketplace" />
      <BottomNavigationAction value="/marketplace/new" component={Link} icon={<AddCircle />} to="/marketplace/new" />
    </BottomNavigation>
  );
};
