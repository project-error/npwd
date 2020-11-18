import React from 'react'

import { yellow } from "@material-ui/core/colors";

import useStyles from './notes.styles';

import { Paper } from "@material-ui/core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStickyNote } from "@fortawesome/free-solid-svg-icons";

const NotesTitle = () => {
  const classes = useStyles()
  return (
    <Paper elevation={24} square variant="outlined" className={classes.header}>
      <FontAwesomeIcon icon={faStickyNote} color={yellow[800]} size="lg" />
    </Paper>
  )
}

export default NotesTitle;