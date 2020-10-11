import React from "react";
import { AppWrapper } from "../../../ui/components";
import { AppTitle } from "../../../ui/components/AppTitle";
import { AppContent } from "../../../ui/components/AppContent";
import { Calculator } from "./Calculator";
import { useApp } from "../../../os/apps/hooks/useApps";

export const CalculatorApp = () => {
  const calculator = useApp("CALCULATOR");
  return (
    <AppWrapper>
      <AppTitle app={calculator} />
      <AppContent>
        <Calculator />
      </AppContent>
    </AppWrapper>
  );
};
