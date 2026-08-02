import React from 'react';
import { useTranslation } from 'react-i18next';

function NoProfiles() {
  const [t] = useTranslation();
  return (
    <div className="flex h-full w-full justify-center pt-[140px] text-[color:var(--keyos-app-accent)]">
      <h5 className="text-xl font-medium text-keyos-cream">{t('MATCH.FEEDBACK.NO_PROFILES')}</h5>
    </div>
  );
}

export default NoProfiles;
