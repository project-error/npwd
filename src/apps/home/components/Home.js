import React from "react";
import { AppWrapper } from "../../../ui/components";
import { useSettings } from "../../settings/hooks/useSettings";
import { GridMenu } from "./GridMenu";

export const HomeApp = () => {
  const [settings] = useSettings();
  return (
    <AppWrapper
      style={{
        backgroundImage: `${process.env.PUBLIC_URL}url(/media/backgrounds/${settings.wallpaper})`,
      }}
    >
      <GridMenu apps={settings.apps} />
    </AppWrapper>
  );
};
