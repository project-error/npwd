import React from "react";

import { AppWrapper } from "../../../ui/components";
import { AppTitle } from "../../../ui/components/AppTitle";
import { AppContent } from "../../../ui/components/AppContent";
import { useApp } from "../../../os/apps/hooks/useApps";

export const ExampleApp = () => {
  const example = useApp("EXAMPLE");
  return (
    <AppWrapper>
      <AppTitle app={example} />
      <AppContent>
        <h1>This is an example</h1>
      </AppContent>
    </AppWrapper>
  );
};
