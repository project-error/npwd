import { useSetNotes } from './state';
import { useCallback } from 'react';
import { NoteItem } from '../../../../../typings/notes';

interface UseNotesActionsValue {
  deleteLocalNote: (id: number) => void;
  addLocalNote: (note: NoteItem) => void;
  updateLocalNote: (note: NoteItem) => void;
}

export const useNotesActions = (): UseNotesActionsValue => {
  const setNotes = useSetNotes();

  const deleteLocalNote = useCallback(
    (id) => {
      setNotes((curNotes) => [...curNotes].filter((note) => note.id !== id));
    },
    [setNotes],
  );

  const addLocalNote = useCallback(
    (note: NoteItem) => {
      setNotes((curNotes) => [...curNotes, note]);
    },
    [setNotes],
  );

  const updateLocalNote = useCallback(
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

  return { deleteLocalNote, addLocalNote, updateLocalNote };
};
