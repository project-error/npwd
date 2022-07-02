import React from 'react';
import { Link } from 'react-router-dom';
import { BottomNavigation, BottomNavigationAction, styled } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import SearchIcon from '@mui/icons-material/Search';
import ProfileIcon from '@mui/icons-material/Person';

const Navigation = styled(BottomNavigation)({
  width: '100%',
});

export function TwitterBottomNavigation({ activePage, handleChange }) {
  return (
    <Navigation value={activePage} onChange={handleChange}>
      <BottomNavigationAction component={Link} to="/twitter" icon={<HomeIcon />} />
      <BottomNavigationAction component={Link} to="/twitter/search" icon={<SearchIcon />} />
      <BottomNavigationAction component={Link} to="/twitter/profile" icon={<ProfileIcon />} />
    </Navigation>
  );
}

export default TwitterBottomNavigation;
