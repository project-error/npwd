import React, { useState, useEffect } from "react";
import { useBankAlert } from "../../hooks/useBankAlert";
import Snackbar from "@material-ui/core/Snackbar";
import Alert from "./Alert";
import { useTranslation } from "react-i18next";

export const BankAlert = () => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const { bankAlert, setBankAlert } = useBankAlert();
  const [ message, setMessage ] = useState(null);
  const [severity, setSeverity] = useState("");

  const _handleClose = () => {
    setOpen(false);
    setBankAlert(null);
  };

  useEffect(() => {
    if (bankAlert === true ) {
      setOpen(true);
      setMessage(t("APPS_BANK_ALERT_TRANSFER_SUCCESS"));
      setSeverity("success")
    } else if (bankAlert === false) {
      setOpen(true);
      setMessage(t("APPS_BANK_ALERT_TRANSFER_FAILURE"));
      setSeverity("error")
    }
  }, [bankAlert])

  return (
    <Snackbar
      style={{ width: "80%" }}
      open={open}
      autoHideDuration={6000}
      onClose={_handleClose}
    >
      <Alert onClose={_handleClose} severity={severity}>
        {message}
      </Alert>
    </Snackbar>
  );
};