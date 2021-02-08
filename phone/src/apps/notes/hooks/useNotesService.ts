import { useSetRecoilState } from 'recoil';
import { useNuiEvent } from '../../../os/nui-events/hooks/useNuiEvent';
import { useNotes } from './useNotes';
import { noteStates } from './state';
import { useNotesAlert } from './useNoteAlert';

export const useNotesService = () => {
  const setNotes = useSetRecoilState(noteStates.noteItems);
  const setAlert = useSetRecoilState(noteStates.alert);
  useNuiEvent('NOTES', 'setNotes', setNotes);
  useNuiEvent('NOTES', 'setAlert', setAlert)
  return { useNotes, useNotesAlert };
};
