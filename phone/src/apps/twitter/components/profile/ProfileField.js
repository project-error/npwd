import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { TextField } from "@material-ui/core";

const useStyles = makeStyles({
  formContainer: {
    width: "100%",
    marginTop: "8px",
  },
  textField: {
    width: "100%",
  },
});

function ProfileField({ label, value, handleChange, allowChange, multiline }) {
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
        multiline={multiline}
      />
    </div>
  );
}

ProfileField.defaultProps = {
  allowChange: true,
  multiline: false,
};

export default ProfileField;
