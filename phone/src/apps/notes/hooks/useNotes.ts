import { useRecoilValue } from 'recoil';
import { noteStates } from './state'; 

export const useNotes = () => {
  const notes = useRecoilValue(noteStates.noteItems);
  return notes;
}
