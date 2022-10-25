import React from 'react';
import { Link } from 'react-router-dom';
import makeStyles from '@mui/styles/makeStyles';
import { BottomNavigation, BottomNavigationAction } from '@mui/material';
import HomeIcon from '@mui/icons-material/Whatshot';
import GroupIcon from '@mui/icons-material/Group';
import ProfileIcon from '@mui/icons-material/Person';

const useStyles = makeStyles({
  root: {
    width: '100%',
  },
});

export function MatchBottomNavigation({ activePage, handleChange }) {
  const classes = useStyles();

  return (
    <BottomNavigation value={activePage} onChange={handleChange} className={classes.root}>
      <BottomNavigationAction component={Link} to="/match" icon={<HomeIcon />} />
      <BottomNavigationAction component={Link} to="/match/matches" icon={<GroupIcon />} />
      <BottomNavigationAction component={Link} to="/match/profile" icon={<ProfileIcon />} />
    </BottomNavigation>
  );
}

export default MatchBottomNavigation;
