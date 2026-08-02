import React from 'react';
import { useTranslation } from 'react-i18next';

import { EmptyState } from '@npwd/keyos';

export const NoNotificationText: React.FC = () => {
  const [t] = useTranslation();

  return (
    <EmptyState
      className="py-6"
      title={`🎉 ${t('NOTIFICATIONS.NO_UNREAD')} 🎉`}
    />
  );
};
