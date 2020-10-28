import { List } from '@material-ui/core';
import React from 'react'
import { NoteItem } from './NoteItem';

// add search bar later
const NoteList = ({notes}) => {
  return (
    <List>
      {notes.map((note) => (
        <NoteItem key={note.id} {...note} />
      ))}
    </List>
  )
}

export default NoteList;
