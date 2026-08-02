import { atom, useAtom, useAtomValue, useSetAtom } from 'jotai';
import { NoteItem, NotesEvents } from '@typings/notes';
import LogDebugEvent from '../../../os/debug/LogDebugEvents';
import { isEnvBrowser } from '../../../utils/misc';
import { BrowserNotesData } from '../utils/constants';
import { useQueryStateValue, useSetQueryState } from '@common/query/query-state';
import { fetchNuiData } from '@common/query/fetch-nui-query';

const NOTES_QUERY_KEY = ['notes'] as const;

const fetchNotes = async () => {
  try {
    const notes = await fetchNuiData<NoteItem[]>(NotesEvents.FETCH_ALL_NOTES);
    LogDebugEvent({ action: 'FetchNotes', data: notes });
    return notes;
  } catch (e) {
    if (isEnvBrowser()) {
      return BrowserNotesData;
    }
    console.error(e);
    return [];
  }
};

const selectedNote = atom<Partial<NoteItem> | null>(null);

const modalVisibile = atom(false);

export const useSetSelectedNote = () => useSetAtom(selectedNote);
export const useSelectedNoteValue = () => useAtomValue(selectedNote);
export const useSelectedNote = () => useAtom(selectedNote);

export const useSetModalVisible = () => useSetAtom(modalVisibile);
export const useModalVisible = () => useAtom(modalVisibile);

export const useNotesValue = () => useQueryStateValue<NoteItem[]>(NOTES_QUERY_KEY, fetchNotes, []);
export const useSetNotes = () => useSetQueryState<NoteItem[]>(NOTES_QUERY_KEY, []);
