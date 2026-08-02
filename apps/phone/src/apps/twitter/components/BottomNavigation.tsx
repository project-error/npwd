import { Link, useLocation } from 'react-router';
import { Home, Search, UserRound } from 'lucide-react';
import { TabBar } from '@npwd/keyos';

export function TwitterBottomNavigation({ activePage, handleChange }) {
  const { pathname } = useLocation();

  const items = [
    { value: '/twitter', label: '', icon: <Home size={20} /> },
    { value: '/twitter/search', label: '', icon: <Search size={20} /> },
    { value: '/twitter/profile', label: '', icon: <UserRound size={20} /> },
  ];

  return (
    <TabBar
      items={items}
      value={pathname}
      onChange={(value) => handleChange(null, items.findIndex((item) => item.value === value))}
      renderItem={(item, active) => (
        <Link
          to={item.value}
          className={`flex min-w-0 flex-1 flex-col items-center justify-center rounded-[var(--keyos-radius-pill)] px-3 py-2 transition-all duration-150 ${
            active
              ? 'bg-[color:var(--keyos-app-accent)]/20 text-[color:var(--keyos-app-accent)]'
              : 'text-keyos-muted hover:text-keyos-fg'
          }`}
        >
          <span className="[&_svg]:size-5">{item.icon}</span>
        </Link>
      )}
    />
  );
}

export default TwitterBottomNavigation;
