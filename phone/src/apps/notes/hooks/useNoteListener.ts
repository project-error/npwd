import { AddNoteExportData, NotesEvents } from '@typings/notes';
import { useApp } from '@os/apps/hooks/useApps';
import { useHistory } from 'react-router';
import qs from 'qs';
import { useNuiEvent } from '@common/hooks/useNuiEvent';
import { useCallback } from 'react';

export const useNoteListener = () => {
  const { push } = useHistory();
  const { path } = useApp('NOTES');

  const addNoteExportHandler = useCallback(
    (noteData: AddNoteExportData) => {
      const queryStr = qs.stringify(noteData);

      push({
        pathname: path,
        search: `?${queryStr}`,
      });
    },
    [push, path],
  );

  useNuiEvent('NOTES', NotesEvents.ADD_NOTE_EXPORT, addNoteExportHandler);
};
