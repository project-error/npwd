import { useRecoilState } from 'recoil';
import { Note } from '../../../common/typings/notes';
import { useNuiFetch } from '../../../os/nui-events/hooks/useNuiFetch';
import { noteStates } from './state';

interface NoteDetailProps {
  detail: Note;
  setDetail: (note: Partial<Note> | ((c: Partial<Note>) => Partial<Note>)) => void;
  addNote: (note: Partial<Note>) => void;
  deleteNote: (note: Pick<Note, 'id'>) => void;
  updateNote: (note: Note) => void;
  isLoading: boolean;
}

export const useNoteDetail = (): NoteDetailProps => {
  const [detail, setDetail] = useRecoilState(noteStates.noteDetail);

  const [deleteNote, { loading: deleteLoading }] = useNuiFetch('phone:deleteNote');
  const [addNote, { loading: addLoading }] = useNuiFetch('phone:addNote');
  const [updateNote, { loading: updateLoading }] = useNuiFetch('phone:updateNote');

  const isLoading = deleteLoading || addLoading || updateLoading;

  return { detail, setDetail, addNote, deleteNote, updateNote, isLoading };
};
