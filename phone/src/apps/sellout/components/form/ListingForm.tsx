import React, { useState } from "react";
import { makeStyles, Button, TextField } from "@material-ui/core";
import Nui from "../../../../os/nui-events/utils/Nui";

import "../Sellout.css"

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

  const [ title, setTitle ] = useState('');
  const [ url, setUrl ] = useState('');
  const [ desc, setDesc ] = useState('');

  const addListing = () => {
    Nui.send('phone:addListing', {
      title,
      url,
      desc
    })
  }

  return (
    <div className={classes.root}>
      <h1>New Listing</h1>
      <TextField
        className={classes.input}
        onChange={e => setTitle(e.target.value)}
        placeholder="Title on listing.."
        inputProps={{ className: classes.textFieldInput }}
        style={{ width: "80%" }}
        size="medium"
      />

      <TextField
        className={classes.input}
        placeholder="Image URL"
        onChange={e => setUrl(e.target.value)}
        inputProps={{ className: classes.textFieldInput }}
        style={{ width: "80%" }}
        size="medium"
        variant="outlined"
      />

      <TextField
        className={classes.input}
        onChange={e => setDesc(e.target.value)}
        placeholder="Description"
        inputProps={{ className: classes.multilineFieldInput }}
        style={{ width: "80%" }}
        size="medium"
        multiline
        rows={4}
        variant="outlined"
      />

      <Button onClick={addListing} className={classes.postButton}>Post</Button>
    </div>
  );
};
