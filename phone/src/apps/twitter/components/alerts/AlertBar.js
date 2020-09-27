import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Snackbar from "@material-ui/core/Snackbar";
import { makeStyles } from "@material-ui/core/styles";

import { useProfile } from "../../hooks/useProfile";
import { useTweetStatus } from "../../hooks/useTweetStatus";
import Alert from "./Alert";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    bottom: "60px",
  },
}));

const ALERT_TIMEOUT = 4000;

export default function AlertBar() {
  const classes = useStyles();
  const { t } = useTranslation();
  const { updateSuccessful, setUpdateSuccessful } = useProfile();
  const { isSuccessful, setIsSuccessful } = useTweetStatus();
  const [severity, setSeverity] = useState(null);
  const [open, setOpen] = useState(null);
  const [message, setMessage] = useState(null);

  const handleClose = (event, reason) => {
    setOpen(false);
    setUpdateSuccessful(null);
    setIsSuccessful(null);
  };

  useEffect(() => {
    console.log(
      "isSuccessful: ",
      isSuccessful,
      " updateSuccessful: ",
      updateSuccessful
    );
    if (isSuccessful === true) {
      setOpen(true);
      setSeverity("success");
      setMessage(t("APPS_TWITTER_CREATE_SUCCESS"));
    } else if (isSuccessful === false) {
      setOpen(true);
      setSeverity("error");
      setMessage(t("APPS_TWITTER_CREATE_FAILED"));
    } else if (updateSuccessful === true) {
      setOpen(true);
      setSeverity("success");
      setMessage(t("APPS_TWITTER_EDIT_PROFILE_SUCCESS"));
    } else if (updateSuccessful === false) {
      setOpen(true);
      setSeverity("error");
      setMessage(t("APPS_TWITTER_EDIT_PROFILE_FAILURE"));
    }
  }, [updateSuccessful, isSuccessful]);

  return (
    <Snackbar
      autoHideDuration={ALERT_TIMEOUT}
      className={classes.root}
      open={open}
      onClose={handleClose}
    >
      <Alert onClose={handleClose} severity={severity}>
        {message}
      </Alert>
    </Snackbar>
  );
}
