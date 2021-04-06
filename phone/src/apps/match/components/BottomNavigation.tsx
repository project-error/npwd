import React from 'react';
import { Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { BottomNavigation, BottomNavigationAction } from '@material-ui/core';
import HomeIcon from '@material-ui/icons/Whatshot';
import GroupIcon from '@material-ui/icons/Group';
import ProfileIcon from '@material-ui/icons/Person';

const useStyles = makeStyles({
  root: {
    width: '100%',
  },
});

export function MatchBottomNavigation({ activePage, handleChange }) {
  const classes = useStyles();

  console.log(activePage);

  return (
    <BottomNavigation value={activePage} onChange={handleChange} className={classes.root}>
      <BottomNavigationAction component={Link} to="/match" icon={<HomeIcon />} />
      <BottomNavigationAction component={Link} to="/match/matches" icon={<GroupIcon />} />
      <BottomNavigationAction component={Link} to="/match/profile" icon={<ProfileIcon />} />
    </BottomNavigation>
  );
}

export default MatchBottomNavigation;
