import React from "react";
import "./Phone.css";
import "./i18n";
import { Route } from "react-router-dom";
import { useSettings } from "./apps/settings/hooks/useSettings";
import MessageIcon from "@material-ui/icons/Email";

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

// @TODO: Remove this testing shit
// Used for testing NUI events while we work on clientside
setTimeout(() => {
  window.dispatchEvent(
    new MessageEvent("message", {
      data: {
        app: "SIMCARD",
        method: "setNumber",
        data: "111-1111",
      },
    })
  );
}, 1000);

//setTimeout(() => {
//  window.dispatchEvent(
//    new MessageEvent("message", {
//      data: {
//        app: "PHONE",
//        method: "setVisibility",
//        data: true,
//      },
//    })
//  );
//}, 1000);

function Phone() {
  useNuiService();
  const { visibility, powerOff } = usePhoneService();
  const { settings, currentTheme } = useSettings();
  const { allApps } = useApps();
  useSimcardService();
  useInitKeyboard();

  if (visibility === false) {
    return null;
  }

  const screenStyle = powerOff
    ? {
        backgroundColor: "black",
      }
    : {
        backgroundImage: `url(${process.env.PUBLIC_URL}/media/backgrounds/${settings.wallpaper})`,
      };

  return (
    <ThemeProvider theme={currentTheme()}>
      <div className="PhoneWrapper">
        <div style={{ zoom: "80%" }}>
          <div className="Phone">
            <div
              className="PhoneFrame"
              style={{
                backgroundImage: `url(${process.env.PUBLIC_URL}/media/frames/${settings.frame})`,
              }}
            ></div>
            <div id="phone" className="PhoneScreen" style={screenStyle}>
              {!powerOff && (
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
                    <Route exact path="/" component={HomeApp} />
                    {allApps.map((App) => (
                      <App.Route key={App.id} />
                    ))}
                  </div>
                  <Navigation />
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
}

export default Phone;
