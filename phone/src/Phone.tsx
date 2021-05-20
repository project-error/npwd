import React, { useEffect } from 'react';
import './Phone.css';
import './i18n';
import { Route } from 'react-router-dom';
import { CallModal } from './os/call/components/CallModal';
import { HomeApp } from './apps/home/components/Home';
import { Box, Paper, Typography } from '@material-ui/core';
import { NotificationBar } from './os/notifications/components/NotificationBar';
import { Navigation } from './os/navigation-bar/components/Navigation';
import { useSimcardService } from './os/simcard/hooks/useSimcardService';
import { usePhoneService } from './os/phone/hooks/usePhoneService';
import { useApps } from './os/apps/hooks/useApps';

import { useContactsService } from './apps/contacts/hooks/useContactsService';
import { useTwitterService } from './apps/twitter/hooks/useTwitterService';
import { useMatchService } from './apps/match/hooks/useMatchService';
import { useMarketplaceService } from './apps/marketplace/hooks/useMarketplaceService';
import { useBankService } from './apps/bank/hooks/useBankService';
import { useMessagesService } from './apps/messages/hooks/useMessageService';
import { useNotesService } from './apps/notes/hooks/useNotesService';
import { usePhotoService } from './apps/camera/hooks/usePhotoService';
import { isSettingsSchemaValid, useSettings } from './apps/settings/hooks/useSettings';
import { useCallService } from './os/call/hooks/useCallService';
import { useDialService } from './apps/dialer/hooks/useDialService';
import InjectDebugData from './os/debug/InjectDebugData';
import { PhoneSnackbar } from './ui/components/PhoneSnackbar';
import { NotificationAlert } from './os/notifications/components/NotificationAlert';
import { useCallModal } from './os/call/hooks/useCallModal';
import WindowSnackbar from './ui/components/WindowSnackbar';
import { usePhone } from './os/phone/hooks/usePhone';
import { useTranslation } from 'react-i18next';
import { useSnackbar } from './ui/hooks/useSnackbar';
import { PhoneEvents } from '../../typings/phone';
import { isDefaultWallpaper } from './apps/settings/utils/isDefaultWallpaper';
import { useKeyboardService } from './os/keyboard/hooks/useKeyboardService';
import PhoneWrapper from './PhoneWrapper';

import dayjs from 'dayjs';
import DefaultConfig from '../../config.json';

function Phone() {
  const { t, i18n } = useTranslation();

  const { apps } = useApps();

  const [settings] = useSettings();

  const { addAlert } = useSnackbar();

  // Set language from local storage
  // This will only trigger on first mount & settings changes
  useEffect(() => {
    i18n.changeLanguage(settings.language.value).catch((e) => console.error(e));
  }, [i18n, settings.language]);

  useEffect(() => {
    if (!isSettingsSchemaValid()) {
      addAlert({
        message: t('SETTINGS.MESSAGES.INVALID_SETTINGS'),
        type: 'error',
      });
    }
    // We only want to run this on first mount of the phone,
    // so we leave an empty dep array. Otherwise, we hit a max depth error.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useKeyboardService();
  usePhoneService();
  useSimcardService();
  useContactsService();
  useTwitterService();
  useMatchService();
  useMarketplaceService();
  useBankService();
  useMessagesService();
  useNotesService();
  usePhotoService();
  useCallService();
  useDialService();

  const { modal: callModal } = useCallModal();

  const { isPhoneReady } = usePhone();

  return (
    <div>
      <WindowSnackbar />
      <PhoneWrapper>
        {isPhoneReady ? (
          <>
            <NotificationBar />
            <div className="PhoneAppContainer">
              <>
                <Route exact path="/" component={HomeApp} />
                {callModal && <Route exact path="/call" component={CallModal} />}
                {apps.map((App) => (
                  <App.Route key={App.id} />
                ))}
              </>
              <NotificationAlert />
              <PhoneSnackbar />
            </div>
            <Navigation />
          </>
        ) : (
          <Box
            component={Paper}
            height="100%"
            width="100%"
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
          >
            <Typography paragraph variant="h6">
              NPWD {t('INITIALIZING')}
            </Typography>
            <Typography paragraph>{t('GENERIC_WAIT')}</Typography>
          </Box>
        )}
      </PhoneWrapper>
    </div>
  );
}

export default Phone;

InjectDebugData<any>([
  {
    app: 'PHONE',
    method: PhoneEvents.SET_VISIBILITY,
    data: true,
  },
  {
    app: 'PHONE',
    method: PhoneEvents.SET_PHONE_READY,
    data: true,
  },
  {
    app: 'PHONE',
    method: PhoneEvents.SET_TIME,
    data: dayjs().format('hh:mm'),
  },
  {
    app: 'PHONE',
    method: PhoneEvents.SET_CONFIG,
    data: DefaultConfig,
  },
]);
