import React, { useEffect, useState } from 'react';
import { useSettings } from '../../apps/settings/hooks/useSettings';
import { useTranslation } from 'react-i18next';
import { cn } from '@utils/css';

export const PictureReveal: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings] = useSettings();
  const [covered, setCovered] = useState<boolean>(false);
  const [ready, setReady] = useState<boolean>(false);
  const [t] = useTranslation();

  useEffect(() => {
    if (settings.streamerMode === true) {
      setCovered(true);
    }
    setReady(true);
  }, [settings.streamerMode]);

  const onClickCover = () => setCovered(false);

  return (
    <div className="relative w-full">
      <div
        className={cn(
          'absolute inset-0 flex cursor-pointer items-center justify-center bg-keyos-night text-keyos-fg',
          covered ? 'visible' : 'invisible',
        )}
        onClick={onClickCover}
      >
        {t('GENERIC_CLICK_TO_REVEAL')}
      </div>
      <div className={cn('h-full w-full', ready ? 'visible' : 'invisible')}>{children}</div>
    </div>
  );
};
