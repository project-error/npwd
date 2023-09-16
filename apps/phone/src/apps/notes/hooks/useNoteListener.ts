import { AddNoteExportData, NotesEvents } from '@typings/notes';
import { useApps } from '@os/apps/hooks/useApps';
import { useNavigate } from 'react-router-dom';
import qs from 'qs';
import { useNuiEvent } from '@common/hooks/useNuiEvent';
import { useCallback } from 'react';

export const useNoteListener = () => {
  const { getApp } = useApps();
  const navigate = useNavigate();

  const addNoteExportHandler = useCallback(
    (noteData: AddNoteExportData) => {
      const { path } = getApp('NOTES');
      const queryStr = qs.stringify(noteData);

      navigate({
        pathname: path,
        search: `?${queryStr}`,
      });
    },
    [navigate, getApp],
  );

  useNuiEvent('NOTES', NotesEvents.ADD_NOTE_EXPORT, addNoteExportHandler);
};
