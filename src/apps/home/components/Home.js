import React from "react";
import { AppWrapper } from "../../../ui/components";
import { GridMenu } from "./GridMenu";
import { Box } from "@material-ui/core";
import { useApps } from "../../appmarket/hooks/useApps";

export const HomeApp = () => {
  const [apps] = useApps();
  return (
    <AppWrapper>
      <Box width="100%" mt={6} px={1}>{apps && <GridMenu apps={apps.preinstalled} />}</Box>
    </AppWrapper>
  );
};
