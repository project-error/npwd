import { useRecoilState } from 'recoil';
import { noteStates } from './state';

export const useNoteModal = () => {
  const [noteModal, setNoteModal] = useRecoilState(noteStates.noteModal);
  return { noteModal, setNoteModal }; 
}