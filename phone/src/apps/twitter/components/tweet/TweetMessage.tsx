import React, { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { makeStyles } from "@material-ui/core/styles";
import { TextField } from "@material-ui/core";
import { usePhone } from "../../../../os/phone/hooks/usePhone";

const useStyles = makeStyles((theme) => ({
  textField: {
    flex: "1 1 100%",
    padding: "10px 15px",
    marginTop: "15px",
  },
  textFieldInput: {
    fontSize: "22px",
  },
  display: {
    height: "200px",
  },
}));

export const TweetMessage = ({ message, handleChange }) => {
  const classes = useStyles();
  const { config } = usePhone();
  const { t } = useTranslation();

  const overCharacterLimit =
    message.trim().length > config.twitter.characterLimit;
  const characterWarningPrompt = `${t(
    "APPS_TWITTER_TWEET_MESSAGE_CHAR_LIMIT"
  )} (${config.twitter.characterLimit})`;

  return (
    <TextField
      value={message}
      inputProps={{ className: classes.textFieldInput }}
      className={classes.textField}
      onChange={handleChange}
      multiline
      placeholder={t("APPS_TWITTER_TWEET_MESSAGE_PLACEHOLDER")}
      inputRef={(input) => input && input.focus()}
      error={overCharacterLimit}
      helperText={overCharacterLimit ? characterWarningPrompt : null}
    />
  );
};

export default TweetMessage;
