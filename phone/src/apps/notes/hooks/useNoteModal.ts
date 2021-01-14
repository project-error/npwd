import { useRecoilState } from 'recoil';
import { noteStates } from './state';

interface NoteModalProps {
  noteModal: boolean;
  setNoteModal: (show: boolean) => void;
}

export const useNoteModal = (): NoteModalProps => {
  const [noteModal, setNoteModal] = useRecoilState(noteStates.noteModal);
  return { noteModal, setNoteModal }; 
}