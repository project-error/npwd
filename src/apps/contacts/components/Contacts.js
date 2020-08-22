import React from "react";
import { AppWrapper } from "../../../ui/components";
import { AppTitle } from "../../../ui/components/AppTitle";
import { AppContent } from "../../../ui/components/AppContent";
import { useTranslation } from "react-i18next";
import { useContacts } from "../hooks/useContacts";
import { ContactList } from "./ContactList";
import { useApps } from "../../appmarket/hooks/useApps";

export const ContactsApp = () => {
  const { contactList } = useContacts();
  const { getApp } = useApps();
  const { t } = useTranslation();
  return (
    <AppWrapper>
      <AppTitle color={getApp("contacts").backgroundColor}>
        {t("APPS_CONTACTS")}
      </AppTitle>
      <AppContent>
        <ContactList
          contacts={contactList}
          onCall={() => console.log("Calling")}
          onMessage={() => console.log("Opening messages")}
        />
      </AppContent>
    </AppWrapper>
  );
};
