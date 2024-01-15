import { Link } from 'react-router-dom';
import { BottomNavigation, BottomNavigationAction, styled } from '@mui/material';
import { Home, Search, UserRound } from 'lucide-react';

const Navigation = styled(BottomNavigation)({
  width: '100%',
});

export function TwitterBottomNavigation({ activePage, handleChange }) {
  return (
    <Navigation value={activePage} onChange={handleChange}>
      <BottomNavigationAction component={Link} to="/twitter" icon={<Home size={20} />} />
      <BottomNavigationAction component={Link} to="/twitter/search" icon={<Search size={20} />} />
      <BottomNavigationAction component={Link} to="/twitter/profile" icon={<UserRound size={20} />} />
    </Navigation>
  );
}

export default TwitterBottomNavigation;
