import React, { useState } from 'react';
import { Link, useLocation } from 'react-router';
import { PlusCircle, Home } from 'lucide-react';
import { TabBar } from '@npwd/keyos';

export const NavigationBar: React.FC = () => {
  const { pathname } = useLocation();
  const [activePage, setActivePage] = useState(pathname);

  const items = [
    { value: '/marketplace', label: 'Home', icon: <Home /> },
    { value: '/marketplace/new', label: 'New', icon: <PlusCircle /> },
  ];

  return (
    <TabBar
      items={items}
      value={activePage}
      onChange={setActivePage}
      renderItem={(item, active) => (
        <Link
          to={item.value}
          className={`flex min-w-0 flex-1 flex-col items-center justify-center gap-0.5 rounded-[var(--keyos-radius-pill)] px-3 py-1.5 text-[length:var(--keyos-text-micro)] font-medium transition-all duration-150 ${
            active
              ? 'bg-[color:var(--keyos-app-accent)]/20 text-[color:var(--keyos-app-accent)]'
              : 'text-keyos-muted hover:text-keyos-fg'
          }`}
          onClick={() => setActivePage(item.value)}
        >
          <span className="[&_svg]:size-5">{item.icon}</span>
          <span className="truncate">{item.label}</span>
        </Link>
      )}
    />
  );
};
