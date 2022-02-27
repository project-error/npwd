import { atom, selector, useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import fetchNui from '@utils/fetchNui';
import { NoteItem, NotesEvents } from '@typings/notes';
import LogDebugEvent from '../../../os/debug/LogDebugEvents';
import { isEnvBrowser } from '../../../utils/misc';
import { BrowserNotesData } from '../utils/constants';

export const noteStates = {
  noteItems: atom<NoteItem[]>({
    key: 'noteItem',
    default: selector({
      key: 'defaultNoteItems',
      get: async () => {
        try {
          const resp = await fetchNui<NoteItem[]>(NotesEvents.FETCH_ALL_NOTES);
          LogDebugEvent({ action: 'FetchNotes', data: resp });
          return resp ?? [];
        } catch (e) {
          if (isEnvBrowser()) {
            return BrowserNotesData;
          }
          console.error(e);
          return [];
        }
      },
    }),
  }),
  selectedNote: atom<NoteItem | null>({
    key: 'selectedNote',
    default: null,
  }),
  modalVisibile: atom({
    key: 'noteModalVisible',
    default: false,
  }),
};

export const useSetSelectedNote = () => useSetRecoilState(noteStates.selectedNote);
export const useSelectedNoteValue = () => useRecoilValue(noteStates.selectedNote);
export const useSelectedNote = () => useRecoilState(noteStates.selectedNote);

export const useSetModalVisible = () => useSetRecoilState(noteStates.modalVisibile);
export const useModalVisible = () => useRecoilState(noteStates.modalVisibile);

export const useNotesValue = () => useRecoilValue(noteStates.noteItems);
export const useSetNotes = () => useSetRecoilState(noteStates.noteItems);
