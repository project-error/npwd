import { useCallback } from 'react';
import fetchNui from '@utils/fetchNui';
import { ServerPromiseResp } from '@typings/common';
import { BeforeDBNote, DeleteNoteDTO, NoteItem, NotesEvents } from '@typings/notes';
import { useSnackbar } from '@os/snackbar/hooks/useSnackbar';
import { useTranslation } from 'react-i18next';
import { useNotesActions } from './useNotesActions';

interface NotesAPIValue {
  addNewNote: (data: BeforeDBNote) => Promise<void>;
  deleteNote: (id: DeleteNoteDTO) => Promise<void>;
  updateNote: (note: NoteItem) => Promise<void>;
}

export const useNotesAPI = (): NotesAPIValue => {
  const { addAlert } = useSnackbar();
  const [t] = useTranslation();
  const { addLocalNote, deleteLocalNote, updateLocalNote } = useNotesActions();

  const addNewNote = useCallback(
    async ({ title, content }: BeforeDBNote) => {
      const resp = await fetchNui<NoteItem>(NotesEvents.ADD_NOTE, {
        title,
        content,
      }).catch(() => {
        return addAlert({
          message: t('NOTES.FEEDBACK.ADD_FAILED'),
          type: 'error',
        });
      });

      resp && addLocalNote(resp);

      addAlert({
        message: t('NOTES.FEEDBACK.ADD_SUCCESS'),
        type: 'success',
      });
    },
    [addAlert, addLocalNote, t],
  );

  const deleteNote = useCallback(
    async (note: DeleteNoteDTO) => {
      const resp = await fetchNui<DeleteNoteDTO>(NotesEvents.DELETE_NOTE, note).catch(() => {
        return addAlert({
          message: t('NOTES.FEEDBACK.DELETE_FAILED'),
          type: 'error',
        });
      });

      resp?.id && deleteLocalNote(resp.id);

      addAlert({
        message: t('NOTES.FEEDBACK.DELETE_SUCCESS'),
        type: 'success',
      });
    },
    [addAlert, deleteLocalNote, t],
  );

  const updateNote = useCallback(
    async ({ id, content, title }: NoteItem) => {
      await fetchNui<ServerPromiseResp>(NotesEvents.UPDATE_NOTE, {
        id,
        content,
        title,
      }).catch(() => {
        return addAlert({
          message: t('NOTES.FEEDBACK.UPDATE_FAILED'),
          type: 'error',
        });
      });

      updateLocalNote({ id, title, content });

      addAlert({
        message: t('NOTES.FEEDBACK.UPDATE_SUCCESS'),
        type: 'success',
      });
    },
    [addAlert, t, updateLocalNote],
  );

  return { addNewNote, deleteNote, updateNote };
};
