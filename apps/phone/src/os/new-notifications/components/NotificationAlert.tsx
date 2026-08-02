import React from 'react';

import { ToastBanner, ToastStack } from '@npwd/keyos';
import { useCurrentCallValue } from '@os/call/hooks/state';
import { useNotification } from '../useNotification';

export const NotificationAlert = () => {
  const { currentAlert } = useNotification();
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
