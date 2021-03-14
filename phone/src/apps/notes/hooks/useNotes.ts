import { useRecoilValue } from 'recoil';
import { Note } from '../../../../../typings/notes';
import { noteStates } from './state';

interface NotesProps {
  notes: Note[];
}

export const useNotes = (): NotesProps => {
  const notes = useRecoilValue(noteStates.noteItems);
  return { notes };
};
