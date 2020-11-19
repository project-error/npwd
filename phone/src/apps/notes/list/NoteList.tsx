import { List, ListItem, ListItemText } from '@material-ui/core';
import React, { useState } from 'react';

import { useNoteModal } from '../hooks/useNoteModal';
import { useNoteDetail } from '../hooks/useNoteDetail';

// add search bar later
// TODO: Add interface for note
const NoteList = ({ notes }) => {
  const { setNoteModal } = useNoteModal();
  const { setDetail } = useNoteDetail();

  const handleNoteModal = (note) => {
    setNoteModal(true);
    setDetail(note);
  };

  return (
    <List disablePadding>
      {notes.map((note) => (
        <ListItem
          key={note.id}
          button
          divider
          onClick={() => handleNoteModal(note)}
        >
          <ListItemText>{note.title}</ListItemText>
        </ListItem>
      ))}
    </List>
  );
};

export default NoteList;
