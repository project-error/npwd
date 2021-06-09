import React from 'react';
import { AppWrapper } from '../../ui/components';
import { AppContent } from '../../ui/components/AppContent';
import { AppTitle } from '../../ui/components/AppTitle';
import { useApp } from '../../os/apps/hooks/useApps';
import NoteList from './list/NoteList';
import { NoteModal } from './modal/NoteModal';
import { Fab } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import useStyles from './notes.styles';
import { NotesThemeProvider } from './providers/NotesThemeProvider';
import { Route } from 'react-router-dom';
import { useSetSelectedNote } from './hooks/state';
import { LoadingSpinner } from '../../ui/components/LoadingSpinner';

export const NotesApp = () => {
  const classes = useStyles();
  const notesApp = useApp('NOTES');
  const setSelectedNote = useSetSelectedNote();

  const onClickCreate = () => {
    setSelectedNote({ title: '', content: '' });
  };

  return (
    <NotesThemeProvider>
      <AppWrapper id="notes-app">
        <AppTitle app={notesApp} />
        <NoteModal />
        <AppContent>
          <React.Suspense fallback={<LoadingSpinner />}>
            <Route path="/notes" component={NoteList} />
          </React.Suspense>
        </AppContent>
        <Fab className={classes.absolute} onClick={onClickCreate} color="primary">
          <AddIcon />
        </Fab>
      </AppWrapper>
    </NotesThemeProvider>
  );
};
