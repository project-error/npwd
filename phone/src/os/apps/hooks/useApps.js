import React from "react";
import { useConfig } from "../../../config/hooks/useConfig";
import { blue, grey, green, orange, purple } from "@material-ui/core/colors";
import ContactsIcon from "@material-ui/icons/Contacts";
import SettingsIcon from "@material-ui/icons/Settings";
import PhoneIcon from "@material-ui/icons/Phone";
import AccountBalanceIcon from "@material-ui/icons/AccountBalance";
import { atom } from "recoil";
import { CalculatorIcon } from "../../../apps/calculator/components/CalculatorIcon";

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
      },
      {
        id: "CONTACTS",
        nameLocale: "APPS_CONTACTS",
        icon: <ContactsIcon />,
        backgroundColor: blue[500],
        color: blue[50],
        path: "/contacts",
      },
      {
        id: "CALCULATOR",
        nameLocale: "APPS_CALCULATOR",
        icon: <CalculatorIcon />,
        backgroundColor: purple[500],
        color: grey[50],
        path: "/calculator",
      },
      {
        id: "SETTINGS",
        nameLocale: "APPS_SETTINGS",
        icon: <SettingsIcon />,
        backgroundColor: grey[700],
        color: grey[50],
        path: "/settings",
      },
      {
        id: "BANK",
        nameLocale: "APPS_BANK",
        icon: <AccountBalanceIcon />,
        backgroundColor: orange[600],
        color: orange[50],
        path: "/bank",
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
