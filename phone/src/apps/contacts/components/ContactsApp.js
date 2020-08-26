import React from "react";
import { AppWrapper } from "../../../ui/components";
import { AppTitle } from "../../../ui/components/AppTitle";
import { AppContent } from "../../../ui/components/AppContent";
import { useContacts } from "../hooks/useContacts";
import { ContactList } from "./ContactList";
import { useApp } from "../../../os/apps/hooks/useApps";

export const ContactsApp = () => {
  const { contactList } = useContacts();
  const contacts = useApp("CONTACTS");
  return (
    <AppWrapper>
      <AppTitle {...contacts} />
      <AppContent>
        <ContactList
          contacts={contactList}
          onCall={(contact) => console.log(contact)}
          onMessage={() => console.log("Opening messages")}
        />
      </AppContent>
    </AppWrapper>
  );
};
