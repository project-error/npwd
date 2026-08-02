import React, { useMemo, useState } from 'react';
import dayjs from 'dayjs';
import { Link } from 'react-router';
import { useTranslation } from 'react-i18next';

import { Dock, DockItem, SearchBar } from '@npwd/keyos';
import { AppWrapper } from '@ui/components';
import { GridMenu } from '@ui/components/GridMenu';
import { AppIcon } from '@ui/components/AppIcon';
import { useApps } from '@os/apps/hooks/useApps';
import { useExternalApps } from '@common/hooks/use-external-apps';
import usePhoneTime from '@os/phone/hooks/usePhoneTime';

const DOCK_APP_IDS = ['DIALER', 'MESSAGES', 'CONTACTS', 'CAMERA'];

export const HomeApp: React.FC = () => {
  const { apps } = useApps();
  const externalApps = useExternalApps();
  const time = usePhoneTime();
  const [t] = useTranslation();
  const [search, setSearch] = useState('');
  const allApps = useMemo(() => [...(apps ?? []), ...externalApps], [apps, externalApps]);

  const dockApps = useMemo(
    () =>
      DOCK_APP_IDS.map((id) => allApps.find((app) => app.id === id)).filter(
        (app): app is NonNullable<typeof app> => Boolean(app && !app.isDisabled),
      ),
    [allApps],
  );

  const gridApps = useMemo(() => {
    const filtered = allApps.filter((app) => !DOCK_APP_IDS.includes(app.id));
    if (!search.trim()) return filtered;

    const query = search.trim().toLowerCase();
    return filtered.filter((app) => t(app.nameLocale).toLowerCase().includes(query));
  }, [allApps, search, t]);

  const displayTime = time ?? dayjs().format('HH:mm');
  const displayDate = dayjs().format('dddd, MMMM D');

  return (
    <AppWrapper style={{ minHeight: 0 }}>
      <div className="flex min-h-0 flex-1 flex-col px-[var(--keyos-safe-x)] pb-4 pt-2">
        <div className="mb-4 flex flex-col items-center pt-2 text-center">
          <p className="text-[length:var(--keyos-text-display)] font-bold leading-none tracking-tight text-keyos-fg drop-shadow-sm">
            {displayTime}
          </p>
          <p className="mt-2 text-[length:var(--keyos-text-body)] font-medium text-keyos-muted">
            {displayDate}
          </p>
        </div>

        <div className="mb-4">
          <SearchBar
            placeholder={t('GENERIC.SEARCH', 'Search apps')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onClear={() => setSearch('')}
          />
        </div>

        <div className="keyos-hide-scrollbar min-h-0 flex-1 overflow-y-auto px-1">
          <GridMenu items={gridApps} columns={4} showLabels />
        </div>

        {dockApps.length > 0 && (
          <div className="mt-auto px-1 pt-4">
            <Dock>
              {dockApps.map((app) => (
                <DockItem key={app.id}>
                  <Link to={app.path}>
                    <AppIcon {...app} size="dock" />
                  </Link>
                </DockItem>
              ))}
            </Dock>
          </div>
        )}
      </div>
    </AppWrapper>
  );
};
