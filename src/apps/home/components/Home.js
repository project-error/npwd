import React from "react";
import { AppWrapper } from "../../../ui/components";
import { useSettings } from "../../settings/hooks/useSettings";
import { GridMenu } from "./GridMenu";
import { Box } from "@material-ui/core";
import { useApps } from "../../appmarket/hooks/useApps";

export const HomeApp = () => {
  const [settings] = useSettings();
  const [apps] = useApps();
  console.log(apps)
  return (
    <AppWrapper
      style={{
        backgroundImage: `${process.env.PUBLIC_URL}url(/media/backgrounds/${settings.wallpaper})`,
      }}
    >
      <Box padding={2}>{apps && <GridMenu apps={apps.preinstalled} />}</Box>
    </AppWrapper>
  );
};
