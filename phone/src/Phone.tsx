import React from 'react';
import './Phone.css';
import './i18n';
import { Route } from 'react-router-dom';
import { CallModal } from './os/call/components/CallModal';
import { HomeApp } from './apps/home/components/Home';
import { Slide } from '@material-ui/core';
import { useInitKeyboard } from './os/keyboard/hooks/useKeyboard';
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
import { useSettings } from './apps/settings/hooks/useSettings';
import { useCallService } from './os/call/hooks/useCallService';
import { useModal } from './os/call/hooks/useModal';
import { useDialService } from './apps/dialer/hooks/useDialService';
import InjectDebugData from './os/debug/InjectDebugData';
import { usePhoneVisibility } from './os/phone/hooks/usePhoneVisibility';
import { Snackbar } from './ui/components/Snackbar';
import { NotificationAlert } from './os/notifications/components/NotificationAlert';

function Phone() {
  const { modal } = useModal();
  const { apps } = useApps();

  const [settings] = useSettings();

  const { bottom, visibility } = usePhoneVisibility();

  useNuiService();
  usePhoneService();
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

  return (
    <Slide direction='up' in={visibility}>
      <div className='PhoneWrapper'>
        <div>
          <div
            className='Phone'
            style={{
              transformOrigin: 'right bottom',
              transform: `scale(${settings.zoom}`,
              bottom,
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
                <NotificationBar />
                <div className='PhoneAppContainer'>
                  {modal ? (
                    <CallModal />
                  ) : (
                    <>
                      <Route exact path='/' component={HomeApp} />
                      {apps.map((App) => (
                        <App.Route key={App.id} />
                      ))}
                    </>
                  )}
                  <NotificationAlert />
                  <Snackbar />
                </div>
                <Navigation />
              </>
            </div>
          </div>
        </div>
      </div>
    </Slide>
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
