import React, { forwardRef } from 'react';
import makeStyles from '@mui/styles/makeStyles';
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

interface ProfileFieldProps {
  label: string;
  value: string;
  handleChange?: (val: string) => void;
  allowChange?: boolean;
  multiline?: boolean;
  maxLength?: number;
}

const ProfileField = forwardRef<HTMLInputElement, ProfileFieldProps>(
  ({ label, value, handleChange, allowChange, multiline, maxLength }, ref) => {
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
          inputRef={ref}
        />
      </div>
    );
  },
);

ProfileField.defaultProps = {
  allowChange: true,
  maxLength: 200,
  multiline: false,
};

export default ProfileField;
