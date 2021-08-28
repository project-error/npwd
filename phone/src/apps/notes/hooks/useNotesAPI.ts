import { useCallback } from 'react';
import { fetchNui } from '../../../utils/fetchNui';
import { ServerPromiseResp } from '../../../../../typings/common';
import { BeforeDBNote, DeleteNoteDTO, NoteItem, NotesEvents } from '../../../../../typings/notes';
import { useSnackbar } from '../../../ui/hooks/useSnackbar';
import { useTranslation } from 'react-i18next';
import { useNotesActions } from './useNotesActions';

interface NotesAPIValue {
  addNewNote: (data: BeforeDBNote) => Promise<void>;
  deleteNote: (id: DeleteNoteDTO) => Promise<void>;
  updateNote: (note: NoteItem) => Promise<void>;
}

export const useNotesAPI = (): NotesAPIValue => {
  const { addAlert } = useSnackbar();
  const { t } = useTranslation();
  const { addLocalNote, deleteLocalNote, updateLocalNote } = useNotesActions();

  const addNewNote = useCallback(
    async ({ title, content }: BeforeDBNote) => {
      const resp = await fetchNui<ServerPromiseResp<NoteItem>>(NotesEvents.ADD_NOTE, {
        title,
        content,
      });

      if (resp.status !== 'ok') {
        return addAlert({
          message: t('APPS_NOTES_ADD_FAILED'),
          type: 'error',
        });
      }

      addLocalNote(resp.data);

      addAlert({
        message: t('APPS_NOTES_ADD_SUCCESS'),
        type: 'success',
      });
    },
    [addAlert, addLocalNote, t],
  );

  const deleteNote = useCallback(
    async (note: DeleteNoteDTO) => {
      const resp = await fetchNui<ServerPromiseResp<DeleteNoteDTO>>(NotesEvents.DELETE_NOTE, note);

      if (resp.status !== 'ok') {
        return addAlert({
          message: t('APPS_NOTES_DELETE_FAILED'),
          type: 'error',
        });
      }

      deleteLocalNote(resp.data.id);

      addAlert({
        message: t('APPS_NOTES_DELETE_SUCCESS'),
        type: 'success',
      });
    },
    [addAlert, deleteLocalNote, t],
  );

  const updateNote = useCallback(
    async ({ id, content, title }: NoteItem) => {
      const resp = await fetchNui<ServerPromiseResp>(NotesEvents.ADD_NOTE, { id, content, title });
      if (resp.status !== 'ok') {
        return addAlert({
          message: t('APPS_NOTES_UPDATE_FAILED'),
          type: 'error',
        });
      }

      updateLocalNote({ id, title, content });

      addAlert({
        message: t('APPS_NOTES_UPDATE_SUCCESS'),
        type: 'success',
      });
    },
    [addAlert, t, updateLocalNote],
  );

  return { addNewNote, deleteNote, updateNote };
};
