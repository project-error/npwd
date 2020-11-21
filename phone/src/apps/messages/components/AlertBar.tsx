import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Snackbar } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import useAlerts from "../hooks/useAlerts";
import Alert from "../../../ui/components/Alert";

const useStyles = makeStyles(() => ({
  root: {
    width: "100%",
    bottom: "60px",
    position: 'absolute',
  },
}));

const ALERT_TIMEOUT = 6000;

export default function AlertBar() {
  const classes = useStyles();
  const { t } = useTranslation();
  const { createMessageGroupResult, setCreateMessageGroupResult } = useAlerts();
  const [severity, setSeverity] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleClose = () => {
    setOpen(false);
    setCreateMessageGroupResult(null);
  };

  useEffect(() => {
    if (!createMessageGroupResult) return;

    const { error, phoneNumber } = createMessageGroupResult
    if (error && phoneNumber) {
      const error = `${t("APPS_MESSAGES_INVALID_PHONE_NUMBER")}${phoneNumber}`;
      setOpen(true);
      setSeverity("error");
      setMessage(error);
    } else if (error) {
      setOpen(true);
      setSeverity("error");
      setMessage(t("APPS_MESSAGES_MESSAGE_GROUP_CREATE_FAILED"));
    }
  }, [createMessageGroupResult, t]);

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
