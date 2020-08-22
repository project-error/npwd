import React, { useEffect } from "react";
import { useConfig } from "../../../config/hooks/useConfig";
import { blue, grey } from "@material-ui/core/colors";
import { useTranslation } from "react-i18next";
import ContactsIcon from "@material-ui/icons/Contacts";
import SettingsIcon from '@material-ui/icons/Settings'
import { atom } from "recoil";

const appsState = atom({
  key: 'apps',
  default: { preinstalled: [] }
});

export const useApps = () => {
  const [apps, setApps] = useConfig(appsState);
  const { t } = useTranslation();
  useEffect(() => {
    setApps("preinstalled", [
      {
        id: 'contacts',
        name: t('APPS_CONTACTS'),
        icon: <ContactsIcon />,
        backgroundColor: blue[500],
        color: blue[50],
        path: '/contacts'
      },
      {
        id: 'settings',
        name: t('APPS_SETTINGS'),
        icon: <SettingsIcon />,
        backgroundColor: grey[700],
        color: grey[50],
        path: '/settings'
      }
    ]);
    // eslint-disable-next-line
  }, []);

  const allApps = [...apps.preinstalled];

  const getApp = id => allApps.find(a => a.id === id) || {};

  return { apps, allApps, setApps, getApp };
};
