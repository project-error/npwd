import React from "react";
import { makeStyles } from "@material-ui/core";
import { AppWrapper } from "../../ui/components/AppWrapper";
import { AppTitle } from "../../ui/components/AppTitle";
import { AppContent } from "../../ui/components/AppContent";
import { Button } from "../../ui/components/Button";

export const CallModal = () => {
  return (
    <AppWrapper>
      <AppTitle app="Call" />
      <AppContent>
        <h1
          style={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          Call
        </h1>
      </AppContent>
    </AppWrapper>
  );
};
