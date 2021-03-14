import { useRecoilState } from 'recoil';
import { Note } from '../../../../../typings/notes';
import { noteStates } from './state';

interface NoteDetailProps {
  detail: Note;
  setDetail: (note: object) => void;
}

export const useNoteDetail = (): NoteDetailProps => {
  const [detail, setDetail] = useRecoilState(noteStates.noteDetail);
  return { detail, setDetail };
};
