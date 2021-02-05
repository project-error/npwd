import React from 'react';
import './Phone.css';
import './i18n';
import { Route } from 'react-router-dom';
import MessageIcon from '@material-ui/icons/Email';
import { CallModal } from './modal/components/CallModal';
import { HomeApp } from './apps/home/components/Home';
import { createMuiTheme, ThemeProvider } from '@material-ui/core';
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

// Inject mock data when in development env.
if (process.env.NODE_ENV === 'development') {
  setTimeout(() => {
    window.dispatchEvent(
      new MessageEvent('message', {
        data: {
          app: 'CAMERA',
          method: 'setPhotos',
          data: [
            {
              id: 1,
              image: 'https://i.imgur.com/OO8wx6Z.jpg',
            },
            {
              id: 1,
              image: 'https://i.imgur.com/pqGBiST.jpg',
            },
          ],
        },
      })
    );
  }, 1000);

  setTimeout(() => {
    window.dispatchEvent(
      new MessageEvent('message', {
        data: {
          app: 'DAILER',
          method: 'setHistory',
          data: [
            {
              id: 1,
              transmitter: '636-6496',
              start: 1612301545782,
            },
            {
              id: 2,
              transmitter: '777-7777',
              start: 1612301545782,
            },
          ],
        },
      })
    );
  }, 1000);

  setTimeout(() => {
    window.dispatchEvent(
      new MessageEvent('message', {
        data: {
          app: 'CALL',
          method: 'setCaller',
          data: {
            accepted: true,
            isTransmitter: true,
            transmitter: 'Chip',
            receiver: 'Taso',
            phone_number: '860-4504',
          },
        },
      })
    );
  }, 1000);

  setTimeout(() => {
    window.dispatchEvent(
      new MessageEvent('message', {
        data: {
          app: 'BANK',
          method: 'setCredentials',
          data: {
            name: 'Firstname Lastname',
            balance: 2000,
          },
        },
      })
    );
  }, 1000);

  setTimeout(() => {
    window.dispatchEvent(
      new MessageEvent('message', {
        data: {
          app: 'CONTACTS',
          method: 'setContacts',
          data: [
            {
              id: 1,
              display: 'Ruqen',
              number: '43534444',
            },
            {
              id: 1,
              display: 'Taso',
              number: '456466',
            },
          ],
        },
      })
    );
  }, 1000);

  setTimeout(() => {
    window.dispatchEvent(
      new MessageEvent('message', {
        data: {
          app: 'SIMCARD',
          method: 'setNumber',
          data: '111-1134',
        },
      })
    );
  }, 1000);

  setTimeout(() => {
    window.dispatchEvent(
      new MessageEvent('message', {
        data: {
          app: 'PHONE',
          method: 'setVisibility',
          data: true,
        },
      })
    );
  }, 1000);

  setTimeout(() => {
    window.dispatchEvent(
      new MessageEvent('message', {
        data: {
          app: 'NOTES',
          method: 'setNotes',
          data: [
            {
              id: 1,
              title: 'First note',
              content: 'Hello, this is my shitty note',
            },
            {
              id: 2,
              title: 'Second note',
              content: 'Hello, this is another shitty note',
            },
          ],
        },
      })
    );
  }, 1000);

  setTimeout(() => {
    window.dispatchEvent(
      new MessageEvent('message', {
        data: {
          app: 'BANK',
          method: 'setNotification',
          data: {
            id: 1,
            message: 'ahhaha',
          },
        },
      })
    );
  }, 1000);

  setTimeout(() => {
    new MessageEvent('messsage', {
      data: {
        app: 'TWITTER',
        method: 'setNotification',
        data: {
          id: 1,
          message: 'ahhaha',
        },
      },
    });
  }, 1000);

  setTimeout(() => {
    window.dispatchEvent(
      new MessageEvent('message', {
        data: {
          app: 'BANK',
          method: 'setTransaction',
          data: [
            {
              id: 1,
              amount: 200,
              type: 'Deposit',
              source: 'chip',
            },
            {
              id: 2,
              amount: 200,
              type: 'Withdraw',
              source: 'chip',
            },
            {
              id: 3,
              amount: 200,
              type: 'Withdraw',
              source: 'chip',
            },
            {
              id: 4,
              amount: 50,
              type: 'Deposit',
              source: 'chip',
            },
            {
              id: 4,
              amount: 50,
              type: 'Deposit',
              source: 'chip',
            },
            {
              id: 4,
              amount: 50,
              type: 'Deposit',
              source: 'chip',
            },
          ],
        },
      })
    );
  }, 1000);

  setTimeout(() => {
    window.dispatchEvent(
      new MessageEvent('message', {
        data: {
          app: 'SELLOUT',
          method: 'setListings',
          data: [
            {
              id: 1,
              name: 'Some guy',
              number: '123-4567',
              title: 'Car',
              description: 'Selling this cool car',
              url: 'https://i.imgur.com/ROmGTwi.jpeg',
            },
            {
              id: 2,
              name: 'Some other dude',
              number: '666-6666',
              title: 'Material',
              description: 'Selling my wife',
              url: '',
            },
          ],
        },
      })
    );
  }, 1000);
}

function Phone() {
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

  const { modal } = useModal(); // the calling modal

  const [settings] = useRecoilState(settingsState);

  if (visibility === false) {
    return null;
  }

  const currentTheme = () => createMuiTheme(config.themes[settings.theme]);

  document.onkeyup = function (data) {
    if (data.which === 27) {
      Nui.send('phone:close');
    }
  };

  return (
    <ThemeProvider theme={currentTheme()}>
      <div className='PhoneWrapper' style={{ transform: `scale(${settings.zoom})` }}>
        <div>
          <div className='Phone'>
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
                  notifications={[
                    {
                      key: 'newMessage',
                      icon: <NotificationIcon Icon={MessageIcon} />,
                    },
                  ]}
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
                </div>
                <Navigation />
              </>
            </div>
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
}

export default Phone;
