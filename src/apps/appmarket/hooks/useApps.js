import React, { createContext, useEffect } from "react";
import { useConfig } from "../../../config/hooks/useConfig";
import ContactsIcon from "@material-ui/icons/Contacts";
import { blue } from "@material-ui/core/colors";

const AppsContext = createContext(null);

export const useApps = () => {
  const [apps, setApps] = useConfig(AppsContext);

  useEffect(() => {
    setApps("preinstalled", [
      {
        name: "Contacts",
        icon: <ContactsIcon />,
        backgroundColor: blue[500],
        color: blue[50]
      },
      {
        name: "Contacts1",
      },
      {
        name: "Contacts2",
      },
      {
        name: "Contacts3",
      },
      {
        name: "Contacts4",
      },
    ]);
    // eslint-disable-next-line
  }, []);

  return [apps, setApps];
};
