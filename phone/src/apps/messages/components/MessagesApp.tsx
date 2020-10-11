import React from "react";
import { AppWrapper } from "../../../ui/components";
import { AppTitle } from "../../../ui/components/AppTitle";
import { AppContent } from "../../../ui/components/AppContent";
import { useApp } from "../../../os/apps/hooks/useApps";

export const MessagesApp = () => {
  const messages = useApp("MESSAGES");
  return (
    <AppWrapper>
      <AppTitle app={messages} />
      <AppContent>
        <h1>Fuck off</h1>
      </AppContent>
    </AppWrapper>
  );
};
