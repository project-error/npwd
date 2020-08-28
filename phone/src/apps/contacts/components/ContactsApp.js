import React from "react";
import { AppWrapper } from "../../../ui/components";
import { AppTitle } from "../../../ui/components/AppTitle";
import { AppContent } from "../../../ui/components/AppContent";
import { ContactList } from "./ContactList";
import { useApp } from "../../../os/apps/hooks/useApps";
import { Button } from "../../../ui/components/Button";
import AddCircleIcon from "@material-ui/icons/AddCircle";

export const ContactsApp = () => {
  const contacts = useApp("CONTACTS");
  return (
    <AppWrapper>
      <AppTitle app={contacts} />
      <AppContent>
        <ContactList />
        <Button fullWidth>
          <AddCircleIcon />
        </Button>
      </AppContent>
    </AppWrapper>
  );
};
