import React from "react";
import { makeStyles, Button, TextField } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    margin: "auto",
    textAlign: "center",
  },
  input: {
    marginBottom: 25,
  },
  textFieldInput: {
    fontSize: 22,
  },
  multilineFieldInput: {
    fontSize: 20,
  },
  postButton: {
    display: "block",
    margin: "auto",
    background: "#f44336",
    width: "80%",
    fontSize: 20,
  },
}));

export const ListingForm = () => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <h1>New Listing</h1>
      <TextField
        className={classes.input}
        placeholder="Title on listing.."
        inputProps={{ className: classes.textFieldInput }}
        style={{ width: "80%" }}
        size="medium"
      />

      <TextField
        className={classes.input}
        placeholder="Image URL"
        inputProps={{ className: classes.textFieldInput }}
        style={{ width: "80%" }}
        size="medium"
        variant="outlined"
      />

      <TextField
        className={classes.input}
        placeholder="Description"
        inputProps={{ className: classes.multilineFieldInput }}
        style={{ width: "80%" }}
        size="medium"
        multiline
        rows={4}
        variant="outlined"
      />

      <Button className={classes.postButton}>Post</Button>
    </div>
  );
};
