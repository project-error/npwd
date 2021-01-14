import React from 'react';
import { AppWrapper } from '../../ui/components/AppWrapper';
import { AppContent } from '../../ui/components/AppContent';
import { AppTitle } from '../../ui/components/AppTitle';
import { useApp } from '../../os/apps/hooks/useApps';
import NoteList from './list/NoteList';

import { useNotes } from './hooks/useNotes';
import { NoteModal } from './modal/NoteModal';
import { Fab } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';

import { useNoteModal } from './hooks/useNoteModal';
import { useNoteDetail } from './hooks/useNoteDetail';

import useStyles from './notes.styles';

export const NotesApp = () => {
  const { setNoteModal } = useNoteModal();
  const { detail, setDetail } = useNoteDetail();
  const { notes } = useNotes();
  const notesApp = useApp('NOTES');

  const classes = useStyles();

  const handleModal = () => {
    setNoteModal(true);
    setDetail(null);
  };

  return (
    <AppWrapper id='notes-app'>
      <AppTitle app={notesApp} />
      <NoteModal key={detail?.id} />
      <AppContent>
        <NoteList notes={notes} />
        <Fab
          className={classes.absolute}
          onClick={handleModal}
          style={{
            background: '#f9a825',
            color: '#fff',
          }}
        >
          <AddIcon />
        </Fab>
      </AppContent>
    </AppWrapper>
  );
};
