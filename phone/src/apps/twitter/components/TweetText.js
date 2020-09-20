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

export const TweetText = ({ text, setText }) => {
  const classes = useStyles();
  const { t } = useTranslation();

  return (
    <TextField
      value={text}
      inputProps={{ className: classes.textFieldInput }}
      className={classes.textField}
      onChange={(e) => setText(e.target.value)}
      multiline
      placeholder={t("APPS_TWITTER_PLACEHOLDER")}
    />
  );
};

export default TweetText;
