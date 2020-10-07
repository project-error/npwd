import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Fab } from "@material-ui/core";
import PublishIcon from "@material-ui/icons/Publish";

import { useProfile } from "../../hooks/useProfile";

const useStyles = makeStyles((theme) => ({
  root: {
    position: "absolute",
    bottom: "15px",
    right: "15px",
  },
  button: {
    background: "#00acee",
  },
}));

const MINIMUM_LOAD_TIME = 750;

export function ProfileUpdateButton({ handleClick }) {
  const classes = useStyles();
  const [minimumLoadPassed, setMimimumLoadPassed] = useState(true);
  const { updateProfileLoading } = useProfile();

  useEffect(() => {
    setMimimumLoadPassed(false);
    const timeout = window.setTimeout(() => {
      setMimimumLoadPassed(true);
    }, MINIMUM_LOAD_TIME);
    return () => window.clearTimeout(timeout);
  }, [updateProfileLoading]);

  const isLoading = updateProfileLoading || !minimumLoadPassed;

  return (
    <div className={classes.root}>
      <Fab
        className={classes.button}
        color="primary"
        onClick={handleClick}
        disabled={isLoading}
      >
        <PublishIcon />
      </Fab>
    </div>
  );
}

export default ProfileUpdateButton;
