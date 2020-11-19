import React from "react";
import { AppWrapper } from "../../../ui/components";
import { AppTitle } from "../../../ui/components/AppTitle";
import { AppContent } from "../../../ui/components/AppContent";
import { useApp } from "../../../os/apps/hooks/useApps";
import MessagesList from "./list/MessagesList";
import { MessageModal } from "./modal/MessageModal";
import NewMessageGroupButton from "./buttons/NewMessageGroupButton";
import './messages.css'

export const MessagesApp = () => {
  const messages = useApp("MESSAGES");
  return (
    <AppWrapper id="messages-app">
      <AppTitle app={messages} />
      <MessageModal /> 
      <AppContent>
        <MessagesList />
        <NewMessageGroupButton />
      </AppContent>
    </AppWrapper>
  );
};
