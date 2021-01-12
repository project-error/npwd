import { useSetRecoilState } from 'recoil';
import { useNuiEvent } from '../../../os/nui-events/hooks/useNuiEvent';
import { useNotes } from './useNotes';
import { noteStates } from './state';

export const useNotesService = () => {
  const setNotes = useSetRecoilState(noteStates.noteItems);
  useNuiEvent('NOTES', 'setNotes', setNotes);
  return useNotes();
};
