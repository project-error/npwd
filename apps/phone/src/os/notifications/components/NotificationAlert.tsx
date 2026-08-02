import React from 'react';
import { ToastBanner, ToastStack } from '@npwd/keyos';
import { useNotifications } from '../hooks/useNotifications';
import { useCurrentCallValue } from '@os/call/hooks/state';

export const NotificationAlert = () => {
  const { currentAlert } = useNotifications();
  const call = useCurrentCallValue();

  if (!currentAlert) return null;

  return (
    <ToastStack>
      <ToastBanner
        icon={currentAlert.icon || undefined}
        onClick={(e) => {
          if (!call) {
            currentAlert.onClickAlert(e);
          }
        }}
        onClose={() => currentAlert.onCloseAlert({} as React.MouseEvent)}
        title={currentAlert.title}
      >
        {currentAlert.content}
      </ToastBanner>
    </ToastStack>
  );
};
