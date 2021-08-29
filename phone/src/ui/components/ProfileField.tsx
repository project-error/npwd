import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { TextField } from './Input';

const useStyles = makeStyles({
  formContainer: {
    width: '100%',
    marginTop: '8px',
  },
  textField: {
    width: '100%',
  },
});

const ProfileField = ({
  label,
  value,
  handleChange,
  allowChange,
  multiline,
  inputRef,
  maxLength,
}) => {
  const classes = useStyles();
  const _handleChange = (e) => handleChange(e.target.value);

  return (
    <div className={classes.formContainer}>
      <TextField
        className={classes.textField}
        label={label}
        value={value}
        onChange={_handleChange}
        disabled={!allowChange}
        inputProps={{
          maxLength: maxLength,
        }}
        multiline={multiline}
        inputRef={inputRef}
      />
    </div>
  );
};

ProfileField.defaultProps = {
  allowChange: true,
  maxLength: 200,
  multiline: false,
  inputRef: null,
};

export default ProfileField;
