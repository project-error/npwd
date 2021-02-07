import React, { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';
import { TextField } from '@material-ui/core';
import { usePhone } from '../../../../os/phone/hooks/usePhone';
import { getNewLineCount } from '../../utils/message';

const useStyles = makeStyles({
  textField: {
    flex: '1 1 100%',
    padding: '10px 15px',
    marginTop: '15px',
    overflowY: 'auto',
    maxHeight: '300px',
  },
  textFieldInput: {
    fontSize: '22px',
    paddingTop: '8px'
  },
});

export const TweetMessage = ({ message, handleChange }) => {
  const textFieldRef = useRef(null);
  const classes = useStyles();
  const { config } = usePhone();
  const { t } = useTranslation();

  if (!config) return null;
  const { characterLimit, newLineLimit } = config.twitter;

  const _handleChange = (e) => {
    // when the user types scroll the text field to the bottom
    // so that we always have the latest line and error message
    // in view
    e.preventDefault();
    textFieldRef.current.scrollTop = textFieldRef.current.scrollHeight;
    handleChange(e.target.value);
  }
  
  let errorMessage = null;

  const overCharacterLimit =
    message.trim().length > characterLimit;
  const characterWarningPrompt = `${t(
    'APPS_TWITTER_TWEET_MESSAGE_CHAR_LIMIT'
  )} (${characterLimit})`;

  const overNewLineLimit = getNewLineCount(message) > newLineLimit;
  const newLineWarningPrompt = `${t(
    'APPS_TWITTER_TWEET_MESSAGE_NEW_LINE_LIMIT'
  )} (${newLineLimit})`;

  if (overCharacterLimit) {
    errorMessage = characterWarningPrompt;
  } else if (overNewLineLimit) {
    errorMessage = newLineWarningPrompt;
  }

  return (
    <TextField
      value={message}
      inputProps={{ className: classes.textFieldInput }}
      className={classes.textField}
      onChange={_handleChange}
      multiline
      placeholder={t('APPS_TWITTER_TWEET_MESSAGE_PLACEHOLDER')}
      inputRef={(input) => input && input.focus()}
      error={errorMessage !== null}
      helperText={errorMessage || null}
      ref={textFieldRef}
    />
  );
};

export default TweetMessage;
