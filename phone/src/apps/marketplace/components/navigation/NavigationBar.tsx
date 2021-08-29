import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';
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

export const NavigationBar: React.FC = () => {
  const classes = useStyles();
  const [activePage, setActivePage] = useState(0);
  return (
    <BottomNavigation
      value={activePage}
      onChange={(event, newPage) => {
        setActivePage(newPage);
      }}
      showLabels
      className={classes.root}
    >
      <BottomNavigationAction component={Link} icon={<Home />} to="/marketplace" />
      <BottomNavigationAction component={Link} icon={<AddCircle />} to="/marketplace/new" />
    </BottomNavigation>
  );
};
