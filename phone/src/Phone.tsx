import React, { Dispatch, Fragment, SetStateAction, Suspense, useEffect } from 'react';
import './Phone.css';
import { Route } from 'react-router-dom';
import { CallModal } from '@os/call/components/CallModal';
import { HomeApp } from './apps/home/components/Home';
import { NotificationBar } from '@os/new-notifications/components/NotificationBar';
import { Navigation } from '@os/navigation-bar/components/Navigation';
import { useSimcardService } from '@os/simcard/hooks/useSimcardService';
import { usePhoneService } from '@os/phone/hooks/usePhoneService';
import { useApps } from '@os/apps/hooks/useApps';
import { useTwitterService } from './apps/twitter/hooks/useTwitterService';
import { useMarketplaceService } from './apps/marketplace/hooks/useMarketplaceService';
import { useMessagesService } from './apps/messages/hooks/useMessageService';
import { useSettings } from './apps/settings/hooks/useSettings';
import { useCallService } from '@os/call/hooks/useCallService';
import { useDialService } from './apps/dialer/hooks/useDialService';
import { useMatchService } from './apps/match/hooks/useMatchService';
import InjectDebugData from './os/debug/InjectDebugData';
import { NotificationAlert } from '@os/notifications/components/NotificationAlert';
import { useCallModal } from '@os/call/hooks/useCallModal';
import WindowSnackbar from './ui/components/WindowSnackbar';
import { useTranslation } from 'react-i18next';
import { PhoneEvents } from '@typings/phone';
import PhoneWrapper from './PhoneWrapper';
import DefaultConfig from '../../config.json';
import { TopLevelErrorComponent } from '@ui/components/TopLevelErrorComponent';
import { useConfig } from '@os/phone/hooks/useConfig';
import { useContactsListener } from './apps/contacts/hooks/useContactsListener';
import { useNoteListener } from './apps/notes/hooks/useNoteListener';
import { PhoneSnackbar } from '@os/snackbar/components/PhoneSnackbar';
import { useInvalidSettingsHandler } from './apps/settings/hooks/useInvalidSettingsHandler';
import { useKeyboardService } from '@os/keyboard/hooks/useKeyboardService';
import { useExternalApps } from '@common/hooks/useExternalApps';
import { useTheme } from '@mui/material';
import { useDarkchatService } from './apps/darkchat/hooks/useDarkchatService';
import { useNotificationListener } from '@os/new-notifications/useNotificationListener';
import { useSystemNotificationListener } from '@os/new-notifications/components/system/useSystemNotificationListener';
import { useNotificationBarListener } from '@os/new-notifications/useNotificationBarListener';

interface PhoneProps {
  notiRefCB: Dispatch<SetStateAction<HTMLElement>>;
}

const Phone: React.FC<PhoneProps> = ({ notiRefCB }) => {
  const { i18n } = useTranslation();

  const { apps } = useApps();
  const [settings] = useSettings();
  const theme = useTheme();

  // Set language from local storage
  // This will only trigger on first mount & settings changes
  useEffect(() => {
    i18n.changeLanguage(settings.language.value).catch((e) => console.error(e));
  }, [i18n, settings.language]);

  useConfig();
  useKeyboardService();
  usePhoneService();
  useSimcardService();
  useNotificationListener();
  useSystemNotificationListener();
  useNotificationBarListener();
  useTwitterService();
  useMatchService();
  useMarketplaceService();
  useMessagesService();
  useContactsListener();
  useNoteListener();
  useCallService();
  useDialService();
  useDarkchatService();
  useInvalidSettingsHandler();

  const externalApps = useExternalApps();

  const { modal: callModal } = useCallModal();

  return (
    <div>
      <TopLevelErrorComponent>
        <WindowSnackbar />
        <PhoneWrapper>
          <NotificationBar />
          <div className="PhoneAppContainer" id="notificationAppContainer" ref={notiRefCB}>
            <>
              <Route exact path="/" component={HomeApp} />
              {callModal && <Route exact path="/call" component={CallModal} />}
              {apps.map((App) => (
                <Fragment key={App.id}>{!App.isDisabled && <App.Route key={App.id} />}</Fragment>
              ))}

              {externalApps.map((App) => (
                <Fragment key={App.id}>
                  <App.Route settings={settings} i18n={i18n} theme={theme} />
                </Fragment>
              ))}
            </>
            <NotificationAlert />
            <PhoneSnackbar />
          </div>
          <Navigation />
        </PhoneWrapper>
      </TopLevelErrorComponent>
    </div>
  );
};

InjectDebugData<any>([
  {
    app: 'PHONE',
    method: PhoneEvents.SET_CONFIG,
    data: DefaultConfig,
  },
  {
    app: 'PHONE',
    method: PhoneEvents.SET_VISIBILITY,
    data: true,
  },
]);

export default Phone;
