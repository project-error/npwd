import React from 'react';
import { Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { BottomNavigation, BottomNavigationAction } from '@material-ui/core';
import HomeIcon from '@material-ui/icons/Home';
import SearchIcon from '@material-ui/icons/Search';
import ProfileIcon from '@material-ui/icons/Person';

const useStyles = makeStyles({
  root: {
    width: '100%',
  },
});

export function TwitterBottomNavigation({ activePage, handleChange }) {
  const classes = useStyles();

  return (
    <BottomNavigation
      value={activePage}
      onChange={handleChange}
      className={classes.root}
    >
      <BottomNavigationAction
        component={Link}
        to='/twitter'
        icon={<HomeIcon />}
      />
      <BottomNavigationAction
        component={Link}
        to='/twitter/search'
        icon={<SearchIcon />}
      />
      <BottomNavigationAction
        component={Link}
        to='/twitter/profile'
        icon={<ProfileIcon />}
      />
    </BottomNavigation>
  );
}

export default TwitterBottomNavigation;
