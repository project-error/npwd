import React, { memo, useCallback, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';
import { TextField } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  textField: {
    flex: '1 1 100%',
    padding: '10px 15px',
    marginTop: '15px',
  },
  textFieldInput: {
    fontSize: '22px',
  },
}));

export const ImagePrompt = ({ visible, value, handleChange }) => {
  const textFieldRef = useRef(null);
  const { t } = useTranslation();
  const classes = useStyles();

  useEffect(() => {
    textFieldRef.current && textFieldRef.current.focus();
  }, [visible]);

  const handleImageChange = useCallback(e => handleChange(e.target.value), []);

  if (!visible) return null;
  return (
    <TextField
      value={value}
      inputProps={{ className: classes.textFieldInput }}
      className={classes.textField}
      onChange={handleImageChange}
      multiline
      size='small'
      placeholder={t('APPS_TWITTER_IMAGE_PLACEHOLDER')}
      inputRef={textFieldRef}
    />
  );
};

export default memo(ImagePrompt);
