import React, { Dispatch, SetStateAction, useEffect, useMemo } from 'react';
import './Phone.css';
import { Navigate, Outlet, Route, Routes, useLocation } from 'react-router';
import { CallModal } from '@os/call/components/CallModal';
import { HomeApp } from './apps/home/components/Home';
import { NotificationBar } from '@os/new-notifications/components/NotificationBar';
import { Navigation } from '@os/navigation-bar/components/phone-navigation';
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
import { NotificationAlert } from '@os/new-notifications/components/NotificationAlert';
import { useCallModal } from '@os/call/hooks/useCallModal';
import WindowSnackbar from './ui/components/WindowSnackbar';
import { useTranslation } from 'react-i18next';
import { PhoneEvents } from '@typings/phone';
import PhoneWrapper from './phone-wrapper';
import DefaultConfig from '../../../config.default.json';
import { TopLevelErrorComponent } from '@ui/components/TopLevelErrorComponent';
import { useConfig } from '@os/phone/hooks/useConfig';
import { useContactsListener } from './apps/contacts/hooks/useContactsListener';
import { useNoteListener } from './apps/notes/hooks/useNoteListener';
import { PhoneSnackbar } from '@os/snackbar/components/PhoneSnackbar';
import { useInvalidSettingsHandler } from './apps/settings/hooks/useInvalidSettingsHandler';
import { useKeyboardService } from '@os/keyboard/hooks/useKeyboardService';
import { useExternalApps } from '@common/hooks/use-external-apps';
import { useDarkchatService } from './apps/darkchat/hooks/useDarkchatService';
import { useNotificationListener } from '@os/new-notifications/useNotificationListener';
import { useSystemNotificationListener } from '@os/new-notifications/components/system/useSystemNotificationListener';
import { useNotificationBarListener } from '@os/new-notifications/useNotificationBarListener';
import { AppWithStartup } from '@os/apps/components/app-with-startup';
import { IApp } from '@os/apps/config/apps';
import { createExternalAppProvider } from '@os/apps/utils/createExternalAppProvider';
import { i18n } from 'i18next';
import { IPhoneSettings } from '@typings/settings';
import { useApplyDarkMode } from '@common/hooks/use-color-scheme';
import { PageTransition } from '@npwd/keyos';

interface PhoneProps {
  notiRefCB: Dispatch<SetStateAction<HTMLElement>>;
}

interface PhoneShellProps extends PhoneProps {
  i18n: i18n;
  settings: IPhoneSettings;
}

interface ExternalAppRouteProps {
  app: IApp;
  i18n: i18n;
  settings: IPhoneSettings;
}

const routePath = (path: string) => `${path.replace(/^\//, '')}/*`;

const AppRouteElement = ({ app }: { app: IApp }) => {
  const AppComponent = app.Component;

  return (
    <AppWithStartup id={app.id} emitOnOpen={app.emitOnOpen ?? true}>
      <AppComponent />
    </AppWithStartup>
  );
};

const ExternalAppRouteElement = ({ app, i18n, settings }: ExternalAppRouteProps) => {
  const Provider = useMemo(() => createExternalAppProvider(app), [app]);
  const AppComponent = app.Component;

  return (
    <Provider>
      <AppComponent settings={settings} i18n={i18n} />
    </Provider>
  );
};

const PhoneShell: React.FC<PhoneShellProps> = ({ i18n, notiRefCB, settings }) => {
  const { pathname } = useLocation();
  useApplyDarkMode();

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

  return (
    <div>
      <TopLevelErrorComponent>
        <WindowSnackbar />
        <PhoneWrapper>
          <NotificationBar />
          <PageTransition
            animationKey={pathname}
            className="PhoneAppContainer"
            id="notificationAppContainer"
            ref={notiRefCB as React.Ref<HTMLDivElement>}
            variant={pathname === '/' ? 'home' : 'push'}
          >
            <Outlet />
            <NotificationAlert />
            <PhoneSnackbar />
          </PageTransition>
          <Navigation />
        </PhoneWrapper>
      </TopLevelErrorComponent>
    </div>
  );
};

const Phone: React.FC<PhoneProps> = ({ notiRefCB }) => {
  const { i18n } = useTranslation();
  const { apps } = useApps();
  const [settings] = useSettings();
  const externalApps = useExternalApps();
  const { modal: callModal } = useCallModal();

  return (
    <Routes>
      <Route element={<PhoneShell i18n={i18n} notiRefCB={notiRefCB} settings={settings} />}>
        <Route index element={<HomeApp />} />
        <Route path="call" element={callModal ? <CallModal /> : <Navigate to="/" replace />} />
        {apps.map((app) => (
          <Route
            key={app.id}
            path={routePath(app.path)}
            element={!app.isDisabled ? <AppRouteElement app={app} /> : <Navigate to="/" replace />}
          />
        ))}
        {externalApps.map((app) => (
          <Route
            key={app.id}
            path={routePath(app.path)}
            element={<ExternalAppRouteElement app={app} i18n={i18n} settings={settings} />}
          />
        ))}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
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
