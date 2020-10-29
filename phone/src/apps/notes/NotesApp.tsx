import React from 'react'
import { AppWrapper } from '../../ui/components/AppWrapper';
import { AppContent } from '../../ui/components/AppContent';
import NotesTitle from './NotesTitle';
import NoteList from './list/NoteList';


import { useNotes } from './hooks/useNotes';
import { NoteModal } from './modal/NoteModal';
import { Fab } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';

import { useNoteModal } from './hooks/useNoteModal';

import useStyles from './notes.styles';

export const NotesApp = () => {
  const { noteModal, setNoteModal } = useNoteModal();
  const notes = useNotes();

  const classes = useStyles();

  const handleModal = () => {
    setNoteModal(true)
  }

  return (
    <AppWrapper id="notes-app">
      <NotesTitle />
      <NoteModal />
      <AppContent>
        <NoteList notes={notes}/>
        <Fab 
          className={classes.absolute}
          onClick={handleModal}
          style={{
            background: '#f9a825',
            color: '#fff'
          }}
        >
          <AddIcon />
        </Fab>
      </AppContent>
    </AppWrapper>
  )
}
