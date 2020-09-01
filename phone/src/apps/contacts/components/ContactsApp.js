import React from "react";
import { AppWrapper } from "../../../ui/components";
import { AppTitle } from "../../../ui/components/AppTitle";
import { AppContent } from "../../../ui/components/AppContent";
import { ContactList } from "./ContactList";
import { useApp } from "../../../os/apps/hooks/useApps";
import { AddContactModal } from "./ContactModal";

export const ContactsApp = () => {
  const contacts = useApp("CONTACTS");
  return (
    <AppWrapper>
      <AppTitle app={contacts} />
      <AppContent>
        <ContactList />
        <AddContactModal />
      </AppContent>
    </AppWrapper>
  );
};
