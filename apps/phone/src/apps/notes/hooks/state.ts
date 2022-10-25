import { atom, selector, useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import fetchNui from '@utils/fetchNui';
import { ServerPromiseResp } from '@typings/common';
import { NoteItem, NotesEvents } from '@typings/notes';
import LogDebugEvent from '../../../os/debug/LogDebugEvents';
import { isEnvBrowser } from '../../../utils/misc';
import { BrowserNotesData } from '../utils/constants';

const noteItems = atom({
  key: 'noteItem',
  default: selector<NoteItem[]>({
    key: 'defaultNoteItems',
    get: async () => {
      try {
        const resp = await fetchNui<ServerPromiseResp<NoteItem[]>>(NotesEvents.FETCH_ALL_NOTES);
        LogDebugEvent({ action: 'FetchNotes', data: resp.data });
        return resp.data;
      } catch (e) {
        if (isEnvBrowser()) {
          return BrowserNotesData;
        }
        console.error(e);
        return [];
      }
    },
  }),
});
const selectedNote = atom<Partial<NoteItem> | null>({
  key: 'selectedNote',
  default: null,
});

const modalVisibile = atom({
  key: 'noteModalVisible',
  default: false,
});

export const useSetSelectedNote = () => useSetRecoilState(selectedNote);
export const useSelectedNoteValue = () => useRecoilValue(selectedNote);
export const useSelectedNote = () => useRecoilState(selectedNote);

export const useSetModalVisible = () => useSetRecoilState(modalVisibile);
export const useModalVisible = () => useRecoilState(modalVisibile);

export const useNotesValue = () => useRecoilValue(noteItems);
export const useSetNotes = () => useSetRecoilState(noteItems);
