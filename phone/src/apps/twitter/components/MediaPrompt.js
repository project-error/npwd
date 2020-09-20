import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { makeStyles } from "@material-ui/core/styles";
import { TextField } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  textField: {
    flex: "1 1 100%",
    padding: "10px 15px",
    marginTop: "15px",
  },
  textFieldInput: {
    fontSize: "22px",
  },
}));

export const MediaPrompt = ({ value, handleChange }) => {
  const { t } = useTranslation();
  const classes = useStyles();

  return (
    <TextField
      value={value}
      inputProps={{ className: classes.textFieldInput }}
      className={classes.textField}
      onChange={handleChange}
      multiline
      placeholder={t("APPS_TWITTER_MEDIA_PLACEHOLDER")}
    />
  );
};

export default MediaPrompt;
