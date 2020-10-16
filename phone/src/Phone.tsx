import React from "react";
import "./Phone.css";
import "./i18n";
import { Route } from "react-router-dom";
import { useSettings } from "./apps/settings/hooks/useSettings";
import MessageIcon from "@material-ui/icons/Email";
import { CallModal } from "./modal/components/CallModal";
import { HomeApp } from "./apps/home/components/Home";
import { ThemeProvider } from "@material-ui/core";
import { useInitKeyboard } from "./os/keyboard/hooks/useKeyboard";
import { NotificationIcon } from "./os/notifications/components/NotificationIcon";
import { NotificationBar } from "./os/notifications/components/NotificationBar";
import { Navigation } from "./os/navigation-bar/components/Navigation";
import { useNuiService } from "./os/nui-events/hooks/useNuiService";
import { useSimcardService } from "./os/simcard/hooks/useSimcardService";
import { usePhoneService } from "./os/phone/hooks/usePhoneService";
import { useApps } from "./os/apps/hooks/useApps";

import { useContactsService } from "./apps/contacts/hooks/useContactsService";
import { useTwitterService } from "./apps/twitter/hooks/useTwitterService";
import { useSelloutService } from "./apps/sellout/hooks/useSelloutService";

//These events are just for testing. Comment it out before building.
setTimeout(() => {
  window.dispatchEvent(
    new MessageEvent("message", {
      data: {
        app: "SIMCARD",
        method: "setNumber",
        data: "111-1134",
      },
    })
  );
}, 1000);

setTimeout(() => {
  window.dispatchEvent(
    new MessageEvent("message", {
      data: {
        app: "BANK",
        method: "setContacts",
        data: [
          {
            id: 1,
            number: "345-4366",
            display: "Gjelten",
            avatar: 'https://i.imgur.com/Qpw6j8D.png'
          },
          {
            id: 2,
            number: "456-4366",
            display: "Loyd",
            avatar: ''
          },
          {
            id: 3,
            number: "123-4366",
            display: "Fabian",
            avatar: 'https://i.imgur.com/B8ta5Aa.jpeg'
          },
        ],
      },
    })
  );
}, 1000);

setTimeout(() => {
  window.dispatchEvent(
    new MessageEvent("message", {
      data: {
        app: "PHONE",
        method: "setVisibility",
        data: true,
      },
    })
  );
}, 1000);

setTimeout(() => {
  window.dispatchEvent(
    new MessageEvent("message", {
      data: {
        app: "SELLOUT",
        method: "setListings",
        data: [
          {
            id: 1,
            name: "Donald Trump",
            number: "123-4567",
            description:
              "This is me just selling the whole country, because like why not dude",
            img: "some shady link?",
          },
          {
            id: 2,
            name: "Joe Biden",
            number: "666-6666",
            description: "I think I might buy it Trump!",
            img: "even shadier link?",
          },
        ],
      },
    })
  );
});

function Phone() {
  useNuiService();
  const { visibility } = usePhoneService();
  const { settings, currentTheme } = useSettings();
  const { allApps } = useApps();
  useSimcardService();
  useContactsService();
  useTwitterService();
  useInitKeyboard();
  useSelloutService();

  if (visibility === false) {
    return null;
  }

  const calling = false;

  return (
    <ThemeProvider theme={currentTheme()}>
      <div className="PhoneWrapper">
        <div style={{ zoom: "80%" }}>
          <div className="Phone">
            <div
              className="PhoneFrame"
              style={{
                backgroundImage: `url(./media/frames/${settings.frame})`,
              }}
            ></div>
            <div
              id="phone"
              className="PhoneScreen"
              style={{
                backgroundImage: `url(./media/backgrounds/${settings.wallpaper})`,
              }}
            >
              <>
                <NotificationBar
                  notifications={[
                    {
                      key: "newMessage",
                      icon: <NotificationIcon Icon={MessageIcon} />,
                    },
                  ]}
                />
                <div className="PhoneAppContainer">
                  {calling ? (
                    <CallModal />
                  ) : (
                    <>
                      <Route exact path="/" component={HomeApp} />

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
