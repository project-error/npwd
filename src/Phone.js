import React from "react";
import "./Phone.css";
import "./i18n";
import MessageIcon from "@material-ui/icons/Email";
import { Route } from "react-router-dom";
import { HomeApp } from "./apps/home/components/Home";
import { ContactsApp } from "./apps/contacts/components/Contacts";
import { useSettings } from "./apps/settings/hooks/useSettings";
import { NotificationBar } from "./os/components/NotificationBar";
import { NotificationIcon } from "./os/components/NotificationIcon";
import { NavigationBar } from "./os/components/NavigationBar";

function Phone() {
  const [settings] = useSettings();
  return (
    <div className="PhoneWrapper">
      <div style={{ zoom: "80%" }}>
        <div className="Phone">
          <div
            className="PhoneFrame"
            style={{
              backgroundImage: `${process.env.PUBLIC_URL}url(/media/frames/${settings.frame})`,
            }}
          ></div>
          <div
            id="phone"
            className="PhoneScreen"
            style={{
              backgroundImage: `${process.env.PUBLIC_URL}url(/media/backgrounds/${settings.wallpaper})`,
            }}
          >
            <NotificationBar notifications={[<NotificationIcon Icon={MessageIcon} />]} />
            <div className="PhoneAppContainer">
              <Route exact path="/" component={HomeApp} />
              <Route exact path="/contacts" component={ContactsApp} />
            </div>
            <NavigationBar />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Phone;
