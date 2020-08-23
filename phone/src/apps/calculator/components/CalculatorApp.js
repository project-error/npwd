import React from "react";
import { AppWrapper } from "../../../ui/components";
import { AppTitle } from "../../../ui/components/AppTitle";
import { AppContent } from "../../../ui/components/AppContent";
import { useTranslation } from "react-i18next";
import { useApps } from "../../appmarket/hooks/useApps";
import { Calculator } from "./Calculator";

export const CalculatorApp = () => {
  const { t } = useTranslation();
  const { getApp } = useApps();
  return (
    <AppWrapper>
      <AppTitle color={getApp("calculator").backgroundColor}>
        {t("APPS_CALCULATOR")}
      </AppTitle>
      <AppContent>
        <Calculator />
      </AppContent>
    </AppWrapper>
  );
};
