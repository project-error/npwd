import React from 'react';
import './Phone.css';
import './i18n';
import { Route } from 'react-router-dom';
import { CallModal } from './os/call/components/CallModal';
import { HomeApp } from './apps/home/components/Home';
import { Slide } from '@material-ui/core';
import { useKeyboardService } from './os/keyboard/hooks/useKeyboardService';
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
import { useDialService } from './apps/dialer/hooks/useDialService';
import InjectDebugData from './os/debug/InjectDebugData';
import { usePhoneVisibility } from './os/phone/hooks/usePhoneVisibility';
import { PhoneSnackbar } from './ui/components/PhoneSnackbar';
import { NotificationAlert } from './os/notifications/components/NotificationAlert';
import { useCallModal } from './os/call/hooks/useCallModal';
import WindowSnackbar from './ui/components/WindowSnackbar';

function Phone() {
  const { apps } = useApps();

  const [settings] = useSettings();

  useNuiService();
  useKeyboardService();
  usePhoneService();
  useSimcardService();
  useContactsService();
  useTwitterService();
  useSelloutService();
  useBankService();
  useMessagesService();
  useNotesService();
  usePhotoService();
  useCallService();
  useDialService();

  const { modal: callModal } = useCallModal();
  const { bottom, visibility } = usePhoneVisibility();

  return (
    <div>
      <WindowSnackbar />
      <Slide direction="up" timeout={{ enter: 500, exit: 500 }} in={visibility}>
        <div className="PhoneWrapper">
          <div
            className="Phone"
            style={{
              position: 'fixed',
              transformOrigin: 'right bottom',
              transform: `scale(${settings.zoom.value}`,
              bottom,
            }}
          >
            <div
              className="PhoneFrame"
              style={{
                backgroundImage: `url(./media/frames/${settings.frame.value})`,
              }}
            />
            <div
              id="phone"
              className="PhoneScreen"
              style={{
                backgroundImage: `url(./media/backgrounds/${settings.wallpaper.value})`,
              }}
            >
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
            </div>
          </div>
        </div>
      </Slide>
    </div>
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
