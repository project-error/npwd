import { useSetRecoilState } from 'recoil';
import { useNuiEvent } from '../../../os/nui-events/hooks/useNuiEvent';
import { useNotes } from './useNotes';
import { noteStates } from './state';
import { useSnackbar } from '../../../ui/hooks/useSnackbar';

export const useNotesService = () => {
  const { addAlert } = useSnackbar();
  const setNotes = useSetRecoilState(noteStates.noteItems);

  useNuiEvent('NOTES', 'setNotes', setNotes);
  useNuiEvent('NOTES', 'setAlert', addAlert);
  return useNotes();
};
