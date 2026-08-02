import React, { useEffect } from 'react';
import { AppWrapper } from '@ui/components';
import { AppContent } from '@ui/components/AppContent';
import { AppTitle } from '@ui/components/AppTitle';
import { useApp } from '@os/apps/hooks/useApps';
import NoteList from './list/NoteList';
import { NoteModal } from './modal/NoteModal';
import { Plus } from 'lucide-react';
import { Button } from '@npwd/keyos';
import { NotesThemeProvider } from './providers/NotesThemeProvider';
import { useSetModalVisible, useSetSelectedNote } from './hooks/state';
import { LoadingSpinner } from '@ui/components/LoadingSpinner';
import { useQueryParams } from '@common/hooks/useQueryParams';
import { AddNoteExportData } from '@typings/notes';

export const NotesApp: React.FC = () => {
  const notesApp = useApp('NOTES');
  const setSelectedNote = useSetSelectedNote();
  const setModalVisible = useSetModalVisible();

  const onClickCreate = () => {
    setSelectedNote({ title: '', content: '' });
    setModalVisible(true);
  };

  const { title, content } = useQueryParams<AddNoteExportData>({ title: '', content: '' });

  useEffect(() => {
    // Whenever query data is present, open the note modal with that seed data.
    if (title || content) {
      setModalVisible(true);
      setSelectedNote({ title, content });
    } else {
      setModalVisible(false);
      setSelectedNote(null);
    }
  }, [setModalVisible, title, content, setSelectedNote]);

  return (
    <NotesThemeProvider>
      <AppWrapper id="notes-app">
        <AppTitle app={notesApp} />
        <NoteModal />
        <AppContent>
          <React.Suspense fallback={<LoadingSpinner />}>
            <NoteList />
          </React.Suspense>
        </AppContent>
        <Button
          className="absolute bottom-10 right-6 z-50 rounded-2xl bg-[color:var(--keyos-app-accent)] text-[color:var(--keyos-app-accent-foreground)] shadow-keyos-glow hover:brightness-110"
          onClick={onClickCreate}
          size="icon"
        >
          <Plus />
        </Button>
      </AppWrapper>
    </NotesThemeProvider>
  );
};
