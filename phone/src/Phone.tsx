import React, { useMemo } from 'react';
import './Phone.css';
import './i18n';
import { Route } from 'react-router-dom';
import { CallModal } from './modal/components/CallModal';
import { Alert } from './ui/components/Alert';
import { HomeApp } from './apps/home/components/Home';
import { createMuiTheme, ThemeProvider, Slide} from '@material-ui/core';
import { useInitKeyboard } from './os/keyboard/hooks/useKeyboard';
import { NotificationIcon } from './os/notifications/components/NotificationIcon';
import { NotificationBar } from './os/notifications/components/NotificationBar';
import { Navigation } from './os/navigation-bar/components/Navigation';
import { useNuiService } from './os/nui-events/hooks/useNuiService';
import { useSimcardService } from './os/simcard/hooks/useSimcardService';
import { usePhoneService } from './os/phone/hooks/usePhoneService';
import { useApps } from './os/apps/hooks/useApps';

import { useContactsService } from './apps/contacts/hooks/useContactsService';
import { useTwitterService } from './apps/twitter/hooks/useTwitterService';
import { useSelloutService } from './apps/sellout/hooks/useSelloutService';
import { useBankService } from './apps/bank/hooks/useBankService';
import { useMessagesService } from './apps/messages/hooks/useMessageService';
import { useNotesService } from './apps/notes/hooks/useNotesService';
import { usePhotoService } from './apps/camera/hooks/usePhotoService';
import Nui from './os/nui-events/utils/Nui';
import { usePhone } from './os/phone/hooks/usePhone';
import { settingsState } from './apps/settings/hooks/useSettings';

import config from './config/default.json';
import { useRecoilState } from 'recoil';
import { useCallService } from './modal/hooks/useCallService';
import { useModal } from './modal/hooks/useModal';
import { useDialService } from './apps/dialer/hooks/useDialService';
import InjectDebugData from './os/debug/InjectDebugData';
import { useQuickAccess } from './os/notifications/hooks/useQuickAccess';
import { useSnackbar } from './ui/hooks/useSnackbar';
import { useTranslation } from 'react-i18next';

function Phone() {
  const quickAccess = useQuickAccess();
  useNuiService();
  usePhoneService();
  const { visibility } = usePhone();
  const { allApps } = useApps();
  useSimcardService();
  useContactsService();
  useTwitterService();
  useInitKeyboard();
  useSelloutService();
  useBankService();
  useMessagesService();
  useNotesService();
  usePhotoService();
  useCallService();
  useDialService();
  const { t } = useTranslation()

  const { alert } = useSnackbar();

  const { modal } = useModal(); // the calling modal

  const [settings] = useRecoilState(settingsState);

  const currentTheme = useMemo(
    () => createMuiTheme(config.themes[settings.theme]),
    [settings.theme]
  );

  
  document.onkeyup = function (data) {
    if (data.which === 27) {
      Nui.send('phone:close');
    }
  };

  return (
    <ThemeProvider theme={currentTheme}>
      <Slide direction='up' in={visibility} mountOnEnter unmountOnExit>
        <div className='PhoneWrapper'>
          <div>
            <div
              className='Phone'
              style={{
                transformOrigin: 'right bottom',
                transform: `scale(${settings.zoom}`,
              }}
            >
              <div
                className='PhoneFrame'
                style={{
                  backgroundImage: `url(./media/frames/${settings.frame})`,
                }}
              />
              <div
                id='phone'
                className='PhoneScreen'
                style={{
                  backgroundImage: `url(./media/backgrounds/${settings.wallpaper})`,
                }}
              >
                <>
                  <NotificationBar
                    notifications={quickAccess.map((qa) => ({
                      key: qa.id,
                      icon: (
                        <NotificationIcon
                          icon={qa.notificationIcon}
                          to={qa.path}
                        />
                      ),
                    }))}
                  />
                  <div className='PhoneAppContainer'>
                      {modal ? (
                        <CallModal />
                      ) : (
                        <>
                          <Route exact path='/' component={HomeApp} />
                          {allApps.map((App) => (
                            <App.Route key={App.id} />
                          ))}
                        </>
                      )}
                      {alert ? (
                        <div style={{
                          marginTop: '-100px',
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center'
                        }}>
                          <Alert severity={alert.type} variant="filled">
                            {t("APPS_"+alert.message)}
                          </Alert>
                        </div>
                      ) : null}
                  </div>
                  <Navigation />
                </>
              </div>
            </div>
          </div>
        </div>
      </Slide>
    </ThemeProvider>
  );
}

export default Phone;

InjectDebugData([
  {
    app: 'PHONE',
    method: 'setVisibility',
    data: true,
  },
]);
