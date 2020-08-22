import React from "react";
import { useSettings } from "../../settings/hooks/useSettings";

export const AppIcon = ({ label, icon }) => {
  const [settings] = useSettings();
  return <span>{label}</span>;
};
