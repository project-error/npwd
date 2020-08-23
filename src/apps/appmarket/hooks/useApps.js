import React, { useEffect } from "react";
import { useConfig } from "../../../config/hooks/useConfig";
import { blue, grey, green, orange } from "@material-ui/core/colors";
import { useTranslation } from "react-i18next";
import ContactsIcon from "@material-ui/icons/Contacts";
import SettingsIcon from '@material-ui/icons/Settings'
import PhoneIcon from '@material-ui/icons/Phone';
import AccountBalanceIcon from '@material-ui/icons/AccountBalance';
import { atom } from "recoil";
import { useSettings } from "../../settings/hooks/useSettings";
import { CalculatorIcon } from "../../calculator/components/CalculatorIcon";

const appsState = atom({
  key: "apps",
  default: { preinstalled: [] },
});

export const useApps = () => {
  const [apps, setApps] = useConfig(appsState);
  const { currentTheme } = useSettings();
  const { t } = useTranslation();
  useEffect(() => {
    setApps("preinstalled", [
      {
        id: "phone",
        name: t("APPS_PHONE"),
        icon: <PhoneIcon />,
        backgroundColor: green[400],
        color: green[50],
        path: "/phone",
      },
      {
        id: "contacts",
        name: t("APPS_CONTACTS"),
        icon: <ContactsIcon />,
        backgroundColor: blue[500],
        color: blue[50],
        path: "/contacts",
      },
      {
        id: "calculator",
        name: t("APPS_CALCULATOR"),
        icon: <CalculatorIcon />,
        backgroundColor: currentTheme().palette.primary.light,
        color: currentTheme().palette.primary.contrastText,
        path: "/calculator",
      },
      {
        id: "settings",
        name: t("APPS_SETTINGS"),
        icon: <SettingsIcon />,
        backgroundColor: grey[700],
        color: grey[50],
        path: '/settings'
      },
      {
        id: 'bank',
        name: t('APPS_BANK'),
        icon: <AccountBalanceIcon />,
        backgroundColor: orange[600],
        color: orange[50],
        path: '/bank'
      },
    ]);
    // eslint-disable-next-line
  }, []);

  const allApps = [...apps.preinstalled];

  const getApp = (id) => allApps.find((a) => a.id === id) || {};

  return { apps, allApps, setApps, getApp };
};
