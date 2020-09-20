import React from "react";
import { useConfig } from "../../../config/hooks/useConfig";
import {
  blue,
  common,
  grey,
  green,
  orange,
  purple,
  amber,
} from "@material-ui/core/colors";
import ContactsIcon from "@material-ui/icons/Contacts";
import SettingsIcon from "@material-ui/icons/Settings";
import PhoneIcon from "@material-ui/icons/Phone";
import AccountBalanceIcon from "@material-ui/icons/AccountBalance";
import MessageIcon from "@material-ui/icons/Message";
import AccessibilityIcon from "@material-ui/icons/Accessibility";
import { atom } from "recoil";
import { CalculatorIcon } from "../../../apps/calculator/components/CalculatorIcon";
import { Route } from "react-router-dom";
import { DialerApp } from "../../../apps/dialer/components/DialerApp";
import { ContactsApp } from "../../../apps/contacts/components/ContactsApp";
import { CalculatorApp } from "../../../apps/calculator/components/CalculatorApp";
import { SettingsApp } from "../../../apps/settings/components/SettingsApp";
import { BankApp } from "../../../apps/bank/components/BankApp";
import { MessagesApp } from "../../../apps/messages/components/MessagesApp";
import { TwitterApp } from "../../../apps/twitter/components/TwitterApp";

const appsState = atom({
  key: "apps",
  default: {
    preinstalled: [
      {
        id: "DIALER",
        nameLocale: "APPS_DIALER",
        icon: <PhoneIcon />,
        backgroundColor: green[400],
        color: green[50],
        path: "/phone",
        Route: () => <Route path="/phone" component={DialerApp} />,
      },
      {
        id: "MESSAGES",
        nameLocale: "APPS_MESSAGES",
        icon: <MessageIcon />,
        backgroundColor: amber[400],
        color: amber[50],
        path: "/messages",
        Route: () => <Route path="/messages" component={MessagesApp} />,
      },
      {
        id: "CONTACTS",
        nameLocale: "APPS_CONTACTS",
        icon: <ContactsIcon />,
        backgroundColor: blue[500],
        color: blue[50],
        path: "/contacts",
        Route: () => <Route path="/contacts" component={ContactsApp} />,
      },
      {
        id: "CALCULATOR",
        nameLocale: "APPS_CALCULATOR",
        icon: <CalculatorIcon />,
        backgroundColor: purple[500],
        color: grey[50],
        path: "/calculator",
        Route: () => <Route path="/calculator" component={CalculatorApp} />,
      },
      {
        id: "SETTINGS",
        nameLocale: "APPS_SETTINGS",
        icon: <SettingsIcon />,
        backgroundColor: grey[700],
        color: grey[50],
        path: "/settings",
        Route: () => <Route path="/settings" component={SettingsApp} />,
      },
      {
        id: "BANK",
        nameLocale: "APPS_BANK",
        icon: <AccountBalanceIcon />,
        backgroundColor: orange[600],
        color: orange[50],
        path: "/bank",
        Route: () => <Route path="/bank" component={BankApp} />,
      },
      {
        id: "TWITTER",
        nameLocale: "APPS_TWITTER",
        icon: <AccessibilityIcon />,
        backgroundColor: blue[600],
        color: common.white,
        path: "/twitter",
        Route: () => <Route path="/twitter" component={TwitterApp} />,
      },
    ],
  },
});

export const useApps = () => {
  const [apps, setApps] = useConfig(appsState);
  const allApps = [...apps.preinstalled];

  const getApp = (id) => allApps.find((a) => a.id === id) || null;

  return { apps, allApps, setApps, getApp };
};

export const useApp = (id) => {
  const { getApp } = useApps();
  return getApp(id);
};
