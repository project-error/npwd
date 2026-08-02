import React from 'react';
import { EmptyState } from '@npwd/keyos';
import { useTranslation } from 'react-i18next';

export const NoNotificationText: React.FC = () => {
  const [t] = useTranslation();

  return (
    <EmptyState
      className="py-4"
      title={`🎉 ${t('NOTIFICATIONS.NO_UNREAD')} 🎉`}
    />
  );
};
