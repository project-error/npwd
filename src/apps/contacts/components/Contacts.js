import React from "react";
import { AppWrapper } from "../../../ui/components";
import { useSettings } from "../../settings/hooks/useSettings";
import { Box } from "@material-ui/core";

export const ContactsApp = () => {
  const [settings] = useSettings();
  return (
    <AppWrapper>
      <Box padding={2}>
        Contacts !!!
      </Box>
    </AppWrapper>
  );
};
