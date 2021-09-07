import React from 'react';
import { Link } from 'react-router-dom';
import makeStyles from '@mui/styles/makeStyles';
import { BottomNavigation, BottomNavigationAction } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import SearchIcon from '@mui/icons-material/Search';
import ProfileIcon from '@mui/icons-material/Person';

const useStyles = makeStyles({
  root: {
    width: '100%',
  },
});

export function TwitterBottomNavigation({ activePage, handleChange }) {
  const classes = useStyles();

  return (
    <BottomNavigation value={activePage} onChange={handleChange} className={classes.root}>
      <BottomNavigationAction component={Link} to="/twitter" icon={<HomeIcon />} />
      <BottomNavigationAction component={Link} to="/twitter/search" icon={<SearchIcon />} />
      <BottomNavigationAction component={Link} to="/twitter/profile" icon={<ProfileIcon />} />
    </BottomNavigation>
  );
}

export default TwitterBottomNavigation;
