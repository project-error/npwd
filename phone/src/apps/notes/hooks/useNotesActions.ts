import { useSetNotes } from './state';
import { useCallback } from 'react';
import { NoteItem } from '../../../../../typings/notes';

interface UseNotesActionsValue {
  deleteNote: (id: number) => void;
  addNote: (note: NoteItem) => void;
  updateNote: (note: NoteItem) => void;
}

export const useNotesActions = (): UseNotesActionsValue => {
  const setNotes = useSetNotes();

  const deleteNote = useCallback(
    (id) => {
      setNotes((curNotes) => [...curNotes].filter((note) => note.id !== id));
    },
    [setNotes],
  );

  const addNote = useCallback(
    (note: NoteItem) => {
      setNotes((curNotes) => [...curNotes, note]);
    },
    [setNotes],
  );

  const updateNote = useCallback(
    (note: NoteItem) => {
      setNotes((curNotes) => {
        const targetIndex = curNotes.findIndex((storedNote) => storedNote.id === note.id);
        const newNotesArray = [...curNotes];
        newNotesArray[targetIndex] = note;
        return newNotesArray;
      });
    },
    [setNotes],
  );

  return { deleteNote, addNote, updateNote };
};
