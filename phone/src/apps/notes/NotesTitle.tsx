import React from 'react'

import useStyles from './notes.styles';

import { Paper } from "@material-ui/core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStickyNote } from "@fortawesome/free-solid-svg-icons";

const NotesTitle = () => {
  const classes = useStyles()
  return (
    <Paper elevation={24} square variant="outlined" className={classes.header}>
      <FontAwesomeIcon icon={faStickyNote} style={{  }} size="lg" />
    </Paper>
  )
}

export default NotesTitle;