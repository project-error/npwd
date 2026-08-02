import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router';
import { useTranslation } from 'react-i18next';
import { Contact, Grid3X3, History } from 'lucide-react';
import { TabBar } from '@npwd/keyos';

const DialerNavBar: React.FC = () => {
  const { pathname } = useLocation();
  const [t] = useTranslation();
  const [page, setPage] = useState(pathname);

  const items = [
    { value: '/phone', label: t('DIALER.HISTORY', 'Recents'), icon: <History /> },
    { value: '/phone/contacts', label: t('APPS_CONTACTS', 'Contacts'), icon: <Contact /> },
    { value: '/phone/dial', label: t('DIALER.KEYPAD', 'Keypad'), icon: <Grid3X3 /> },
  ];

  return (
    <TabBar
      items={items}
      value={page}
      onChange={setPage}
      renderItem={(item, active) => (
        <NavLink
          to={item.value}
          className={`flex min-w-0 flex-1 flex-col items-center justify-center gap-0.5 rounded-[var(--keyos-radius-pill)] px-3 py-1.5 text-[length:var(--keyos-text-micro)] font-medium transition-all duration-150 ${
            active
              ? 'bg-[color:var(--keyos-app-accent)]/20 text-[color:var(--keyos-app-accent)]'
              : 'text-keyos-muted hover:text-keyos-fg'
          }`}
          onClick={() => setPage(item.value)}
        >
          <span className="[&_svg]:size-5">{item.icon}</span>
          <span className="truncate">{item.label}</span>
        </NavLink>
      )}
    />
  );
};

export default DialerNavBar;
