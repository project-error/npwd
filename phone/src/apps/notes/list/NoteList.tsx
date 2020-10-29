import { List, ListItem, ListItemText } from '@material-ui/core';
import React, { useState } from 'react'

import { useNoteModal } from '../hooks/useNoteModal';
import { useNoteDetail } from '../hooks/useNoteDetail';

// add search bar later
const NoteList = ({notes}) => {

  const { noteModal, setNoteModal } = useNoteModal();
  const { detail, setDetail } = useNoteDetail();

  const handleNoteModal = (note) => {
    setNoteModal(true)
    setDetail(note)
    console.log(note.id)
  }

  return (
    <List>
      {notes.map((note) => (
        <ListItem key={note.id} button divider onClick={() => handleNoteModal(note)}>
          <ListItemText><strong>{note.title}</strong></ListItemText>
        </ListItem>
      ))}
    </List>
  )
}

export default NoteList;
