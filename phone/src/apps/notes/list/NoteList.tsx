import React from 'react';
import { Box, List, ListItem, ListItemText, Typography } from '@material-ui/core';
import { useNotesValue } from '../hooks/state';
import { useSetSelectedNote } from '../hooks/state';
import { NoteItem } from '../../../../../typings/notes';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { Notes } from '@material-ui/icons';

const useStyles = makeStyles((theme: Theme) => ({
  noNotes: {
    color: theme.palette.text.secondary,
  },
}));

// TODO: add search bar later
const NoteList = () => {
  const classes = useStyles();
  const notes = useNotesValue();
  const setNote = useSetSelectedNote();

  const handleNoteModal = (note: NoteItem) => {
    setNote(note);
  };

  if (notes && notes.length)
    return (
      <List disablePadding>
        {notes.map((note) => (
          <ListItem key={note.id} button divider onClick={() => handleNoteModal(note)}>
            <ListItemText>{note.title}</ListItemText>
          </ListItem>
        ))}
      </List>
    );

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      flexDirection="column"
      height="100%"
      className={classes.noNotes}
    >
      <Typography color="inherit" variant="h6" style={{ fontWeight: 300 }}>
        You have no notes
      </Typography>
    </Box>
  );
};

export default NoteList;
