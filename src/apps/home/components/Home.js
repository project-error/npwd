import React from "react";
import { AppWrapper } from "../../../ui/components";
import { Box } from "@material-ui/core";
import { useApps } from "../../appmarket/hooks/useApps";
import { GridMenu } from "../../../ui/components/GridMenu";

export const HomeApp = () => {
  const { apps } = useApps();
  return (
    <AppWrapper>
      <Box width="100%" mt={6} px={1}>{apps && <GridMenu items={apps.preinstalled} />}</Box>
    </AppWrapper>
  );
};
