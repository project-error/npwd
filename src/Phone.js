import React from "react";
import "./Phone.css";
import "./i18n";
import { Route } from "react-router-dom";
import { HomeApp } from "./apps/home/components/Home";
import { ContactsApp } from "./apps/contacts/components/Contacts";
import { NotificationBar } from "./os/components/NotificationBar";
import { useSettings } from "./apps/settings/hooks/useSettings";
import MessageIcon from "@material-ui/icons/Email";
import { NotificationIcon } from "./os/components/NotificationIcon";

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
          </div>
        </div>
      </div>
    </div>
  );
}

export default Phone;
