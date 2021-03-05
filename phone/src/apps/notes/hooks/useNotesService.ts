import { useSetRecoilState } from 'recoil';
import { useNuiEvent } from '../../../os/nui-events/hooks/useNuiEvent';
import { noteStates } from './state';
import { IAlert, useSnackbar } from '../../../ui/hooks/useSnackbar';
import { useTranslation } from 'react-i18next';

export const useNotesService = () => {
  const { addAlert } = useSnackbar();
  const setNotes = useSetRecoilState(noteStates.noteItems);
  const { t } = useTranslation();

  const handleAddAlert = ({ message, type }: IAlert) => {
    addAlert({
      message: t(`APPS_${message}`),
      type,
    });
  };

  useNuiEvent('NOTES', 'setNotes', setNotes);
  useNuiEvent('NOTES', 'setAlert', handleAddAlert);
};
