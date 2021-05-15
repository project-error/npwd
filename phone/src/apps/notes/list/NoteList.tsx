import React from 'react';
import { List, ListItem, ListItemText } from '@material-ui/core';
import { useNoteDetail } from '../hooks/useNoteDetail';
import { useNotes } from '../hooks/useNotes';

// TODO: add search bar later
const NoteList = () => {
  const { notes } = useNotes();
  const { setDetail } = useNoteDetail();

  const handleNoteModal = (note) => {
    setDetail(note);
  };

  return (
    <List disablePadding>
      {notes.map((note) => (
        <ListItem key={note.id} button divider onClick={() => handleNoteModal(note)}>
          <ListItemText>{note.title}</ListItemText>
        </ListItem>
      ))}
    </List>
  );
};

export default NoteList;
