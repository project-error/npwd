import { useRecoilState } from 'recoil';
import { INotesAlert } from '../../../common/typings/notes';
import { noteStates } from './state';

export const useNotesAlert = (): INotesAlert => {
  const [alert, setAlert] = useRecoilState(noteStates.alert)
  return { alert, setAlert }
}