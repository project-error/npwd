import { useRecoilState } from 'recoil';
import { noteStates } from './state';

export const useNoteDetail = (): any => {
  const [detail, setDetail] = useRecoilState(noteStates.noteDetail);
  return { detail, setDetail };
};
