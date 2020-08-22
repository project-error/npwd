import React from "react";
import { AppWrapper } from "../../../ui/components";
import { useSettings } from "../../settings/hooks/useSettings";
import { GridMenu } from "./GridMenu";
import { Box } from "@material-ui/core";

export const HomeApp = () => {
  const [settings] = useSettings();
  return (
    <AppWrapper
      style={{
        backgroundImage: `${process.env.PUBLIC_URL}url(/media/backgrounds/${settings.wallpaper})`,
      }}
    >
      <Box padding={2}>
        <GridMenu apps={settings.apps} />
      </Box>
    </AppWrapper>
  );
};
