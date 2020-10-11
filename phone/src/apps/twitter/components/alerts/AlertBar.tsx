import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Snackbar } from "@material-ui/core";
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
  const { updateProfileSuccessful, setUpdateProfileSuccessful } = useProfile();
  const { createTweetSuccessful, setCreateTweetSuccessful } = useTweetStatus();
  const [severity, setSeverity] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState(null);

  const handleClose = () => {
    setOpen(false);
    setUpdateProfileSuccessful(null);
    setCreateTweetSuccessful(null);
  };

  useEffect(() => {
    if (createTweetSuccessful === true) {
      setOpen(true);
      setSeverity("success");
      setMessage(t("APPS_TWITTER_CREATE_SUCCESS"));
    } else if (createTweetSuccessful === false) {
      setOpen(true);
      setSeverity("error");
      setMessage(t("APPS_TWITTER_CREATE_FAILED"));
    } else if (updateProfileSuccessful === true) {
      setOpen(true);
      setSeverity("success");
      setMessage(t("APPS_TWITTER_EDIT_PROFILE_SUCCESS"));
    } else if (updateProfileSuccessful === false) {
      setOpen(true);
      setSeverity("error");
      setMessage(t("APPS_TWITTER_EDIT_PROFILE_FAILURE"));
    }
  }, [updateProfileSuccessful, createTweetSuccessful, t]);

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
